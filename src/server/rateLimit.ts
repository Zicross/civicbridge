// Simple rate limit placeholder – in production replace with real implementation.

export function checkRateLimit(userId: string): boolean {
  // For now always allow – tests will mock this.
  return true;
}
