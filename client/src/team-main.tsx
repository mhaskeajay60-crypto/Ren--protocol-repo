import { startLogin } from "./const";
import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./_core/hooks/useAuth";
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

const canonCategories: Array<{ value: CanonCategory; label: string }> = [
  { value: "character", label: "Character" },
  { value: "world_rule", label: "World rule" },
  { value: "location", label: "Location" },
  { value: "lore", label: "Lore" },
  { value: "plot", label: "Plot" },
  { value: "other", label: "Other" },
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

  return <main className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">The Ren Protocol</p><h1 className="text-xl font-black">Private Group / Canon archive</h1></div><div className="flex items-center gap-3"><span className="hidden text-sm text-slate-500 sm:inline">{user.email || user.name}</span><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold" onClick={logout}>Sign out</button><a className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white" href="/">Local demo</a></div></div></header><div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[250px_1fr]"><aside><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">My groups</p><div className="mt-3 space-y-2">{teams.data?.length ? teams.data.map(entry => <button key={entry.team.id} className={`w-full rounded-xl p-3 text-left ${entry.team.id === selectedTeamId ? "bg-violet-50 text-violet-900" : "hover:bg-slate-50"}`} onClick={() => setSelectedTeamId(entry.team.id)}><strong className="block">{entry.team.name}</strong><span className="text-xs text-slate-500">{roleLabel(entry.membership.role)} · {entry.membership.defaultVisibility}</span></button>) : <p className="text-sm text-slate-500">No accepted group yet.</p>}</div></Card></aside><div className="space-y-6">{teams.data?.length === 0 ? <CreateTeamCard teamName={teamName} description={teamDescription} pending={createTeam.isPending} error={createTeam.error?.message} onName={setTeamName} onDescription={setTeamDescription} onCreate={() => createTeam.mutate({ name: teamName, description: teamDescription })} /> : current ? <><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Protected group</p><div className="mt-2 flex flex-wrap justify-between gap-3"><div><h2 className="text-3xl font-black">{current.team.name}</h2><p className="mt-2 text-slate-600">{current.team.description || "This private group can review deliberate canon proposals."}</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">{roleLabel(current.membership.role)} · {current.membership.defaultVisibility}</span></div><p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Only text deliberately entered in a Canon Proposal reaches this private cloud. A Ruler must approve it before all members can read it. Your local writing and Story Vault stay separate.</p><p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Private group number: {current.team.id}</p></Card><CanonArchive current={current} teamId={selectedTeamId!} isRuler={Boolean(isRuler)} canPropose={current.membership.role !== "watcher"} /><MembersCard members={current.members} />{isRuler ? <RulerControls current={current} teamId={selectedTeamId!} inviteEmail={inviteEmail} inviteUrl={inviteUrl} reviewPending={reviewJoinRequest.isPending} invitePending={createInvitation.isPending} inviteError={createInvitation.error?.message} onInviteEmail={setInviteEmail} onApprove={requestId => reviewJoinRequest.mutate({ teamId: selectedTeamId!, requestId, decision: "approve" })} onReject={requestId => reviewJoinRequest.mutate({ teamId: selectedTeamId!, requestId, decision: "reject" })} onCreateInvite={() => createInvitation.mutate({ teamId: selectedTeamId!, inviteeEmail: inviteEmail })} onCopy={() => navigator.clipboard.writeText(inviteUrl)} onRevoke={invitationId => revokeInvitation.mutate({ teamId: selectedTeamId!, invitationId })} /> : null}</> : <Card>Loading private group…</Card>}<JoinCard teamId={joinTeamId} role={joinRole} message={joinMessage} pending={requestJoin.isPending} error={requestJoin.error?.message} requests={myJoinRequests.data || []} onTeamId={setJoinTeamId} onRole={setJoinRole} onMessage={setJoinMessage} onSubmit={() => requestJoin.mutate({ teamId: Number(joinTeamId), requestedRole: joinRole, message: joinMessage })} canSubmit={canRequest} /></div></div></main>;
}

function CreateTeamCard({ teamName, description, pending, error, onName, onDescription, onCreate }: { teamName: string; description: string; pending: boolean; error?: string; onName: (value: string) => void; onDescription: (value: string) => void; onCreate: () => void }) {
  return <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Start securely</p><h2 className="mt-1 text-3xl font-black">Create a private group</h2><p className="mt-3 text-slate-600">You become its Ruler. No local chapters, Story Vault items, files, or canon are copied into this cloud workspace.</p><label className="mt-5 block text-sm font-bold">Group name<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={teamName} onChange={event => onName(event.target.value)} placeholder="Neo Domain writers" /></label><label className="mt-4 block text-sm font-bold">Short purpose (optional)<textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3" value={description} onChange={event => onDescription(event.target.value)} /></label>{error ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}<button className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={pending || teamName.trim().length < 2} onClick={onCreate}>{pending ? "Creating…" : "Create private group"}</button></Card>;
}

function MembersCard({ members }: { members: any[] }) {
  return <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Members</p><h3 className="mt-1 text-xl font-black">{members.length} of 5 seats in use</h3><div className="mt-4 space-y-2">{members.map(member => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div><strong>{member.name || member.email || "Private member"}</strong><p className="text-sm text-slate-500">{member.email || "Email not available"}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{roleLabel(member.role)}</span></div>)}</div></Card>;
}

function CanonArchive({ current, teamId, isRuler, canPropose }: { current: any; teamId: number; isRuler: boolean; canPropose: boolean }) {
  const utils = trpc.useUtils();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CanonCategory | "all">("all");
  const [proposalCategory, setProposalCategory] = useState<CanonCategory>("lore");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDecision, setProposalDecision] = useState("");
  const [proposalContext, setProposalContext] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [editCategory, setEditCategory] = useState<CanonCategory>("lore");
  const [editTitle, setEditTitle] = useState("");
  const [editDecision, setEditDecision] = useState("");
  const [editContext, setEditContext] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [historyRecordId, setHistoryRecordId] = useState<number | null>(null);
  const history = trpc.team.canonHistory.useQuery({ teamId, recordId: historyRecordId || 0 }, { enabled: isRuler && Boolean(historyRecordId) });
  const refresh = async () => { await utils.team.overview.invalidate({ teamId }); };
  const propose = trpc.team.proposeCanon.useMutation({ onSuccess: async () => { setProposalTitle(""); setProposalDecision(""); setProposalContext(""); await refresh(); } });
  const review = trpc.team.reviewCanon.useMutation({ onSuccess: refresh });
  const revise = trpc.team.reviseCanon.useMutation({ onSuccess: async () => { setEditing(null); setRevisionNote(""); await refresh(); if (historyRecordId) await history.refetch(); } });
  const pending = current.canonProposals.filter((record: any) => record.status === "pending");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCanon = current.approvedCanon.filter((record: any) => {
    const categoryMatches = filter === "all" || record.category === filter;
    const text = `${record.title} ${record.decision} ${record.context || ""} ${record.category}`.toLowerCase();
    return categoryMatches && (!normalizedQuery || text.includes(normalizedQuery));
  });
  const openEditor = (record: any) => {
    setEditing(record);
    setEditCategory(record.category as CanonCategory);
    setEditTitle(record.title);
    setEditDecision(record.decision);
    setEditContext(record.context || "");
    setRevisionNote("");
  };

  return <><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Canon finder</p><h2 className="mt-1 text-2xl font-black">Approved group canon</h2><p className="mt-2 text-sm leading-6 text-slate-600">Search only the approved records shared in this private group. Your local writing and Story Vault stay outside this archive.</p><div className="mt-5 grid gap-3 sm:grid-cols-[1fr_210px]"><label className="text-sm font-bold">Find a decision<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={query} placeholder="Search title, decision, or reason" onChange={event => setQuery(event.target.value)} /></label><label className="text-sm font-bold">Type<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={filter} onChange={event => setFilter(event.target.value as CanonCategory | "all")}><option value="all">All types</option>{canonCategories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label></div><p className="mt-3 text-sm text-slate-500">{filteredCanon.length} approved {filteredCanon.length === 1 ? "record" : "records"} found.</p><div className="mt-5 space-y-3">{filteredCanon.length ? filteredCanon.map((record: any) => <article key={record.id} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-emerald-700">{categoryLabel(record.category)}</p><h3 className="mt-1 text-lg font-black text-slate-900">{record.title}</h3></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">Approved</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{record.decision}</p>{record.context ? <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-slate-600"><strong>Why this matters:</strong> {record.context}</p> : null}{isRuler ? <div className="mt-4 flex flex-wrap gap-2"><button className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-bold text-violet-700" onClick={() => openEditor(record)}>Revise with history</button><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700" onClick={() => setHistoryRecordId(record.id)}>View history</button></div> : null}</article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No approved canon matches this search.</p>}</div></Card>{historyRecordId && isRuler ? <Card><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler-only history</p><h2 className="mt-1 text-2xl font-black">Earlier approved wording</h2></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold" onClick={() => setHistoryRecordId(null)}>Close history</button></div><p className="mt-2 text-sm text-slate-600">Each entry is an immutable snapshot saved before a Ruler change.</p><div className="mt-5 space-y-3">{history.isLoading ? <p className="rounded-xl bg-slate-50 p-4 text-sm">Loading history…</p> : history.error ? <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{history.error.message}</p> : history.data?.length ? history.data.map(entry => <article key={entry.id} className="rounded-xl border border-slate-100 p-4"><p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">Version {entry.revisionNumber} · {categoryLabel(entry.category)}</p><h3 className="mt-1 text-lg font-black">{entry.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{entry.decision}</p>{entry.context ? <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><strong>Earlier reason:</strong> {entry.context}</p> : null}{entry.revisionNote ? <p className="mt-3 text-sm text-slate-500"><strong>Ruler note:</strong> {entry.revisionNote}</p> : null}</article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No earlier version exists yet.</p>}</div></Card> : null}{editing && isRuler ? <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler-only revision</p><h2 className="mt-1 text-2xl font-black">Revise approved canon safely</h2><p className="mt-2 text-sm leading-6 text-slate-600">Saving creates an immutable copy of the current approved wording first. It does not edit the original proposal, any local writing, or Story Vault material.</p><form className="mt-5 grid gap-4" onSubmit={event => { event.preventDefault(); revise.mutate({ teamId, recordId: editing.id, category: editCategory, title: editTitle, decision: editDecision, context: editContext, revisionNote }); }}><label className="text-sm font-bold">Type<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={editCategory} onChange={event => setEditCategory(event.target.value as CanonCategory)}>{canonCategories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-sm font-bold">Title<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" maxLength={160} value={editTitle} onChange={event => setEditTitle(event.target.value)} /></label><label className="text-sm font-bold">Approved decision<textarea className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 p-3" maxLength={5000} value={editDecision} onChange={event => setEditDecision(event.target.value)} /></label><label className="text-sm font-bold">Why this matters (optional)<textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3" maxLength={1200} value={editContext} onChange={event => setEditContext(event.target.value)} /></label><label className="text-sm font-bold">Reason for this revision (optional)<textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3" maxLength={600} value={revisionNote} placeholder="Explain what changed for future Rulers." onChange={event => setRevisionNote(event.target.value)} /></label>{revise.error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{revise.error.message}</p> : null}<div className="flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={revise.isPending || editTitle.trim().length < 2 || editDecision.trim().length < 10} type="submit">{revise.isPending ? "Saving version…" : "Save revised canon"}</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold" type="button" onClick={() => setEditing(null)}>Cancel</button></div></form></Card> : null}{canPropose ? <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Canon proposal</p><h2 className="mt-1 text-2xl font-black">Suggest one shared-universe decision</h2><p className="mt-2 text-sm leading-6 text-slate-600">Type only the decision you want to submit. Nothing from your private chapters, Story Vault, files, or local notes is selected or uploaded here automatically. The proposal stays Pending until a Ruler decides.</p><form className="mt-5 grid gap-4" onSubmit={event => { event.preventDefault(); propose.mutate({ teamId, category: proposalCategory, title: proposalTitle, decision: proposalDecision, context: proposalContext }); }}><label className="text-sm font-bold">Type of decision<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={proposalCategory} onChange={event => setProposalCategory(event.target.value as CanonCategory)}>{canonCategories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-sm font-bold">Short title<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" maxLength={160} value={proposalTitle} placeholder="The unseen watcher in the tower" onChange={event => setProposalTitle(event.target.value)} /></label><label className="text-sm font-bold">Proposed decision<textarea className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 p-3" maxLength={5000} value={proposalDecision} placeholder="State the exact fact the group should treat as true if the Ruler approves it." onChange={event => setProposalDecision(event.target.value)} /></label><label className="text-sm font-bold">Why this matters (optional)<textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3" maxLength={1200} value={proposalContext} placeholder="A short reason or story effect." onChange={event => setProposalContext(event.target.value)} /></label>{propose.error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{propose.error.message}</p> : null}<button className="w-fit rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={propose.isPending || proposalTitle.trim().length < 2 || proposalDecision.trim().length < 10} type="submit">{propose.isPending ? "Sending proposal…" : "Send as Pending proposal"}</button></form></Card> : <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Watcher access</p><h2 className="mt-1 text-2xl font-black">Read approved canon only</h2><p className="mt-2 text-sm leading-6 text-slate-600">Watchers can search and read approved canon. They cannot submit, edit, approve, reject, or view Ruler history.</p></Card>}{isRuler ? <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler canon review</p><h2 className="mt-1 text-2xl font-black">Pending canon proposals</h2><p className="mt-2 text-sm leading-6 text-slate-600">Approve only decisions you want every accepted member to read as official shared canon. Rejecting leaves the proposer’s local writing untouched.</p><div className="mt-5 space-y-3">{pending.length ? pending.map((record: any) => <article key={record.id} className="rounded-xl border border-slate-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-violet-600">{categoryLabel(record.category)} · proposed by {record.proposerName || record.proposerEmail || "Private member"}</p><h3 className="mt-1 text-lg font-black">{record.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{record.decision}</p>{record.context ? <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><strong>Why this matters:</strong> {record.context}</p> : null}</div><div className="flex gap-2"><button className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60" disabled={review.isPending} onClick={() => review.mutate({ teamId, recordId: record.id, decision: "approve" })}>Approve canon</button><button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 disabled:opacity-60" disabled={review.isPending} onClick={() => review.mutate({ teamId, recordId: record.id, decision: "reject" })}>Reject</button></div></div></article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No pending canon proposals.</p>}</div></Card> : null}</>;
}

function RulerControls({ current, teamId, inviteEmail, inviteUrl, reviewPending, invitePending, inviteError, onInviteEmail, onApprove, onReject, onCreateInvite, onCopy, onRevoke }: { current: any; teamId: number; inviteEmail: string; inviteUrl: string; reviewPending: boolean; invitePending: boolean; inviteError?: string; onInviteEmail: (value: string) => void; onApprove: (requestId: number) => void; onReject: (requestId: number) => void; onCreateInvite: () => void; onCopy: () => void; onRevoke: (invitationId: number) => void }) {
  const pending = current.joinRequests.filter((request: any) => request.status === "pending");
  return <><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler approval</p><h3 className="mt-1 text-xl font-black">Pending join requests</h3><p className="mt-2 text-sm text-slate-600">Approval adds only a membership. It never imports a requester’s manuscript, Story Vault, or private local files.</p><div className="mt-4 space-y-3">{pending.length ? pending.map((request: any) => <div key={request.id} className="rounded-xl border border-slate-100 p-4"><div className="flex flex-wrap justify-between gap-3"><div><strong>{request.name || request.email || "Private requester"}</strong><p className="text-sm text-slate-500">{request.email || "Email unavailable"} · wants to join as {roleLabel(request.requestedRole)}</p>{request.message ? <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm">{request.message}</p> : null}</div><div className="flex gap-2"><button className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60" disabled={reviewPending} onClick={() => onApprove(request.id)}>Approve</button><button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 disabled:opacity-60" disabled={reviewPending} onClick={() => onReject(request.id)}>Reject</button></div></div></div>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No pending join requests.</p>}</div></Card><Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ruler-only invitations</p><h3 className="mt-1 text-xl font-black">Invite a Writer by email</h3><p className="mt-2 text-sm text-slate-600">The existing invitation option remains private and one-use. Its raw token is not stored by the server.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input className="min-w-0 flex-1 rounded-xl border border-slate-200 p-3" type="email" value={inviteEmail} placeholder="writer@example.com" onChange={event => onInviteEmail(event.target.value)} /><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={invitePending || !inviteEmail.trim()} onClick={onCreateInvite}>{invitePending ? "Creating…" : "Create invite"}</button></div>{inviteError ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{inviteError}</p> : null}{inviteUrl ? <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3"><strong className="text-sm text-emerald-900">Copy this private invitation link now</strong><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input className="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white p-2 text-sm" readOnly value={inviteUrl} /><button className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800" onClick={onCopy}>Copy link</button></div></div> : null}{current.invitations.length ? <div className="mt-4 space-y-2">{current.invitations.map((invitation: any) => <div key={invitation.id} className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-100 p-3 text-sm"><span>{invitation.inviteeEmail} · {invitation.status}</span>{invitation.status === "pending" ? <button className="font-bold text-rose-700" onClick={() => onRevoke(invitation.id)}>Revoke</button> : null}</div>)}</div> : null}</Card></>;
}

function JoinCard({ teamId, role, message, pending, error, requests, onTeamId, onRole, onMessage, onSubmit, canSubmit }: { teamId: string; role: JoinRole; message: string; pending: boolean; error?: string; requests: any[]; onTeamId: (value: string) => void; onRole: (value: JoinRole) => void; onMessage: (value: string) => void; onSubmit: () => void; canSubmit: boolean }) {
  return <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Ask to join</p><h2 className="mt-1 text-2xl font-black">Send a request to a Ruler</h2><p className="mt-2 text-sm leading-6 text-slate-600">Enter the private group number shared by its Ruler. Your request stays pending until reviewed and never sends your local writing.</p><form className="mt-5 grid gap-4" onSubmit={event => { event.preventDefault(); if (canSubmit) onSubmit(); }}><label className="text-sm font-bold">Private group number<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" inputMode="numeric" value={teamId} placeholder="Example: 12" onChange={event => onTeamId(event.target.value.replace(/\D/g, ""))} /></label><label className="text-sm font-bold">I want to join as<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={role} onChange={event => onRole(event.target.value as JoinRole)}><option value="writer">Writer — proposals and approved canon</option><option value="watcher">Watcher — approved canon only</option></select></label><label className="text-sm font-bold">Short note for the Ruler (optional)<textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3" maxLength={600} value={message} placeholder="Why would you like to join?" onChange={event => onMessage(event.target.value)} /></label>{error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}<button className="w-fit rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={!canSubmit || pending} type="submit">{pending ? "Sending request…" : "Request to join"}</button></form>{requests.length ? <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-sm font-bold">My recent requests</p><div className="mt-2 space-y-2">{requests.map(entry => <div key={entry.request.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 p-3 text-sm"><span><strong>{entry.team.name}</strong> · {roleLabel(entry.request.requestedRole)}</span><span>{entry.request.status}</span></div>)}</div></div> : null}</Card>;
}

createRoot(document.getElementById("root")!).render(<trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><TeamApp /></QueryClientProvider></trpc.Provider>);
