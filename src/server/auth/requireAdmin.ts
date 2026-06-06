import type { AuthUser } from "./config";

/**
 * Admin authorization guard for Plan 1.
 * Uses ADMIN_EMAILS environment variable allowlist.
 * Returns true if the user is in the admin allowlist.
 *
 * Production note: In production, ADMIN_EMAILS must be set via secure environment
 * configuration, not hardcoded. This is a Plan 1 minimal implementation;
 * future plans should introduce a role model with DB-backed roles.
 */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  if (!user.emailVerified) return false;

  const adminEmailsEnv = process.env.ADMIN_EMAILS ?? "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(user.email.toLowerCase());
}

/**
 * Throws an error if the user is not an admin.
 * Use this as a guard at the top of admin server actions.
 */
export function requireAdmin(user: AuthUser | null): void {
  if (!isAdmin(user)) {
    throw new Error("Unauthorized: admin access required");
  }
}
