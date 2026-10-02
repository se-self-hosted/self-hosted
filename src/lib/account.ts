import { avatarUrlFor } from "@/lib/avatar";

/** Columns needed to build the signed-in user's account payload. */
export const accountUserSelect = {
  id: true,
  email: true,
  fullname: true,
  createdAt: true,
  avatarKey: true,
} as const;

type AccountUserRow = {
  id: string;
  email: string;
  fullname: string;
  createdAt: Date;
  avatarKey: string | null;
};

/** The user as the client sees it: the storage key becomes a fetchable URL. */
export function toAccountUser(user: AccountUserRow) {
  return {
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    createdAt: user.createdAt,
    avatarUrl: avatarUrlFor(user.avatarKey),
  };
}
