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
 * Every problem at once, keyed by field.
 *
 * Returning only the first makes the visitor discover their mistakes one round
 * trip at a time. There is no floor on the message length either — "fix my
 * checkout" is a perfectly good first message, and a form that argues about
 * how much you have written is a form you close.
 */
export function validate(input: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}): Errors {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "").trim();
  const errors: Errors = {};

  if (!name) errors.name = "Tell me who you are.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!email) errors.email = "I need somewhere to reply.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.email = "That email address doesn't look right.";

  if (!message) errors.message = "Say a little about the project.";
  else if (message.length > LIMITS.message)
    errors.message = "That message is longer than this form takes.";

  return errors;
}
