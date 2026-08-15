"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS, SKILLS, SOCIALS, EMAIL } from "@/lib/data";
import { world } from "@/lib/world";
import { toggleCalm } from "@/lib/calm";
import { validateField, type Field } from "@/lib/contact";

type LogLine = { text: string; kind?: "in" | "ember" | "dim" };

/**
 * `msg` asks for the three things the form asks for, one line at a time, and
 * posts to the same endpoint. Same rules, same inbox — just in the idiom of
 * the room you are standing in.
 */
type Compose = { step: Field; name: string; email: string };

const STEPS: Record<Field, { prompt: string; hint: string }> = {
  name: { prompt: "name", hint: "who's writing" },
  email: { prompt: "email", hint: "where I reply" },
  message: { prompt: "message", hint: "what you're building" },
};

const BANNER: LogLine[] = [
  { text: "OBSERVATORY CONSOLE v2.6 — nikola@observatory", kind: "ember" },
  { text: "type 'help' to see what this thing can do", kind: "dim" },
];

const HELP: LogLine[] = [
  { text: "help ............ this list" },
  { text: "whoami .......... who is nikola" },
  { text: "projects ........ list shipped work" },
  { text: "open <name> ..... open a project (e.g. open lusso)" },
  { text: "goto <section> .. fly there (who/work/craft/path/lab/talk)" },
  { text: "skills .......... the toolbox" },
  { text: "socials ......... where else to find me" },
  { text: "msg ............. write me a message without leaving the console" },
  { text: "contact ......... open the contact form instead" },
  { text: "email ........... hand it to your mail app" },
  { text: "sign ............ leave your mark in the void" },
  { text: "boom ............ do not press" },
  { text: "calm ............ toggle calm mode (no effects)" },
  { text: "sudo hire nikola  worth a try" },
  { text: "clear / exit" },
];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<LogLine[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [compose, setCompose] = useState<Compose | null>(null);
  const [sending, setSending] = useState(false);
  const histIdx = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // open with "/" or backtick anywhere; also via custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if ((e.key === "/" || e.key === "`") && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    inputRef.current?.focus();
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // escape backs out of the message first; only a second one leaves
      if (compose) {
        setCompose(null);
        print([{ text: "cancelled — nothing sent.", kind: "dim" }]);
        return;
      }
      setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
      window.__lenis?.start();
    };
  }, [open, compose]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [log]);

  const print = (lines: LogLine[]) => setLog((l) => [...l, ...lines]);

  const goto = (id: string) => {
    const map: Record<string, string> = {
      who: "#about", work: "#work", craft: "#craft",
      path: "#path", lab: "#lab", talk: "#talk", top: "#top",
    };
    const href = map[id];
    if (!href) return false;
    setOpen(false);
    setTimeout(() => {
      window.__lenis?.scrollTo(href, { duration: 1.8 });
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 250);
    return true;
  };

  const ask = (step: Field) =>
    print([{ text: `${STEPS[step].prompt}? (${STEPS[step].hint})`, kind: "dim" }]);

  const send = async (name: string, email: string, message: string) => {
    setCompose(null);
    setSending(true);
    print([{ text: "transmitting…", kind: "ember" }]);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "console" }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        print([
          { text: "sent. it's in my inbox.", kind: "ember" },
          { text: "I read everything — usually a reply within 24h.", kind: "dim" },
        ]);
      } else if (res.status === 400 && body.errors) {
        print(Object.values(body.errors).map((t) => ({ text: String(t), kind: "ember" as const })));
        print([{ text: "type 'msg' to start again", kind: "dim" }]);
      } else if (res.status === 429) {
        print([{ text: String(body.error ?? "too many messages — give it a minute."), kind: "dim" }]);
      } else {
        // delivery is not configured, or the provider is down: rather than eat
        // what they typed, hand it over the way the form does
        print([
          { text: "the inbox link isn't live yet.", kind: "dim" },
          { text: "handing it to your mail app instead…", kind: "dim" },
        ]);
        window.location.href =
          `mailto:${EMAIL}?subject=${encodeURIComponent(`Project enquiry — ${name}`)}` +
          `&body=${encodeURIComponent(`${message}\n\n— ${name}`)}`;
      }
    } catch {
      print([{ text: "no connection. try again in a moment.", kind: "dim" }]);
    }
    setSending(false);
  };

  /** one answer at a time — the console's own version of the form */
  const answer = (raw: string) => {
    if (!compose) return;
    const value = raw.trim();
    print([{ text: `${STEPS[compose.step].prompt} > ${value}`, kind: "in" }]);

    if (value.toLowerCase() === "cancel") {
      setCompose(null);
      print([{ text: "cancelled — nothing sent.", kind: "dim" }]);
      return;
    }

    const problem = validateField(compose.step, value);
    if (problem) {
      // stay on the step rather than dropping them back to the prompt
      print([{ text: problem, kind: "ember" }]);
      return;
    }

    if (compose.step === "name") {
      setCompose({ ...compose, name: value, step: "email" });
      ask("email");
    } else if (compose.step === "email") {
      setCompose({ ...compose, email: value, step: "message" });
      ask("message");
    } else {
      send(compose.name, compose.email, value);
    }
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    print([{ text: `> ${raw}`, kind: "in" }]);
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        print(HELP);
        break;
      case "whoami":
        print([
          { text: "Nikola Anastasijević — software developer, Hamilton, Ontario, Canada." },
          { text: "Mohawk Software Development (Jan 2025—now) · co-op @ MPBSDP (May—Dec 2026+)." },
          { text: "Builds around cars, maps, live data, payments, and interfaces with a point of view." },
          { text: "Current status: probably building. Possibly driving.", kind: "dim" },
        ]);
        break;
      case "projects":
      case "ls":
        print(
          PROJECTS.map((p) => ({
            text: `${p.index}  ${p.title.padEnd(16)} ${p.year.padEnd(12)} ${p.tags.join(", ")}`,
          }))
        );
        print([{ text: "open <name> to visit", kind: "dim" }]);
        break;
      case "open": {
        const p = PROJECTS.find((p) => p.title.toLowerCase().includes(arg));
        if (p?.href) {
          print([{ text: `opening ${p.title.toLowerCase()}…`, kind: "ember" }]);
          window.open(p.href, "_blank", "noopener");
        } else {
          print([{ text: `unknown project '${arg}' — try 'projects'`, kind: "dim" }]);
        }
        break;
      }
      case "goto":
        if (!goto(arg)) print([{ text: `unknown section '${arg}'`, kind: "dim" }]);
        break;
      case "skills":
        print(
          SKILLS.map((g) => ({ text: `${g.label.padEnd(10)} ${g.items.join(" · ")}` }))
        );
        break;
      case "socials":
        print(SOCIALS.map((s) => ({ text: `${s.label.padEnd(10)} ${s.href}` })));
        break;
      case "msg":
      case "send":
      case "write":
        print([
          { text: "new message — three lines, then it sends.", kind: "ember" },
          { text: "'cancel' or ESC backs out.", kind: "dim" },
        ]);
        setCompose({ step: "name", name: "", email: "" });
        ask("name");
        break;
      case "contact":
        print([{ text: "opening the contact form…", kind: "ember" }]);
        setOpen(false);
        setTimeout(() => window.dispatchEvent(new Event("open-contact")), 250);
        break;
      case "email":
        print([{ text: `opening mail to ${EMAIL}…`, kind: "ember" }]);
        window.location.href = `mailto:${EMAIL}`;
        break;
      case "sign":
        setOpen(false);
        setTimeout(() => window.dispatchEvent(new Event("open-guestbook")), 250);
        break;
      case "boom":
        print([{ text: "detonating…", kind: "ember" }]);
        world.clickAt = { x: 0, y: 0, t: performance.now() / 1000, power: 3.2 };
        break;
      case "sudo":
        if (arg.startsWith("hire")) {
          print([
            { text: "PERMISSION GRANTED.", kind: "ember" },
            { text: `drafting offer letter… just kidding — email ${EMAIL}` },
          ]);
        } else {
          print([{ text: "nice try. this incident will be reported.", kind: "dim" }]);
        }
        break;
      case "calm":
        print([{ text: "switching mode…", kind: "ember" }]);
        setTimeout(() => toggleCalm(), 400);
        break;
      case "clear":
        setLog([]);
        break;
      case "exit":
      case "quit":
        setOpen(false);
        break;
      default:
        print([{ text: `command not found: ${head} — try 'help'`, kind: "dim" }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (sending) return;
    if (e.key === "Enter") {
      if (compose) {
        answer(value);
        setValue("");
        return;
      }
      run(value);
      if (value.trim()) {
        setHistory((h) => [value, ...h].slice(0, 40));
      }
      histIdx.current = -1;
      setValue("");
    } else if (compose) {
      // no command history while composing — up-arrow inside a message would
      // silently replace what you were writing
      return;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx.current + 1, history.length - 1);
      if (history[next] !== undefined) {
        histIdx.current = next;
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx.current - 1;
      histIdx.current = Math.max(next, -1);
      setValue(next >= 0 ? history[next] : "");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[360] flex items-end justify-center bg-void/60 p-4 backdrop-blur-[2px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-label="Console"
        >
          <motion.div
            className="flex max-h-[70vh] w-[min(94vw,720px)] flex-col overflow-hidden rounded-sm border border-ink/15 bg-void/95 shadow-[0_0_80px_rgba(255,92,40,0.07)]"
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.3em] text-dim">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                OBSERVATORY CONSOLE
              </span>
              <span>ESC to close</span>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="min-h-48 flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
            >
              {log.map((l, i) => (
                <div
                  key={i}
                  className={
                    l.kind === "ember"
                      ? "text-ember"
                      : l.kind === "dim"
                        ? "text-ink/40"
                        : l.kind === "in"
                          ? "text-ink"
                          : "text-ink/75"
                  }
                >
                  {l.text}
                </div>
              ))}
            </div>

            {/* the prompt names the answer it is waiting for, so a half-finished
                message is never a mystery */}
            <div className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-xs">
              <span className="shrink-0 whitespace-nowrap text-ember">
                {compose ? `${STEPS[compose.step].prompt} >` : ">"}
              </span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={sending}
                className="flex-1 bg-transparent text-ink caret-ember outline-none placeholder:text-ink/25 disabled:opacity-40"
                placeholder={sending ? "sending…" : compose ? STEPS[compose.step].hint : "help"}
                spellCheck={false}
                autoComplete="off"
                aria-label={compose ? `${STEPS[compose.step].prompt} — ${STEPS[compose.step].hint}` : "Console input"}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
