import { COOKIE_NAME } from "@shared/const";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

const organizerItemSchema = z.object({
  type: z.enum(["character", "world_rule", "location", "lore", "faction", "artifact", "plot_thread", "scene", "note", "revision_issue"]),
  category: z.enum(["Character", "Worldbuilding", "Plot", "Drafting", "Research", "Revision"]),
  tags: z.array(z.string().min(1).max(48)).min(1).max(6),
  title: z.string().min(1).max(180),
  description: z.string().min(1).max(2400),
  role: z.string().max(160),
  status: z.string().max(80),
  stage: z.string().max(80),
  pov: z.string().max(120),
  linked: z.string().max(240),
});

export const organizerResponseSchema = z.object({
  summary: z.string().min(1).max(1600),
  items: z.array(organizerItemSchema).max(15),
});

export function parseOrganizerResponse(content: string) {
  return organizerResponseSchema.parse(JSON.parse(content));
}

export const composerResponseSchema = z.object({
  sectionTitle: z.string().min(1).max(180),
  section: z.string().min(80).max(9000),
  craftNote: z.string().max(600),
});

export function parseComposerResponse(content: string) {
  return composerResponseSchema.parse(JSON.parse(content));
}

export const rewriteResponseSchema = z.object({
  rewrittenText: z.string().min(20).max(12000),
  craftNote: z.string().max(700),
});

export function parseRewriteResponse(content: string) {
  return rewriteResponseSchema.parse(JSON.parse(content));
}

const consistencyFlagSchema = z.object({
  severity: z.enum(["note", "watch", "conflict"]),
  focus: z.string().min(1).max(160),
  detail: z.string().min(1).max(700),
});

export const consistencyResponseSchema = z.object({
  summary: z.string().min(1).max(900),
  strengths: z.array(z.string().min(1).max(320)).max(6),
  flags: z.array(consistencyFlagSchema).max(8),
  openQuestions: z.array(z.string().min(1).max(320)).max(6),
});

export function parseConsistencyResponse(content: string) {
  return consistencyResponseSchema.parse(JSON.parse(content));
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  organizer: router({
    organize: publicProcedure
      .input(z.object({ text: z.string().min(30, "Add a little more material before organizing.").max(16000) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are The Ren Protocol's private novel-development organizer. Analyze only the supplied Brain Dump. Return concise structured suggestions for a personal story archive. Never invent facts that are not reasonably supported by the text. Prefer uncertainty as a note or revision_issue. Suggestions are drafts for the author to review, not canonical truth. Give every item one review category and one to six useful lowercase tags. Keep output to at most 15 items and keep the summary under 300 characters.",
            },
            {
              role: "user",
              content: `Organize this Brain Dump into possible characters, world rules, locations, lore, factions, artifacts, plot threads, scenes, notes, and revision issues.\n\n${input.text}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "brain_dump_organization",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["character", "world_rule", "location", "lore", "faction", "artifact", "plot_thread", "scene", "note", "revision_issue"] },
                        category: { type: "string", enum: ["Character", "Worldbuilding", "Plot", "Drafting", "Research", "Revision"] },
                        tags: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 6 },
                        title: { type: "string" },
                        description: { type: "string" },
                        role: { type: "string" },
                        status: { type: "string" },
                        stage: { type: "string" },
                        pov: { type: "string" },
                        linked: { type: "string" },
                      },
                      required: ["type", "category", "tags", "title", "description", "role", "status", "stage", "pov", "linked"],
                      additionalProperties: false,
                    },
                    maxItems: 15,
                  },
                },
                required: ["summary", "items"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("The organizer returned no usable suggestions. Please try again.");
        }
        return parseOrganizerResponse(content);
      }),
  }),

  composer: router({
    generate: publicProcedure
      .input(z.object({
        chapterTitle: z.string().min(1).max(180),
        brief: z.string().min(20, "Describe what should happen in this section.").max(6000),
        requirements: z.string().max(4000),
        pov: z.string().max(120),
        tone: z.string().max(160),
        length: z.enum(["short", "medium", "long"]),
        chapterContext: z.string().max(7000),
        canonContext: z.string().max(7000),
      }))
      .mutation(async ({ input }) => {
        const requestedWords = input.length === "short" ? "350–550" : input.length === "long" ? "1100–1500" : "700–1000";
        const response = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are a collaborative novel-writing assistant. Draft only the requested section; the author retains all control. Respect the supplied canon and chapter context, do not contradict established facts, do not summarize instead of dramatizing, and do not add authorial notes inside the prose. If an instruction conflicts with canon, preserve canon and mention the uncertainty only in craftNote. Match the user’s requested point of view and tone. Produce a self-contained, editable narrative section of the requested size.",
            },
            {
              role: "user",
              content: `CHAPTER: ${input.chapterTitle}\n\nSECTION BRIEF:\n${input.brief}\n\nREQUIREMENTS:\n${input.requirements || 'No additional requirements.'}\n\nPOINT OF VIEW: ${input.pov || 'Use the chapter context.'}\nTONE: ${input.tone || 'Use the chapter context.'}\nTARGET LENGTH: ${requestedWords} words\n\nEXISTING CHAPTER CONTEXT:\n${input.chapterContext || 'No existing text supplied.'}\n\nMASTERBOOK CANON:\n${input.canonContext || 'No Masterbook facts supplied.'}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "guided_chapter_section",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  sectionTitle: { type: "string" },
                  section: { type: "string" },
                  craftNote: { type: "string" },
                },
                required: ["sectionTitle", "section", "craftNote"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("The chapter composer returned no usable draft. Please try again.");
        }
        return parseComposerResponse(content);
      }),
  }),

  revision: router({
    rewrite: publicProcedure
      .input(z.object({
        selectedText: z.string().min(20, "Select at least a short passage to rewrite.").max(12000),
        focus: z.enum(["clarity", "pacing", "dialogue", "description", "emotion", "show_dont_tell", "custom"]),
        tone: z.enum(["preserve", "more_atmospheric", "more_direct", "more_tense", "more_tender", "more_literary", "custom"]),
        instruction: z.string().max(2500),
        chapterTitle: z.string().max(180),
        chapterContext: z.string().max(7000),
        canonContext: z.string().max(7000),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are an author-controlled prose editor. Rewrite only the selected passage according to the requested focus and tone. Preserve the story facts, point of view, tense, and character names unless the author explicitly instructs otherwise. Do not add commentary inside rewrittenText. Return a concise craftNote explaining the main change. This is a proposal for review, never an automatic manuscript edit.",
            },
            {
              role: "user",
              content: `CHAPTER: ${input.chapterTitle || 'Untitled'}\n\nREVISION FOCUS: ${input.focus}\nTONE DIRECTION: ${input.tone}\nAUTHOR INSTRUCTION: ${input.instruction || 'No additional instruction.'}\n\nSELECTED PASSAGE TO REWRITE:\n${input.selectedText}\n\nCHAPTER CONTEXT:\n${input.chapterContext || 'No additional chapter context supplied.'}\n\nMASTERBOOK CANON:\n${input.canonContext || 'No Masterbook facts supplied.'}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "author_reviewed_rewrite",
              strict: true,
              schema: {
                type: "object",
                properties: { rewrittenText: { type: "string" }, craftNote: { type: "string" } },
                required: ["rewrittenText", "craftNote"],
                additionalProperties: false,
              },
            },
          },
        });
        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") throw new Error("The rewrite assistant returned no usable proposal. Please try again.");
        return parseRewriteResponse(content);
      }),

    consistency: publicProcedure
      .input(z.object({ chapterTitle: z.string().max(180), chapterText: z.string().min(80, "Add more chapter text before requesting a consistency review.").max(16000), canonContext: z.string().max(8000) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are a careful novel-development continuity reader. Compare the supplied chapter only against the supplied Masterbook canon. State confirmed strengths separately from possible conflicts and open questions. Never invent canon or present a possibility as a fact. This is an author review aid, not a verdict. Keep items concrete and useful.",
            },
            { role: "user", content: `CHAPTER: ${input.chapterTitle || 'Untitled'}\n\nCHAPTER TEXT:\n${input.chapterText}\n\nMASTERBOOK CANON:\n${input.canonContext || 'No Masterbook facts are available yet. Identify only internal questions, not canon conflicts.'}` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "chapter_consistency_review",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  strengths: { type: "array", items: { type: "string" }, maxItems: 6 },
                  flags: { type: "array", items: { type: "object", properties: { severity: { type: "string", enum: ["note", "watch", "conflict"] }, focus: { type: "string" }, detail: { type: "string" } }, required: ["severity", "focus", "detail"], additionalProperties: false }, maxItems: 8 },
                  openQuestions: { type: "array", items: { type: "string" }, maxItems: 6 },
                },
                required: ["summary", "strengths", "flags", "openQuestions"],
                additionalProperties: false,
              },
            },
          },
        });
        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") throw new Error("The consistency reader returned no usable review. Please try again.");
        return parseConsistencyResponse(content);
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
