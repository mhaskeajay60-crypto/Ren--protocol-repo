import { startLogin } from "./const";
import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./_core/hooks/useAuth";
import { hasStoryDecision, proposalTitleFrom } from "./lib/guidedDecisionFlow";
import "./team.css";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({
    url: "/api/trpc",
    transformer: superjson,
    fetch(input, init) {
      return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
    },
  })],
});

type Visibility = "private" | "team" | "restricted";
type JoinRole = "writer" | "watcher";
type CanonCategory = "character" | "world_rule" | "location" | "lore" | "plot" | "other";

const canonCategories: Array<{ value: CanonCategory; label: string; hint: string }> = [
  { value: "character", label: "Character", hint: "Someone important" },
  { value: "world_rule", label: "World rule", hint: "How the world works" },
  { value: "location", label: "Location", hint: "A place or setting" },
  { value: "lore", label: "Lore", hint: "History or terminology" },
  { value: "plot", label: "Plot", hint: "A story event or secret" },
  { value: "other", label: "Other", hint: "Something else" },
];

function roleLabel(role: string) {
  return role === "owner" ? "Ruler" : role === "watcher" ? "Watcher" : "Writer";
}

function categoryLabel(category: string) {
  return canonCategories.find(item => item.value === category)?.label || category.replace("_", " ");
}

function resetTeamLoginState() {
  try {
    sessionStorage.removeItem("manus-cookie");
    sessionStorage.removeItem("manus-runtime-user-info");
    document.cookie = "__Host-oauth_state=; Path=/; Max-Age=0; SameSite=None; Secure";
  } catch {
    // Best effort only.
  }
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</section>;
}

function StepDots({ current, total }: { current: number; total: number }) {
  return <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`}>
    {Array.from({ length: total }, (_, index) => <span key={index} className={`h-2.5 w-2.5 rounded-full ${index < current ? "bg-violet-600" : "bg-slate-200"}`} />)}
    <span className="ml-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Step {current} of {total}</span>
  </div>;
}

function TeamApp() {
  const { user, loading, logout } = useAuth();
  const utils = trpc.useUtils();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [joinTeamId, setJoinTeamId] = useState("");
  const [joinRole, setJoinRole] = useState<JoinRole>("writer");
  const [joinMessage, setJoinMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const inviteToken = useMemo(() => new URLSearchParams(window.location.search).get("invite") || "", []);

  const teams = trpc.team.mine.useQuery(undefined, { enabled: Boolean(user) });
  const myJoinRequests = trpc.team.myJoinRequests.useQuery(undefined, { enabled: Boolean(user) });
  const overview = trpc.team.overview.useQuery(
    { teamId: selectedTeamId || 0 },
    { enabled: Boolean(user && selectedTeamId) },
  );

  useEffect(() => {
    if (!selectedTeamId && teams.data?.[0]?.team.id) setSelectedTeamId(teams.data[0].team.id);
  }, [selectedTeamId, teams.data]);

  const refreshOverview = async () => {
    if (selectedTeamId) await utils.team.overview.invalidate({ teamId: selectedTeamId });
  };
  const createTeam = trpc.team.create.useMutation({
    onSuccess: async ({ teamId }) => {
      await utils.team.mine.invalidate();
      setSelectedTeamId(teamId);
      setTeamName("");
      setTeamDescription("");
    },
  });
  const requestJoin = trpc.team.requestJoin.useMutation({
    onSuccess: async () => {
      setJoinTeamId("");
      setJoinMessage("");
      await utils.team.myJoinRequests.invalidate();
    },
  });
  const reviewJoinRequest = trpc.team.reviewJoinRequest.useMutation({ onSuccess: refreshOverview });
  const createInvitation = trpc.team.createInvitation.useMutation({
    onSuccess: async ({ token }) => {
      setInviteUrl(`${window.location.origin}/team?invite=${token}`);
      setInviteEmail("");
      await refreshOverview();
    },
  });
  const acceptInvitation = trpc.team.acceptInvitation.useMutation({
    onSuccess: async ({ teamId }) => {
      await utils.team.mine.invalidate();
      setSelectedTeamId(teamId);
      window.history.replaceState({}, "", "/team");
    },
  });
  const revokeInvitation = trpc.team.revokeInvitation.useMutation({ onSuccess: refreshOverview });

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-700">Opening private group workspace…</main>;
  }

  if (!user) {
    return <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50 px-5 py-14 text-slate-900"><div className="mx-auto max-w-2xl"><Card><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">The Ren Protocol / Private group</p><h1 className="mt-3 text-4xl font-black">A protected shared-universe space.</h1><p className="mt-4 max-w-xl leading-7 text-slate-600">The public demo remains local to each browser. This separate group workspace requires sign-in and accepted membership before anyone can view group information.</p><div className="mt-7 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white" onClick={() => { resetTeamLoginState(); startLogin("/team"); }}>Sign in to private group</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => { resetTeamLoginState(); window.location.assign("/team"); }}>Reset sign-in</button><a className="rounded-xl border border-slate-200 px-5 py-3 font-bold" href="/">Return to local demo</a></div><p className="mt-5 text-sm text-slate-500">Reset clears only a private-group sign-in attempt, never your local manuscript or Story Vault.</p></Card></div></main>;
  }

  if (inviteToken) {
    return <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50 px-5 py-14 text-slate-900"><div className="mx-auto max-w-xl"><Card><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Private invitation</p><h1 className="mt-3 text-3xl font-black">Choose your private default.</h1><p className="mt-4 leading-7 text-slate-600">You are signed in as <strong>{user.email || user.name || "this account"}</strong>. This link works only for the invited email address.</p><label className="mt-6 block text-sm font-bold">Default visibility<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={visibility} onChange={event => setVisibility(event.target.value as Visibility)}><option value="private">Private — only me</option><option value="team">Team — all accepted members</option><option value="restricted">Restricted — later option</option></select></label>{acceptInvitation.error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{acceptInvitation.error.message}</p> : null}<div className="mt-7 flex gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={acceptInvitation.isPending} onClick={() => acceptInvitation.mutate({ token: inviteToken, defaultVisibility: visibility })}>{acceptInvitation.isPending ? "Joining…" : "Join private group"}</button><a className="rounded-xl border border-slate-200 px-5 py-3 font-bold" href="/team">Keep private</a></div></Card></div></main>;
  }

  const current = overview.data;
  const isRuler = current?.membership.role === "owner";
  const canRequest = Number.isInteger(Number(joinTeamId)) && Number(joinTeamId) > 0;
  const joinCard = <JoinCard teamId={joinTeamId} role={joinRole} message={joinMessage} pending={requestJoin.isPending} error={requestJoin.error?.message} requests={myJoinRequests.data || []} onTeamId={setJoinTeamId} onRole={setJoinRole} onMessage={setJoinMessage} onSubmit={() => requestJoin.mutate({ teamId: Number(joinTeamId), requestedRole: joinRole, message: joinMessage })} canSubmit={canRequest} />;

  return <main className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">The Ren Protocol</p><h1 className="text-xl font-black">Private Group / Canon archive</h1></div><div className="flex items-center gap-3"><span className="hidden text-sm text-slate-500 sm:inline">{user.email || user.name}</span><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={logout}>Sign out</button><a className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white" href="/">Local demo</a></div></div></header><div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[250px_1fr]"><aside><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">My groups</p><div className="mt-3 space-y-2">{teams.data?.length ? teams.data.map(entry => <button key={entry.team.id} className={`w-full rounded-xl p-3 text-left ${entry.team.id === selectedTeamId ? "bg-violet-50 text-violet-900" : "hover:bg-slate-50"}`} onClick={() => setSelectedTeamId(entry.team.id)}><strong className="block">{entry.team.name}</strong><span className="text-xs text-slate-500">{roleLabel(entry.membership.role)} · {entry.membership.defaultVisibility}</span></button>) : <p className="text-sm text-slate-500">No accepted group yet.</p>}</div></Card></aside><div className="space-y-6">{teams.data?.length === 0 ? <><CreateTeamCard teamName={teamName} description={teamDescription} pending={createTeam.isPending} error={createTeam.error?.message} onName={setTeamName} onDescription={setTeamDescription} onCreate={() => createTeam.mutate({ name: teamName, description: teamDescription })} />{joinCard}</> : current ? <><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Protected group</p><div className="mt-2 flex flex-wrap justify-between gap-3"><div><h2 className="text-3xl font-black">{current.team.name}</h2><p className="mt-2 text-slate-600">{current.team.description || "This private group can review deliberate canon proposals."}</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">{roleLabel(current.membership.role)} · {current.membership.defaultVisibility}</span></div><p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Only text deliberately entered in a Canon Proposal reaches this private cloud. A Ruler must approve it before all members can read it. Your local writing and Story Vault stay separate.</p><p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Private group number: {current.team.id}</p></Card><CanonArchive current={current} teamId={selectedTeamId!} isRuler={Boolean(isRuler)} canPropose={current.membership.role !== "watcher"} /><MembersCard members={current.members} />{isRuler ? <RulerControls current={current} teamId={selectedTeamId!} inviteEmail={inviteEmail} inviteUrl={inviteUrl} reviewPending={reviewJoinRequest.isPending} invitePending={createInvitation.isPending} inviteError={createInvitation.error?.message} onInviteEmail={setInviteEmail} onApprove={requestId => reviewJoinRequest.mutate({ teamId: selectedTeamId!, requestId, decision: "approve" })} onReject={requestId => reviewJoinRequest.mutate({ teamId: selectedTeamId!, requestId, decision: "reject" })} onCreateInvite={() => createInvitation.mutate({ teamId: selectedTeamId!, inviteeEmail: inviteEmail })} onCopy={() => navigator.clipboard.writeText(inviteUrl)} onRevoke={invitationId => revokeInvitation.mutate({ teamId: selectedTeamId!, invitationId })} /> : null}{joinCard}</> : <Card>Loading private group…</Card>}</div></div></main>;
}

function CreateTeamCard({ teamName, description, pending, error, onName, onDescription, onCreate }: { teamName: string; description: string; pending: boolean; error?: string; onName: (value: string) => void; onDescription: (value: string) => void; onCreate: () => void }) {
  const [showPurpose, setShowPurpose] = useState(Boolean(description));
  return <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Start securely</p><h2 className="mt-1 text-3xl font-black">Create a private group</h2><p className="mt-3 text-slate-600">You become its Ruler. No local chapters, Story Vault items, files, or canon are copied into this cloud workspace.</p><label className="mt-5 block text-sm font-bold">Name your group<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={teamName} onChange={event => onName(event.target.value)} placeholder="Neo Domain writers" /></label>{showPurpose ? <label className="mt-4 block text-sm font-bold">What is this group for? <span className="font-normal text-slate-500">(optional)</span><textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3" value={description} onChange={event => onDescription(event.target.value)} /></label> : <button type="button" className="mt-4 text-sm font-bold text-violet-700" onClick={() => setShowPurpose(true)}>+ Add a short purpose</button>}{error ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}<button className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={pending || teamName.trim().length < 2} onClick={onCreate}>{pending ? "Creating…" : "Create my private group"}</button></Card>;
}

function MembersCard({ members }: { members: any[] }) {
  return <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Members</p><h3 className="mt-1 text-xl font-black">{members.length} of 5 seats in use</h3><div className="mt-4 space-y-2">{members.map(member => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div><strong>{member.name || member.email || "Private member"}</strong><p className="text-sm text-slate-500">{member.email || "Email not available"}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{roleLabel(member.role)}</span></div>)}</div></Card>;
}

function CanonArchive({ current, teamId, isRuler, canPropose }: { current: any; teamId: number; isRuler: boolean; canPropose: boolean }) {
  const utils = trpc.useUtils();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CanonCategory | "all">("all");
  const [proposalStep, setProposalStep] = useState(1);
  const [proposalCategory, setProposalCategory] = useState<CanonCategory>("lore");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDecision, setProposalDecision] = useState("");
  const [proposalContext, setProposalContext] = useState("");
  const [showProposalDetails, setShowProposalDetails] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [revisionStep, setRevisionStep] = useState(1);
  const [showRevisionDetails, setShowRevisionDetails] = useState(false);
  const [editCategory, setEditCategory] = useState<CanonCategory>("lore");
  const [editTitle, setEditTitle] = useState("");
  const [editDecision, setEditDecision] = useState("");
  const [editContext, setEditContext] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [historyRecordId, setHistoryRecordId] = useState<number | null>(null);
  const history = trpc.team.canonHistory.useQuery({ teamId, recordId: historyRecordId || 0 }, { enabled: isRuler && Boolean(historyRecordId) });
  const refresh = async () => { await utils.team.overview.invalidate({ teamId }); };
  const propose = trpc.team.proposeCanon.useMutation({ onSuccess: async () => { setProposalTitle(""); setProposalDecision(""); setProposalContext(""); setProposalStep(1); setShowProposalDetails(false); await refresh(); } });
  const review = trpc.team.reviewCanon.useMutation({ onSuccess: refresh });
  const revise = trpc.team.reviseCanon.useMutation({ onSuccess: async () => { setEditing(null); setRevisionNote(""); setRevisionStep(1); setShowRevisionDetails(false); await refresh(); if (historyRecordId) await history.refetch(); } });
  const pending = current.canonProposals.filter((record: any) => record.status === "pending");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCanon = current.approvedCanon.filter((record: any) => {
    const categoryMatches = filter === "all" || record.category === filter;
    const text = `${record.title} ${record.decision} ${record.context || ""} ${record.category}`.toLowerCase();
    return categoryMatches && (!normalizedQuery || text.includes(normalizedQuery));
  });
  const derivedProposalTitle = proposalTitleFrom(proposalDecision, proposalTitle);
  const openEditor = (record: any) => {
    setEditing(record);
    setEditCategory(record.category as CanonCategory);
    setEditTitle(record.title);
    setEditDecision(record.decision);
    setEditContext(record.context || "");
    setRevisionNote("");
    setRevisionStep(1);
    setShowRevisionDetails(false);
  };

  return <><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Canon finder</p><h2 className="mt-1 text-2xl font-black">Approved group canon</h2><p className="mt-2 text-sm leading-6 text-slate-600">Search only the approved records shared in this private group. Your local writing and Story Vault stay outside this archive.</p><div className="mt-5 grid gap-3 sm:grid-cols-[1fr_210px]"><label className="text-sm font-bold">Find a decision<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={query} placeholder="Search title, decision, or reason" onChange={event => setQuery(event.target.value)} /></label><label className="text-sm font-bold">Type<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={filter} onChange={event => setFilter(event.target.value as CanonCategory | "all")}><option value="all">All types</option>{canonCategories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label></div><p className="mt-3 text-sm text-slate-500">{filteredCanon.length} approved {filteredCanon.length === 1 ? "record" : "records"} found.</p><div className="mt-5 space-y-3">{filteredCanon.length ? filteredCanon.map((record: any) => <article key={record.id} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-emerald-700">{categoryLabel(record.category)}</p><h3 className="mt-1 text-lg font-black text-slate-900">{record.title}</h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">Official canon</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{record.decision}</p>{record.context ? <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-slate-600"><strong>Why this matters:</strong> {record.context}</p> : null}{isRuler ? <div className="mt-4 flex flex-wrap gap-2"><button className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-bold text-violet-700" onClick={() => openEditor(record)}>Change this fact</button><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700" onClick={() => setHistoryRecordId(record.id)}>See earlier versions</button></div> : null}</article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No approved canon matches this search.</p>}</div></Card>{historyRecordId && isRuler ? <Card><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler-only history</p><h2 className="mt-1 text-2xl font-black">Earlier official wording</h2></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold" onClick={() => setHistoryRecordId(null)}>Close history</button></div><p className="mt-2 text-sm text-slate-600">Each entry is an immutable snapshot saved before a Ruler change.</p><div className="mt-5 space-y-3">{history.isLoading ? <p className="rounded-xl bg-slate-50 p-4 text-sm">Loading history…</p> : history.error ? <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{history.error.message}</p> : history.data?.length ? history.data.map(entry => <article key={entry.id} className="rounded-xl border border-slate-100 p-4"><p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">Version {entry.revisionNumber} · {categoryLabel(entry.category)}</p><h3 className="mt-1 text-lg font-black">{entry.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{entry.decision}</p>{entry.context ? <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><strong>Earlier reason:</strong> {entry.context}</p> : null}{entry.revisionNote ? <p className="mt-3 text-sm text-slate-500"><strong>Ruler note:</strong> {entry.revisionNote}</p> : null}</article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No earlier version exists yet.</p>}</div></Card> : null}{editing && isRuler ? <Card><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler change</p><h2 className="mt-1 text-2xl font-black">Change this fact safely</h2></div><StepDots current={revisionStep} total={2} /></div><p className="mt-2 text-sm leading-6 text-slate-600">Saving creates an immutable copy of the current official wording first. Local chapters and Story Vault items are not involved.</p>{revisionStep === 1 ? <div className="mt-5"><p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><strong>Current fact:</strong> {editing.decision}</p><label className="mt-4 block text-sm font-bold">What should the group treat as true now?<textarea className="mt-2 min-h-36 w-full rounded-xl border border-slate-200 p-3" maxLength={5000} value={editDecision} onChange={event => setEditDecision(event.target.value)} /></label><div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={!hasStoryDecision(editDecision)} onClick={() => setRevisionStep(2)}>Review this change</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => setEditing(null)}>Cancel</button></div></div> : <div className="mt-5"><p className="rounded-xl bg-violet-50 p-4 text-sm text-violet-900"><strong>New official fact:</strong> {editDecision}</p>{showRevisionDetails ? <div className="mt-4 grid gap-4"><label className="text-sm font-bold">Short name<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" maxLength={160} value={editTitle} onChange={event => setEditTitle(event.target.value)} /></label><div><p className="text-sm font-bold">What kind of fact is this?</p><div className="mt-2 flex flex-wrap gap-2">{canonCategories.map(item => <button type="button" key={item.value} className={`rounded-xl border px-3 py-2 text-sm font-bold ${editCategory === item.value ? "border-violet-600 bg-violet-50 text-violet-800" : "border-slate-200 bg-white text-slate-700"}`} onClick={() => setEditCategory(item.value)}>{item.label}</button>)}</div></div><label className="text-sm font-bold">Why does it matter? <span className="font-normal text-slate-500">(optional)</span><textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3" maxLength={1200} value={editContext} onChange={event => setEditContext(event.target.value)} /></label><label className="text-sm font-bold">Note for future Rulers <span className="font-normal text-slate-500">(optional)</span><textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3" maxLength={600} value={revisionNote} placeholder="Why did this fact change?" onChange={event => setRevisionNote(event.target.value)} /></label></div> : <button type="button" className="mt-4 text-sm font-bold text-violet-700" onClick={() => setShowRevisionDetails(true)}>+ Change name, type, or add a note</button>}{revise.error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{revise.error.message}</p> : null}<div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={revise.isPending || editTitle.trim().length < 2 || !hasStoryDecision(editDecision)} onClick={() => revise.mutate({ teamId, recordId: editing.id, category: editCategory, title: editTitle, decision: editDecision, context: editContext, revisionNote })}>{revise.isPending ? "Saving official version…" : "Save official change"}</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => setRevisionStep(1)}>Back</button></div></div>}</Card> : null}{canPropose ? <Card><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Story decision</p><h2 className="mt-1 text-2xl font-black">Suggest one fact for the group</h2></div><StepDots current={proposalStep} total={3} /></div><p className="mt-2 text-sm leading-6 text-slate-600">Only the words you type here are sent to the private group. Your private chapters, Story Vault, files, and notes are not selected automatically.</p>{proposalStep === 1 ? <div className="mt-5"><label className="block text-sm font-bold">What fact should the group treat as true?<textarea className="mt-2 min-h-36 w-full rounded-xl border border-slate-200 p-3" maxLength={5000} value={proposalDecision} placeholder="Example: The tower has an unseen watcher." onChange={event => setProposalDecision(event.target.value)} /></label><button className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={!hasStoryDecision(proposalDecision)} onClick={() => setProposalStep(2)}>Choose the kind of fact</button></div> : proposalStep === 2 ? <div className="mt-5"><p className="text-sm font-bold">What kind of story fact is this?</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{canonCategories.map(item => <button type="button" key={item.value} className={`rounded-2xl border p-4 text-left transition ${proposalCategory === item.value ? "border-violet-600 bg-violet-50 text-violet-900" : "border-slate-200 bg-white hover:border-violet-300"}`} onClick={() => setProposalCategory(item.value)}><strong className="block">{item.label}</strong><span className="mt-1 block text-sm text-slate-500">{item.hint}</span></button>)}</div><div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white" onClick={() => setProposalStep(3)}>Review my proposal</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => setProposalStep(1)}>Back</button></div></div> : <div className="mt-5"><p className="rounded-xl bg-violet-50 p-4 text-sm text-violet-900"><strong>{categoryLabel(proposalCategory)} decision:</strong> {proposalDecision}</p>{showProposalDetails ? <div className="mt-4 grid gap-4"><label className="text-sm font-bold">Short name <span className="font-normal text-slate-500">(optional)</span><input className="mt-2 w-full rounded-xl border border-slate-200 p-3" maxLength={160} value={proposalTitle} placeholder={derivedProposalTitle} onChange={event => setProposalTitle(event.target.value)} /></label><label className="text-sm font-bold">Why does it matter? <span className="font-normal text-slate-500">(optional)</span><textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3" maxLength={1200} value={proposalContext} placeholder="A short reason or story effect." onChange={event => setProposalContext(event.target.value)} /></label></div> : <button type="button" className="mt-4 text-sm font-bold text-violet-700" onClick={() => setShowProposalDetails(true)}>+ Add a short name or reason</button>}{propose.error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{propose.error.message}</p> : null}<div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={propose.isPending || derivedProposalTitle.length < 2 || !hasStoryDecision(proposalDecision)} onClick={() => propose.mutate({ teamId, category: proposalCategory, title: derivedProposalTitle, decision: proposalDecision, context: proposalContext })}>{propose.isPending ? "Sending…" : "Send as pending decision"}</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => setProposalStep(2)}>Back</button></div></div>}</Card> : <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Watcher access</p><h2 className="mt-1 text-2xl font-black">Read official canon only</h2><p className="mt-2 text-sm leading-6 text-slate-600">Watchers can search and read approved canon. They cannot submit, edit, approve, reject, or view Ruler history.</p></Card>}{isRuler ? <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler decisions</p><h2 className="mt-1 text-2xl font-black">Facts waiting for your decision</h2><p className="mt-2 text-sm leading-6 text-slate-600">Choose what the group may treat as official canon. The proposer’s local writing remains private either way.</p><div className="mt-5 space-y-3">{pending.length ? pending.map((record: any) => <article key={record.id} className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-600">{categoryLabel(record.category)} · suggested by {record.proposerName || record.proposerEmail || "Private member"}</p><h3 className="mt-1 text-lg font-black">{record.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{record.decision}</p>{record.context ? <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-slate-600"><strong>Why this matters:</strong> {record.context}</p> : null}</div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">Waiting for you</span></div><div className="mt-4 flex flex-wrap gap-2"><button className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60" disabled={review.isPending} onClick={() => review.mutate({ teamId, recordId: record.id, decision: "approve" })}>Make official canon</button><button className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-60" disabled={review.isPending} onClick={() => review.mutate({ teamId, recordId: record.id, decision: "reject" })}>Not now</button></div></article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No story decisions are waiting for you.</p>}</div></Card> : null}</>;
}

function RulerControls({ current, teamId, inviteEmail, inviteUrl, reviewPending, invitePending, inviteError, onInviteEmail, onApprove, onReject, onCreateInvite, onCopy, onRevoke }: { current: any; teamId: number; inviteEmail: string; inviteUrl: string; reviewPending: boolean; invitePending: boolean; inviteError?: string; onInviteEmail: (value: string) => void; onApprove: (requestId: number) => void; onReject: (requestId: number) => void; onCreateInvite: () => void; onCopy: () => void; onRevoke: (invitationId: number) => void }) {
  const pending = current.joinRequests.filter((request: any) => request.status === "pending");
  return <><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler decisions</p><h3 className="mt-1 text-xl font-black">People waiting to join</h3><p className="mt-2 text-sm text-slate-600">Choosing a member adds only a group membership. It never imports a requester’s manuscript, Story Vault, or private local files.</p><div className="mt-4 space-y-3">{pending.length ? pending.map((request: any) => <article key={request.id} className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-600">Wants to join as {roleLabel(request.requestedRole)}</p><h4 className="mt-1 text-lg font-black">{request.name || request.email || "Private requester"}</h4><p className="text-sm text-slate-500">{request.email || "Email unavailable"}</p>{request.message ? <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm">{request.message}</p> : null}</div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">Waiting for you</span></div><div className="mt-4 flex flex-wrap gap-2"><button className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60" disabled={reviewPending} onClick={() => onApprove(request.id)}>Make {roleLabel(request.requestedRole)} a member</button><button className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-60" disabled={reviewPending} onClick={() => onReject(request.id)}>Not now</button></div></article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No people are waiting to join.</p>}</div></Card><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler-only invitations</p><h3 className="mt-1 text-xl font-black">Invite a Writer by email</h3><p className="mt-2 text-sm text-slate-600">The existing invitation option remains private and one-use. Its raw token is not stored by the server.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input className="min-w-0 flex-1 rounded-xl border border-slate-200 p-3" type="email" value={inviteEmail} placeholder="writer@example.com" onChange={event => onInviteEmail(event.target.value)} /><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={invitePending || !inviteEmail.trim()} onClick={onCreateInvite}>{invitePending ? "Creating…" : "Create invite"}</button></div>{inviteError ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{inviteError}</p> : null}{inviteUrl ? <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3"><strong className="text-sm text-emerald-900">Copy this private invitation link now</strong><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input className="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white p-2 text-sm" readOnly value={inviteUrl} /><button className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800" onClick={onCopy}>Copy link</button></div></div> : null}{current.invitations.length ? <div className="mt-4 space-y-2">{current.invitations.map((invitation: any) => <div key={invitation.id} className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-100 p-3 text-sm"><span>{invitation.inviteeEmail} · {invitation.status}</span>{invitation.status === "pending" ? <button className="font-bold text-rose-700" onClick={() => onRevoke(invitation.id)}>Revoke</button> : null}</div>)}</div> : null}</Card></>;
}

function JoinCard({ teamId, role, message, pending, error, requests, onTeamId, onRole, onMessage, onSubmit, canSubmit }: { teamId: string; role: JoinRole; message: string; pending: boolean; error?: string; requests: any[]; onTeamId: (value: string) => void; onRole: (value: JoinRole) => void; onMessage: (value: string) => void; onSubmit: () => void; canSubmit: boolean }) {
  const [step, setStep] = useState(1);
  const [showNote, setShowNote] = useState(Boolean(message));
  const submit = () => {
    if (canSubmit) onSubmit();
  };
  return <Card><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ask to join</p><h2 className="mt-1 text-2xl font-black">Join a private story group</h2></div><StepDots current={step} total={3} /></div><p className="mt-2 text-sm leading-6 text-slate-600">Your request stays pending until a Ruler decides. It never sends your local writing, Story Vault, PDFs, or notes.</p>{step === 1 ? <div className="mt-5"><p className="text-sm font-bold">How would you like to take part?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" className={`rounded-2xl border p-5 text-left ${role === "writer" ? "border-violet-600 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"}`} onClick={() => onRole("writer")}><strong className="block text-lg">I want to write</strong><span className="mt-1 block text-sm text-slate-600">I can suggest story facts and read official canon.</span></button><button type="button" className={`rounded-2xl border p-5 text-left ${role === "watcher" ? "border-violet-600 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"}`} onClick={() => onRole("watcher")}><strong className="block text-lg">I only want to read</strong><span className="mt-1 block text-sm text-slate-600">I can read and search official canon, but cannot change it.</span></button></div><button className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white" onClick={() => setStep(2)}>Continue</button></div> : step === 2 ? <div className="mt-5"><label className="block text-sm font-bold">What is the private group number?<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" inputMode="numeric" value={teamId} placeholder="Example: 12" onChange={event => onTeamId(event.target.value.replace(/\D/g, ""))} /></label><p className="mt-2 text-sm text-slate-500">Ask the Ruler for this number. It is not your personal account number.</p><div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={!canSubmit} onClick={() => setStep(3)}>Review my request</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => setStep(1)}>Back</button></div></div> : <div className="mt-5"><div className="rounded-xl bg-violet-50 p-4 text-sm text-violet-900"><strong>You are asking to join as a {roleLabel(role)}.</strong><br />Group number: {teamId}</div>{showNote ? <label className="mt-4 block text-sm font-bold">A short note for the Ruler <span className="font-normal text-slate-500">(optional)</span><textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3" maxLength={600} value={message} placeholder="Why would you like to join?" onChange={event => onMessage(event.target.value)} /></label> : <button type="button" className="mt-4 text-sm font-bold text-violet-700" onClick={() => setShowNote(true)}>+ Add a note for the Ruler</button>}{error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}<div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={!canSubmit || pending} onClick={submit}>{pending ? "Sending request…" : "Send my request"}</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" onClick={() => setStep(2)}>Back</button></div></div>}{requests.length ? <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-sm font-bold">My recent requests</p><div className="mt-2 space-y-2">{requests.map(entry => <div key={entry.request.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 p-3 text-sm"><span><strong>{entry.team.name}</strong> · {roleLabel(entry.request.requestedRole)}</span><span className="font-bold capitalize">{entry.request.status}</span></div>)}</div></div> : null}</Card>;
}

createRoot(document.getElementById("root")!).render(<trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><TeamApp /></QueryClientProvider></trpc.Provider>);
