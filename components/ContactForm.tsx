"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EMAIL, SERVICES, BUDGETS } from "@/lib/data";
import { FIELDS, validate, type Field, type Errors as FieldErrors } from "@/lib/contact";

/**
 * The way in, without leaving.
 *
 * A mailto hands the visitor off to whatever mail client the machine happens
 * to have configured — which on a phone is fine and on a shared or work
 * desktop is a dead end. So the enquiry is taken here and posted to
 * /api/contact, and the mail client becomes the fallback rather than the
 * front door.
 *
 * Open it with:  window.dispatchEvent(new Event("open-contact"))
 */

type State = "idle" | "sending" | "sent";
/** field problems, plus one slot for whatever went wrong with the send itself */
type Errors = FieldErrors & { form?: string };

const FIELD =
  "w-full border bg-void/60 px-4 py-3 font-mono text-[16px] text-ink " +
  "placeholder:text-ink/30 outline-none transition-colors duration-300 " +
  "focus:border-ember focus:ring-1 focus:ring-ember/40 md:text-sm";

/** a bad field keeps the ember edge whether or not the caret is in it */
const fieldClass = (bad?: string) => `${FIELD} ${bad ? "border-ember" : "border-ink/25"}`;

const LABEL = "mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-dim";

/** the one repeated bit of error furniture: a mark, then what is wrong */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 font-mono text-[10px] leading-relaxed text-ember">
      <span aria-hidden="true" className="mt-[3px] block h-1 w-1 shrink-0 rounded-full bg-ember" />
      {children}
    </p>
  );
}

export default function ContactForm() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [kinds, setKinds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  /** set when the server has no delivery configured, so we can offer mail instead */
  const [fallback, setFallback] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      returnTo.current = document.activeElement as HTMLElement;
      /*
        Open on a blank form, always.

        The dialog stays mounted after it closes, so a visitor who sent
        something and came back later was met with the confirmation from last
        time and no way past it short of reloading the page. The text inputs
        are uncontrolled and reset themselves when the form remounts; these are
        the pieces that were quietly surviving.
      */
      setState("idle");
      setErrors({});
      setFallback("");
      setKinds([]);
      setBudget("");
      setOpen(true);
    };
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    // let the exit animation run before handing focus back
    setTimeout(() => returnTo.current?.focus?.(), 260);
  };

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();

    // The panel animates in, so the field is not focusable on the first frame,
    // and a single deferred focus() loses the race whenever the main thread is
    // busy — which on this page it often is. Keep trying briefly, and stop the
    // moment focus is anywhere inside the panel so we never fight the visitor
    // for the field they chose themselves.
    let tries = 0;
    const grab = window.setInterval(() => {
      const inside = panelRef.current?.contains(document.activeElement);
      if (inside || ++tries > 40) {
        window.clearInterval(grab);
        return;
      }
      firstRef.current?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      // a dialog that lets Tab wander behind it is a dialog you cannot use
      // from the keyboard: hold the ring inside the panel
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(grab);
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
    // close is stable enough for this dialog's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleKind = (k: string) =>
    setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  /**
   * An error you have to go looking for is an error you did not see. The panel
   * scrolls, so put the topmost bad field in the middle of it and give it the
   * caret — the message underneath then arrives in the same glance.
   */
  const goToFirst = (found: Errors) => {
    const field = FIELDS.find((f) => found[f]);
    if (!field) return;
    const el = panelRef.current?.querySelector<HTMLElement>(`#cf-${field}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    // after the scroll, so focus does not fight it for the scroll position
    setTimeout(() => el?.focus({ preventScroll: true }), 260);
  };

  /**
   * The send-level error sits just above the pinned footer, which means on a
   * short panel it lands underneath it — you press Send and, as far as you can
   * tell, nothing happens. Bring it into view once React has painted it.
   */
  const showFormError = () =>
    requestAnimationFrame(() =>
      panelRef.current
        ?.querySelector("#cf-form-err")
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
    );

  /** a corrected field should stop looking wrong straight away, not at next send */
  const clearOne = (e: React.FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as Field;
    if (!name || !errors[name]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""), // honeypot
      kinds,
      budget,
    };

    // checked here as well as on the server, so a typo costs a glance rather
    // than a round trip
    const local = validate(payload);
    if (Object.keys(local).length) {
      setErrors(local);
      setFallback("");
      goToFirst(local);
      return;
    }

    setState("sending");
    setErrors({});
    setFallback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setState("sent");
        form.reset();
        setKinds([]);
        setBudget("");
        return;
      }

      if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        goToFirst(body.errors);
      } else if (res.status === 503 || res.status === 502) {
        // nothing is wired up on the server, or the provider is down — rather
        // than lose what they wrote, hand it to their mail client intact
        const lines = [
          payload.message,
          "",
          `— ${payload.name}${payload.company ? `, ${payload.company}` : ""}`,
          kinds.length ? `Looking for: ${kinds.join(", ")}` : "",
          budget ? `Budget: ${budget}` : "",
        ].filter(Boolean);
        setFallback(
          `mailto:${EMAIL}?subject=${encodeURIComponent(
            `Project enquiry — ${payload.name}`
          )}&body=${encodeURIComponent(lines.join("\n"))}`
        );
        setErrors({ form: "The inbox link isn't live yet — send it as an email instead." });
        showFormError();
      } else {
        setErrors({ form: body.error || "Something went wrong. Try again in a moment." });
        showFormError();
      }
    } catch {
      setErrors({ form: "No connection. Check your network and try again." });
      showFormError();
    }
    setState("idle");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[360] flex items-stretch justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            data-lenis-prevent
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[100svh] w-full flex-col overflow-y-auto border-ink/20 bg-void
                       sm:max-h-[88svh] sm:max-w-2xl sm:border"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/15 bg-void/95 px-5 py-4 backdrop-blur md:px-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-dim">
                START A PROJECT <span className="text-ember">/</span> NEW MESSAGE
              </span>
              {/* -mr-2 keeps the optical margin while the padding gives the
                  tap target the size a thumb needs */}
              <button
                type="button"
                onClick={close}
                data-cursor="CLOSE"
                aria-label="Close contact form"
                className="-mr-2 shrink-0 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/70 transition-colors hover:text-ember"
              >
                <span className="hidden sm:inline">ESC — </span>CLOSE
              </button>
            </div>

            {state === "sent" ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center md:px-10">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-ember text-2xl text-ember"
                >
                  ✓
                </span>
                <h2 id="contact-form-title" className="font-display text-3xl font-bold text-ink md:text-4xl">
                  Message sent
                </h2>
                <p className="max-w-sm font-mono text-xs leading-relaxed text-dim">
                  It landed in my inbox. I read everything and usually reply within 24 hours —
                  from Hamilton, Ontario.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 border border-ember bg-ember px-8 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-transparent hover:text-ember"
                >
                  Back to the site
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                onInput={clearOne}
                noValidate
                className="flex flex-col gap-6 px-5 pb-0 pt-7 md:px-8 md:pt-9"
              >
                <div>
                  <h2
                    id="contact-form-title"
                    className="font-display text-[1.7rem] font-extrabold leading-[1.05] text-ink sm:text-[2rem] md:text-[2.6rem]"
                  >
                    Tell me what you&rsquo;re building
                  </h2>
                  <p className="mt-2 font-mono text-[11px] leading-relaxed text-dim md:text-xs">
                    Websites, apps, or anything with moving parts. A few lines is plenty to start.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={LABEL} htmlFor="cf-name">
                      Name <span className="text-ember">*</span>
                    </label>
                    <input
                      ref={firstRef}
                      id="cf-name"
                      name="name"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                      placeholder="Your name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "cf-name-err" : undefined}
                      className={fieldClass(errors.name)}
                    />
                    {errors.name && <FieldError id="cf-name-err">{errors.name}</FieldError>}
                  </div>

                  <div>
                    <label className={LABEL} htmlFor="cf-email">
                      Email <span className="text-ember">*</span>
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      enterKeyHint="next"
                      placeholder="you@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "cf-email-err" : undefined}
                      className={fieldClass(errors.email)}
                    />
                    {errors.email && <FieldError id="cf-email-err">{errors.email}</FieldError>}
                  </div>
                </div>

                <div>
                  <label className={LABEL} htmlFor="cf-company">
                    Company or project <span className="text-ink/40">— optional</span>
                  </label>
                  <input
                    id="cf-company"
                    name="company"
                    autoComplete="organization"
                    placeholder="What it's called"
                    className={FIELD}
                  />
                </div>

                <fieldset className="min-w-0">
                  <legend className={LABEL}>What do you need?</legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => {
                      const on = kinds.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleKind(s)}
                          aria-pressed={on}
                          className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                            on
                              ? "border-ember bg-ember text-void"
                              : "border-ink/25 text-ink/75 hover:border-ink/50 hover:text-ink"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className={LABEL}>
                    Budget <span className="text-ink/40">— optional</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => {
                      const on = budget === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(on ? "" : b)}
                          aria-pressed={on}
                          className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                            on
                              ? "border-ember bg-ember text-void"
                              : "border-ink/25 text-ink/75 hover:border-ink/50 hover:text-ink"
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label className={LABEL} htmlFor="cf-message">
                    The project <span className="text-ember">*</span>
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What it is, roughly when you need it, and anything you already know you want."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "cf-message-err" : undefined}
                    className={`${fieldClass(errors.message)} resize-y`}
                  />
                  {errors.message && <FieldError id="cf-message-err">{errors.message}</FieldError>}
                </div>

                {/* not shown to anyone; a filled value means a bot walked the form */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                  <label htmlFor="cf-website">Leave this empty</label>
                  <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {/* the send itself failed rather than a field — same voice, but
                    it gets a rule around it so it does not read as a caption */}
                {errors.form && (
                  <p
                    id="cf-form-err"
                    role="alert"
                    className="flex items-start gap-2 border border-ember/40 bg-ember/5 px-4 py-3 font-mono text-[11px] leading-relaxed text-ember"
                  >
                    <span aria-hidden="true" className="mt-[6px] block h-1 w-1 shrink-0 rounded-full bg-ember" />
                    <span>
                      {errors.form}{" "}
                      {fallback && (
                        <a href={fallback} className="underline underline-offset-4 hover:text-ink">
                          Open it in mail
                        </a>
                      )}
                    </span>
                  </p>
                )}

                {/*
                  Pinned to the foot of the panel. The form is taller than a
                  laptop dialog or a phone screen, and a send button you have
                  to go looking for is a form people abandon.
                */}
                <div className="sticky bottom-0 -mx-5 flex flex-col-reverse items-stretch gap-4 border-t border-ink/15 bg-void/95 px-5 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:px-8">
                  <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ink/55">
                    Or email{" "}
                    <a href={`mailto:${EMAIL}`} className="text-ink/80 underline underline-offset-4 hover:text-ember">
                      {EMAIL}
                    </a>
                  </p>
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    data-cursor="SEND"
                    className="group flex items-center justify-center gap-3 border border-ember bg-ember px-8 py-4 font-mono text-[10px] uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-transparent hover:text-ember disabled:cursor-wait disabled:opacity-60"
                  >
                    {state === "sending" ? "Sending…" : "Send message"}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
