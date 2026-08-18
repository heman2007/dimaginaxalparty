import { useState } from "react";
import logo from "@/assets/dnp-logo.png";
import JoinSection from "@/components/JoinSection";
import Loader from "@/components/Loader";
import MemberCounter from "@/components/MemberCounter";

const principles = [
  { n: "01", t: "Question Everything", d: "Including us. Especially us. Blind faith is not patriotism." },
  { n: "02", t: "Logic over Propaganda", d: "If it needs a WhatsApp forward to survive, it is not a fact." },
  { n: "03", t: "Constitution First", d: "Not a party, not a leader, not a slogan. The document comes first." },
  { n: "04", t: "Scientific Temper", d: "Article 51A(h) is not optional reading. It is a duty." },
  { n: "05", t: "Fearless Speech", d: "Being called anti-national for asking a question is the job description." },
  { n: "06", t: "Unity, Not Hate", d: "We fight narratives, not neighbours." },
];

const yesNo = {
  yes: ["Facts", "Logic", "Research", "Patriotism", "Unity", "Constitution"],
  no: ["Propaganda", "Hate", "Bias", "Fake news", "Blind faith", "Godi media"],
};

const IG = "https://www.instagram.com/dimaginaxalpartyy_india";

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen">
      {loading && <Loader onDone={() => setLoading(false)} />}
      <div className="tricolor-rule h-2 w-full" />

      <header className="sticky top-0 z-40 border-b-2 border-primary bg-background/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="Dimagi Naxal Party emblem" width={44} height={44} className="h-11 w-11" />
            <span className="display text-lg leading-none">
              Dimagi Naxal<br />
              <span className="stamp text-[9px] font-normal text-muted-foreground">Party</span>
            </span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#vision" className="stamp text-[11px] hover:text-accent">Vision</a>
            <a href="#principles" className="stamp text-[11px] hover:text-accent">Principles</a>
            <a href="#who" className="stamp text-[11px] hover:text-accent">Who we are</a>
          </div>
          <a
            href="#join"
            className="brut-accent bg-accent px-4 py-2 text-sm text-accent-foreground display"
          >
            Join
          </a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="border-b-4 border-primary px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="stamp text-xs text-accent">Think | Research | Resist</p>
              <h1 className="mt-4 text-5xl md:text-8xl">
                We are educated.<br />
                <span className="text-accent">We use brains.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
                A movement for Indians who read before they react. If asking questions
                makes us "Dimagi Naxals", we will wear the label and keep asking.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#join"
                  className="brut-accent bg-accent px-8 py-4 text-xl text-accent-foreground display transition-transform hover:translate-x-1 hover:translate-y-1"
                >
                  Join the party →
                </a>
                <a href="#vision" className="stamp border-b-2 border-primary pb-1 text-xs">
                  Read the vision
                </a>
              </div>
              <p className="stamp mt-8 text-[11px] text-muted-foreground">
                Soch badlo, desh badlega. · Inspired by Bhagat Singh
              </p>
              <div className="mt-3">
                <MemberCounter />
              </div>
            </div>
            <img
              src={logo}
              alt="Brain wearing glasses and a tricolour bandana — Dimagi Naxal Party emblem"
              width={512}
              height={512}
              className="mx-auto w-56 md:w-full md:max-w-sm"
            />
          </div>
        </section>

        {/* TICKER */}
        <div className="overflow-hidden border-b-4 border-primary bg-primary py-3 text-primary-foreground">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="stamp flex gap-8 text-xs">
                <span>Think Freely, Live Fearlessly</span><span>*</span>
                <span>No to Propaganda</span><span>*</span>
                <span>Facts over Feelings</span><span>*</span>
                <span>Constitution First</span><span>*</span>
                <span>Question Everything</span><span>*</span>
              </span>
            ))}
          </div>
        </div>

        {/* VISION */}
        <section id="vision" className="border-b-4 border-primary px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="stamp text-xs text-accent">Chapter One</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-6xl">Why we exist.</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <p className="text-lg leading-relaxed">
                Bhagat Singh was 23 when he wrote that the real revolution is of the mind —
                that people must be taught to think, to question, to refuse a story just
                because it is loud. A century later the loudness has a budget, a prime-time
                slot and a forwarding button.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Dimagi Naxal Party is not a rebellion with weapons. It is a rebellion with
                sources, screenshots and citations. We do not fight people. We fight the
                machinery that decides what people are allowed to believe.
              </p>
            </div>
            <div className="mt-10 grid gap-0 border-2 border-primary sm:grid-cols-3">
              {[
                ["Truth", "Verified, sourced, boring — and non-negotiable."],
                ["Justice", "Equal rules, especially for the powerful."],
                ["Freedom", "To think, to speak, to disagree in public."],
              ].map(([t, d], i) => (
                <div
                  key={t}
                  className={`p-6 ${i < 2 ? "border-b-2 border-primary sm:border-b-0 sm:border-r-2" : ""}`}
                >
                  <h3 className="text-2xl">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section id="principles" className="border-b-4 border-primary bg-secondary px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="stamp text-xs text-accent">Core principles</p>
            <h2 className="mt-3 text-4xl md:text-6xl">What we stand on.</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {principles.map((p) => (
                <article key={p.n} className="brut bg-card p-6">
                  <span className="stamp text-[10px] text-accent">{p.n}</span>
                  <h3 className="mt-2 text-2xl">{p.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="brut bg-card p-6">
                <h3 className="text-2xl text-forest">Yes to</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {yesNo.yes.map((y) => (
                    <li key={y} className="stamp border-2 border-primary px-3 py-1 text-[11px]">
                      {y}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="brut bg-card p-6">
                <h3 className="text-2xl text-accent">No to</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {yesNo.no.map((y) => (
                    <li
                      key={y}
                      className="stamp border-2 border-primary px-3 py-1 text-[11px] line-through decoration-accent decoration-2"
                    >
                      {y}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHO */}
        <section id="who" className="border-b-4 border-primary px-5 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            <div>
              <p className="stamp text-xs text-accent">Dictionary entry</p>
              <h2 className="mt-3 text-4xl md:text-6xl">Dimagi Naxal</h2>
              <p className="stamp mt-2 text-[11px] text-muted-foreground">
                /dɪˈmaːɡiː ˈnəksəl/ · noun · Indian, informal
              </p>
              <p className="mt-4 text-lg">
                A person who uses their brain in public. Usually educated, usually
                inconvenient, routinely accused of being anti-national for reading the
                footnotes.
              </p>
              <div className="mt-6 space-y-3">
                <p>
                  <span className="stamp text-[10px] text-muted-foreground">Synonyms: </span>
                  Intellectual, critical thinker, fact-checker, citizen.
                </p>
                <p>
                  <span className="stamp text-[10px] text-muted-foreground">Antonym: </span>
                  <span className="text-accent">Andhbhakt.</span>
                </p>
              </div>
            </div>
            <div className="brut bg-card p-6">
              <h3 className="text-2xl">Expect this when you join</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "You will be called anti-national. Frequently.",
                  "Your family WhatsApp group will get quieter.",
                  "You will be asked to 'go to Pakistan'. Decline politely.",
                  "You will start checking sources before sharing. Permanently.",
                ].map((x) => (
                  <li key={x} className="flex gap-3 border-b border-border/40 pb-3 text-sm">
                    <span className="stamp text-accent">→</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <JoinSection />
      </main>

      <footer className="border-t-4 border-primary bg-primary px-5 py-12 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl">Dimagi Naxal Party</h2>
            <p className="stamp mt-2 text-[11px] opacity-70">Think | Research | Resist</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={IG} target="_blank" rel="noreferrer" className="stamp text-xs underline">
              Instagram @dimaginaxalpartyy
            </a>
            <p className="stamp text-[10px] opacity-60">
              Funded by nobody. Answerable to everybody.
            </p>
          </div>
        </div>
        <div className="tricolor-rule mx-auto mt-8 h-2 max-w-6xl" />
      </footer>
    </div>
  );
};

export default Index;
