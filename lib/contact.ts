/**
 * The contact form's rules, in one place.
 *
 * The dialog checks these before it posts so a mistake is caught the instant
 * you press send, and the route checks them again because anything arriving
 * over HTTP is a stranger. Sharing the module is what keeps the two honest:
 * two copies of a validator drift, and then the form accepts something the
 * server rejects.
 */

export const LIMITS = { name: 80, email: 160, company: 120, message: 4000 };

/** Deliberately loose. The address is verified by replying to it, not by regex. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Ordered as they appear, so "the first problem" means the topmost one. */
export const FIELDS = ["name", "email", "message"] as const;
export type Field = (typeof FIELDS)[number];
export type Errors = Partial<Record<Field, string>>;

/**
 * One field's problem, or nothing.
 *
 * Split out because the console asks for the three in turn and needs to judge
 * each answer on its own — the dialog judges all three together. Same rules
 * either way, which is the point of them living here.
 *
 * Note there is no floor on the message length: "fix my checkout" is a
 * perfectly good first message, and a form that argues about how much you have
 * written is a form you close.
 */
export function validateField(field: Field, raw: unknown): string | undefined {
  const v = String(raw ?? "").trim();
  switch (field) {
    case "name":
      if (!v) return "Tell me who you are.";
      if (v.length > LIMITS.name) return "That name is too long.";
      return;
    case "email":
      if (!v) return "I need somewhere to reply.";
      if (v.length > LIMITS.email || !EMAIL_RE.test(v))
        return "That email address doesn't look right.";
      return;
    case "message":
      if (!v) return "Say a little about the project.";
      if (v.length > LIMITS.message) return "That message is longer than this form takes.";
      return;
  }
}

/**
 * Every problem at once, keyed by field. Returning only the first makes the
 * visitor discover their mistakes one round trip at a time.
 */
export function validate(input: { name?: unknown; email?: unknown; message?: unknown }): Errors {
  const errors: Errors = {};
  for (const f of FIELDS) {
    const problem = validateField(f, input[f]);
    if (problem) errors[f] = problem;
  }
  return errors;
}
