// src/features/auth/services/authService.ts
import { DEMO_ACCOUNT } from "../data/demoAccount";
import type { MemberProfile } from "../types";

// Đúng -> MemberProfile, sai -> null. Service KHÔNG điều khiển router.
export async function loginWithUsernamePassword(
  username: string,
  password: string
): Promise<MemberProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const valid =
    username.trim() === DEMO_ACCOUNT.username &&
    password === DEMO_ACCOUNT.password;

  return valid ? DEMO_ACCOUNT.profile : null;
}
