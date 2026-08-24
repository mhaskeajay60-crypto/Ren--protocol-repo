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

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
