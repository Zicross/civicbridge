// Minimal auth config stub for development
// In a real implementation this would configure Auth.js (next-auth) with email magic link.

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

// Simulate retrieving the current session user from environment for tests.
export function getCurrentUser(): AuthUser | null {
  // In CI we just return a dummy verified user.
  return {
    id: "user-1",
    email: "test@example.com",
    emailVerified: true,
  };
}
