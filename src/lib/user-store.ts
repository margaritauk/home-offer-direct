// Shared in-memory user store for auth API routes.
// In production, replace with database queries.
export const userStore = new Map<string, {
  name: string;
  email: string;
  passwordHash: string;
  tier: string;
  state: string;
  createdAt: string;
}>();
