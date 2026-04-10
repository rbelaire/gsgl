/** Emails that have admin access. All comparisons are lowercased. */
export const ADMIN_EMAILS: string[] = ["rjbelaire@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
