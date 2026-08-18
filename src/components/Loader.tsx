import { useEffect, useRef, useState } from "react";

const SYNONYMS = [
  "Intellectual",
  "Critical thinker",
  "Independent Journalist",
  "Investigative Journalist",
  "Students",
  "Questioning Teachers",
  "Truth Writer",
  "Political Comedian",
  "Rights Lawyer",
  "RTI Activist",
  "Fact-checker",
  "Liberals",
];

const WORD = "Dimagi Naxal";
const WORD_MS = 140; // 30% slower than the previous 108ms
const START_MS = 700;
const LIST_MS = START_MS + SYNONYMS.length * WORD_MS;

const Loader = ({ onDone }: { onDone: () => void }) => {
  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(-1);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(WORD.slice(0, i));
      if (i >= WORD.length) clearInterval(t);
    }, 85);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const start = setTimeout(() => {
      setIndex(0);
      let i = 0;
      const t = setInterval(() => {
        i += 1;
        if (i >= SYNONYMS.length) {
          clearInterval(t);
          return;
        }
        setIndex(i);
      }, WORD_MS);
      timer.current = t;
    }, START_MS);
    return () => clearTimeout(start);
  }, []);

  const timer = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => () => clearInterval(timer.current), []);

  useEffect(() => {
    const a = setTimeout(() => setLeaving(true), LIST_MS + 900);
    const b = setTimeout(onDone, LIST_MS + 1600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-center overflow-hidden bg-primary px-6 text-primary-foreground ${
        leaving ? "animate-curtain-up" : ""
      }`}
    >
      <div className="tricolor-rule absolute inset-x-0 top-0 h-2 animate-tricolor-grow" />
      <div className="tricolor-rule absolute inset-x-0 bottom-0 h-2 animate-tricolor-grow" />

      <div className="mx-auto w-full max-w-xl">
        <p className="stamp text-xs italic opacity-70 animate-fade-in">Word:</p>

        <h1 className="mt-2 text-5xl md:text-7xl">
          {typed}
          <span className="ml-1 inline-block w-[0.5ch] animate-caret text-accent">_</span>
        </h1>

        <div className="mt-6 h-1 w-full overflow-hidden bg-primary-foreground/20">
          <div
            className="tricolor-rule h-full w-full origin-left transition-transform duration-300 ease-linear"
            style={{ transform: `scaleX(${Math.max(0.02, (index + 1) / SYNONYMS.length)})` }}
          />
        </div>

        <div className="mt-6">
          <span className="stamp text-[10px] opacity-60">Synonyms</span>
          <div className="relative mt-1 h-12 overflow-hidden md:h-14">
            {index >= 0 && (
              <span
                key={index}
                className="display absolute inset-0 flex items-center text-2xl animate-word-scroll-up md:text-3xl"
              >
                {SYNONYMS[index]}
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm opacity-80 md:text-base">
          <span className="stamp text-[10px] opacity-60">Antonym: </span>
          <span className="text-accent display">Andhbhakt.</span>
        </p>

        <p className="stamp mt-10 text-[10px] opacity-70">
          Think | Research | Resist
        </p>
      </div>
    </div>
  );
};

export default Loader;
