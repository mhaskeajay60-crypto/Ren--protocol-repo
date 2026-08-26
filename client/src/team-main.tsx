import { startLogin } from "@/const";
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

function resetTeamLoginState() {
  try {
    sessionStorage.removeItem("manus-cookie");
    sessionStorage.removeItem("manus-runtime-user-info");
    document.cookie = "__Host-oauth_state=; Path=/; Max-Age=0; SameSite=None; Secure";
  } catch {
    // The team screen stays usable even if browser storage is restricted.
  }
}

function TeamApp() {
  const { user, loading, logout } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const inviteToken = useMemo(() => new URLSearchParams(window.location.search).get("invite") || "", []);
  const teams = trpc.team.mine.useQuery(undefined, { enabled: Boolean(user) });

  useEffect(() => {
    if (!selectedTeamId && teams.data?.[0]?.team.id) setSelectedTeamId(teams.data[0].team.id);
  }, [selectedTeamId, teams.data]);

  const overview = trpc.team.overview.useQuery({ teamId: selectedTeamId || 0 }, { enabled: Boolean(user && selectedTeamId) });
  const utils = trpc.useUtils();
  const createTeam = trpc.team.create.useMutation({
    onSuccess: async ({ teamId }) => {
      await utils.team.mine.invalidate();
      setSelectedTeamId(teamId);
      setTeamName("");
      setTeamDescription("");
    },
  });
  const createInvitation = trpc.team.createInvitation.useMutation({
    onSuccess: async ({ token }) => {
      setInviteUrl(`${window.location.origin}/team?invite=${token}`);
      setInviteEmail("");
      if (selectedTeamId) await utils.team.overview.invalidate({ teamId: selectedTeamId });
    },
  });
  const acceptInvitation = trpc.team.acceptInvitation.useMutation({
    onSuccess: async ({ teamId }) => {
      await utils.team.mine.invalidate();
      setSelectedTeamId(teamId);
      window.history.replaceState({}, "", "/team");
    },
  });
  const revokeInvitation = trpc.team.revokeInvitation.useMutation({
    onSuccess: async () => {
      if (selectedTeamId) await utils.team.overview.invalidate({ teamId: selectedTeamId });
    },
  });

  if (loading) return <main className="min-h-screen grid place-items-center bg-slate-50 text-slate-700">Opening private workspace…</main>;

  if (!user) {
    return <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50 px-5 py-14 text-slate-900"><section className="mx-auto max-w-xl rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/50"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">The Ren Protocol / Private team</p><h1 className="mt-3 text-4xl font-black tracking-tight">A protected space for your shared universe.</h1><p className="mt-4 leading-7 text-slate-600">The public demo is still local to each browser. This separate workspace requires sign-in and an accepted invitation before anyone can see team information.</p><div className="mt-8 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-200" onClick={() => { resetTeamLoginState(); startLogin("/team"); }}>Sign in to private team</button><button className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700" onClick={() => { resetTeamLoginState(); window.location.assign("/team"); }}>Reset sign-in</button><a className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700" href="/">Return to local demo</a></div><p className="mt-5 text-sm leading-6 text-slate-500">Use <strong>Reset sign-in</strong> after a rejected login. It clears only private-team session attempts, never your browser-local manuscript or Dump Book.</p></section></main>;
  }

  if (inviteToken) {
    return <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50 px-5 py-14 text-slate-900"><section className="mx-auto max-w-xl rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100/50"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Private invitation</p><h1 className="mt-3 text-3xl font-black">Choose your private default.</h1><p className="mt-4 leading-7 text-slate-600">You are signed in as <strong>{user.email || user.name || "this account"}</strong>. Acceptance works only when this account uses the email address invited by the owner.</p><label className="mt-6 block text-sm font-bold text-slate-700">Default visibility for future team work<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" value={visibility} onChange={event => setVisibility(event.target.value as Visibility)}><option value="private">Private — only me until I choose otherwise</option><option value="team">Team — visible to all accepted members</option><option value="restricted">Restricted — reserved for a future limited audience</option></select></label>{acceptInvitation.error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{acceptInvitation.error.message}</p> : null}<div className="mt-7 flex flex-wrap gap-3"><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={acceptInvitation.isPending} onClick={() => acceptInvitation.mutate({ token: inviteToken, defaultVisibility: visibility })}>{acceptInvitation.isPending ? "Joining…" : "Join private team"}</button><a className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700" href="/team">Keep private</a></div></section></main>;
  }

  const current = overview.data;
  return <main className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">The Ren Protocol</p><h1 className="text-xl font-black">Private Team Foundation</h1></div><div className="flex items-center gap-3 text-sm"><span className="hidden text-slate-500 sm:inline">{user.email || user.name}</span><button className="rounded-lg border border-slate-200 px-3 py-2 font-semibold" onClick={logout}>Sign out</button><a className="rounded-lg bg-violet-600 px-3 py-2 font-semibold text-white" href="/">Local demo</a></div></div></header><div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[260px_1fr]"><aside className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">My teams</p><div className="mt-3 space-y-2">{teams.isLoading ? <p className="text-sm text-slate-500">Loading teams…</p> : teams.data?.length ? teams.data.map(entry => <button key={entry.team.id} className={`w-full rounded-xl p-3 text-left ${entry.team.id === selectedTeamId ? "bg-violet-50 text-violet-900" : "hover:bg-slate-50"}`} onClick={() => { setSelectedTeamId(entry.team.id); setInviteUrl(""); }}><strong className="block">{entry.team.name}</strong><span className="text-xs text-slate-500">{entry.membership.role} · {entry.membership.defaultVisibility} default</span></button>) : <p className="text-sm leading-6 text-slate-500">You are not in a private team yet.</p>}</div></aside><section>{teams.data?.length === 0 ? <CreateTeamCard name={teamName} description={teamDescription} pending={createTeam.isPending} error={createTeam.error?.message} onName={setTeamName} onDescription={setTeamDescription} onSubmit={() => createTeam.mutate({ name: teamName, description: teamDescription })} /> : current ? <TeamOverview team={current.team} membership={current.membership} members={current.members} invitations={current.invitations} inviteEmail={inviteEmail} inviteUrl={inviteUrl} pending={createInvitation.isPending} inviteError={createInvitation.error?.message} onInviteEmail={setInviteEmail} onCreateInvite={() => selectedTeamId && createInvitation.mutate({ teamId: selectedTeamId, inviteeEmail: inviteEmail })} onCopyInvite={() => navigator.clipboard.writeText(inviteUrl)} onRevoke={invitationId => selectedTeamId && revokeInvitation.mutate({ teamId: selectedTeamId, invitationId })} /> : <section className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading private workspace…</section>}</section></div></main>;
}

function CreateTeamCard(props: { name: string; description: string; pending: boolean; error?: string; onName: (value: string) => void; onDescription: (value: string) => void; onSubmit: () => void }) {
  return <section className="rounded-2xl border border-violet-100 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Start securely</p><h2 className="mt-2 text-3xl font-black">Create a private team</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">You will be the owner. This creates only the protected team shell—no local chapters, Dump Book items, or canon are copied into it.</p><label className="mt-6 block text-sm font-bold">Team name<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={props.name} maxLength={160} placeholder="Neo Domain writers" onChange={event => props.onName(event.target.value)} /></label><label className="mt-4 block text-sm font-bold">Short purpose (optional)<textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3" value={props.description} maxLength={1200} placeholder="A protected shared universe for our planning." onChange={event => props.onDescription(event.target.value)} /></label>{props.error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{props.error}</p> : null}<button className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={props.pending || props.name.trim().length < 2} onClick={props.onSubmit}>{props.pending ? "Creating…" : "Create private team"}</button></section>;
}

function TeamOverview(props: { team: { id: number; name: string; description: string | null; slug: string }; membership: { role: "owner" | "writer"; defaultVisibility: Visibility }; members: Array<{ id: number; userId: number; role: "owner" | "writer"; defaultVisibility: Visibility; name: string | null; email: string | null }>; invitations: Array<{ id: number; inviteeEmail: string; status: "pending" | "accepted" | "revoked" | "expired"; expiresAt: Date }>; inviteEmail: string; inviteUrl: string; pending: boolean; inviteError?: string; onInviteEmail: (value: string) => void; onCreateInvite: () => void; onCopyInvite: () => void; onRevoke: (id: number) => void }) {
  const owner = props.membership.role === "owner";
  return <div className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Protected workspace</p><div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-3xl font-black">{props.team.name}</h2><p className="mt-2 max-w-2xl leading-7 text-slate-600">{props.team.description || "No shared description yet. This foundation is ready before shared canon or writing is added."}</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">{props.membership.role} · {props.membership.defaultVisibility} default</span></div><p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">This Phase 2 space has accounts, roles, and invitations only. The public local demo stays separate; no browser-local writing is shared automatically.</p></section><section className="rounded-2xl border border-slate-200 bg-white p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Members</p><h3 className="mt-1 text-xl font-black">{props.members.length} of 5 seats in use</h3></div></div><div className="mt-5 space-y-3">{props.members.map(member => <div key={member.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-4"><div><strong>{member.name || member.email || "Private member"}</strong><p className="text-sm text-slate-500">{member.email || "Email not available"}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{member.role} · {member.defaultVisibility}</span></div>)}</div></section>{owner ? <section className="rounded-2xl border border-slate-200 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Owner-only invitations</p><h3 className="mt-1 text-xl font-black">Invite one writer by email</h3><p className="mt-2 text-sm leading-6 text-slate-600">A one-use copyable link lasts seven days. It can only be accepted by the invited email address. The raw token is not stored by the server.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input className="min-w-0 flex-1 rounded-xl border border-slate-200 p-3" value={props.inviteEmail} type="email" placeholder="writer@example.com" onChange={event => props.onInviteEmail(event.target.value)} /><button className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={props.pending || !props.inviteEmail.trim()} onClick={props.onCreateInvite}>{props.pending ? "Creating…" : "Create copyable invite"}</button></div>{props.inviteError ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{props.inviteError}</p> : null}{props.inviteUrl ? <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4"><strong className="text-emerald-900">Copy this private invitation link now</strong><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input className="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white p-2 text-sm" readOnly value={props.inviteUrl} /><button className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800" onClick={props.onCopyInvite}>Copy link</button></div></div> : null}{props.invitations.length ? <div className="mt-6 space-y-2"><p className="text-sm font-bold text-slate-700">Invitation history</p>{props.invitations.map(invitation => <div key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-sm"><span>{invitation.inviteeEmail} · {invitation.status}</span>{invitation.status === "pending" ? <button className="font-bold text-rose-700" onClick={() => props.onRevoke(invitation.id)}>Revoke</button> : null}</div>)}</div> : null}</section> : null}</div>;
}

createRoot(document.getElementById("root")!).render(<trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><TeamApp /></QueryClientProvider></trpc.Provider>);
