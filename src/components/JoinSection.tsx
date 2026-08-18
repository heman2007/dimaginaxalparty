import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import MembershipCard, { type Member } from "@/components/MembershipCard";
import MemberCounter from "@/components/MemberCounter";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Step = "form" | "otp" | "card";

type MemberRow = {
  membership_id: string;
  name: string;
  city: string | null;
  reason: string | null;
  created_at: string;
};

const formatIssued = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Same shape as the DB default (generate_membership_id() in the migration),
// generated client-side so it can be included in the OTP email itself.
const makeMembershipId = () =>
  "DNP-" +
  new Date().getFullYear() +
  "-" +
  Math.random().toString(36).slice(2, 7).toUpperCase();

const JoinSection = () => {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", city: "", reason: "", email: "" });
  const [otp, setOtp] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pendingIdRef = useRef<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  const field =
    "w-full border-2 border-primary bg-card px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim()) return;

    if (!isSupabaseConfigured) {
      setError("Membership sign-up isn't configured yet. Please check back soon.");
      return;
    }

    setBusy(true);
    const membershipId = makeMembershipId();
    pendingIdRef.current = membershipId;

    // Passed as `data` so the email template can show it via
    // {{ .Data.name }}, {{ .Data.membership_id }}, etc. — see
    // supabase/README.md for the template setup.
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: form.email.trim(),
      options: {
        shouldCreateUser: true,
        data: {
          name: form.name.trim(),
          city: form.city.trim(),
          reason: form.reason.trim(),
          membership_id: membershipId,
        },
      },
    });
    setBusy(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }
    setStep("otp");
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) return;

    setBusy(true);
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email.trim(),
      token: otp.trim(),
      type: "email",
    });

    if (verifyError || !verifyData.user) {
      setBusy(false);
      setError(verifyError?.message ?? "That code didn't work. Please try again.");
      return;
    }

    const userId = verifyData.user.id;

    // Returning member? Just show their existing card.
    const { data: existing } = await supabase
      .from("members")
      .select("membership_id, name, city, reason, created_at")
      .eq("id", userId)
      .maybeSingle<MemberRow>();

    let row = existing;

    if (!row) {
      // The id was already emailed to them, so insert with that exact
      // value. In the astronomically unlikely case it collides with an
      // existing row, retry once with a fresh id.
      const tryInsert = async (membershipId: string) =>
        supabase
          .from("members")
          .insert({
            id: userId,
            membership_id: membershipId,
            name: form.name.trim(),
            city: form.city.trim() || null,
            reason: form.reason.trim() || null,
            email: form.email.trim(),
          })
          .select("membership_id, name, city, reason, created_at")
          .single<MemberRow>();

      let { data: inserted, error: insertError } = await tryInsert(pendingIdRef.current);
      if (insertError?.code === "23505") {
        ({ data: inserted, error: insertError } = await tryInsert(makeMembershipId()));
      }

      if (insertError || !inserted) {
        setBusy(false);
        setError(insertError?.message ?? "Couldn't issue your card. Please try again.");
        return;
      }
      row = inserted;
    }

    setMember({
      name: row.name,
      city: row.city ?? "",
      reason: row.reason ?? "",
      id: row.membership_id,
      issued: formatIssued(row.created_at),
    });
    setStep("card");
    setBusy(false);
  };

  const download = async () => {
    if (!cardRef.current) return;
    const url = await toPng(cardRef.current, { pixelRatio: 3 });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${member?.id ?? "dnp"}-membership-card.png`;
    a.click();
  };

  return (
    <section id="join" className="border-t-4 border-primary bg-secondary px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="stamp text-xs text-accent">Membership</p>
        <h2 className="mt-3 max-w-2xl text-4xl md:text-6xl">
          Join the party. Get your card.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          No fee, no form-filling marathon, no loyalty test. Verify your email and we
          issue your Dimagi Naxal membership ID instantly — on screen and in the same
          email as your verification code.
        </p>
        <div className="mt-3">
          <MemberCounter />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {step === "form" && (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label className="stamp mb-2 block text-[10px]" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  className={field}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Bhagat S."
                  required
                />
              </div>
              <div>
                <label className="stamp mb-2 block text-[10px]" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={field}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="stamp mb-2 block text-[10px]" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  className={field}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Lucknow"
                />
              </div>
              <div>
                <label className="stamp mb-2 block text-[10px]" htmlFor="reason">
                  Why do you question?
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  className={field}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Because facts deserve a hearing."
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="brut-accent bg-accent px-8 py-4 text-lg text-accent-foreground display transition-transform hover:translate-x-1 hover:translate-y-1 disabled:opacity-60"
              >
                {busy ? "Sending code…" : "Email me a code →"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={verifyCode} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We sent a code (and your membership details) to{" "}
                <span className="font-semibold">{form.email}</span>. Enter the code
                below to verify and see your card here too.
              </p>
              <div>
                <label className="stamp mb-2 block text-[10px]" htmlFor="otp">
                  Verification code
                </label>
                <input
                  id="otp"
                  inputMode="numeric"
                  className={field}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={busy}
                  className="brut-accent bg-accent px-8 py-4 text-lg text-accent-foreground display transition-transform hover:translate-x-1 hover:translate-y-1 disabled:opacity-60"
                >
                  {busy ? "Verifying…" : "Verify & issue card →"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setOtp("");
                    setError(null);
                  }}
                  className="stamp text-xs underline"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

          {step === "card" && member && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Card issued. Your details and member ID are also in the email we sent
                to <span className="font-semibold">{form.email}</span>.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {member ? (
              <>
                <MembershipCard ref={cardRef} member={member} />
                <button
                  onClick={download}
                  className="brut bg-primary px-6 py-3 text-primary-foreground display transition-transform hover:translate-x-1 hover:translate-y-1"
                >
                  Download card
                </button>
              </>
            ) : (
              <div className="brut flex min-h-[280px] items-center justify-center bg-card p-8 text-center">
                <p className="stamp text-xs text-muted-foreground">
                  Your card will be printed here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
