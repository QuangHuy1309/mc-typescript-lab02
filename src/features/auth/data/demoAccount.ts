// src/features/auth/data/demoAccount.ts
import type { MemberProfile } from "../types";

export const DEMO_ACCOUNT: {
  username: string;
  password: string;
  profile: MemberProfile;
} = {
  username: "reader01",
  password: "library2026",
  profile: {
    id: "1",
    username: "reader01",
    fullName: "Tran Gia Bao",
    cardId: "LIB-2026-0042",
    memberTier: "Gold",
    avatarUrl: "https://i.ibb.co/1fCW7zHX/avatar.jpg",
    borrowedBooks: [
      { id: "b1", title: "Clean Code", dueDate: "2026-11-20", status: "On loan" },
      { id: "b2", title: "Designing Data-Intensive Applications", dueDate: "2026-11-05", status: "Due soon" },
      { id: "b3", title: "The Pragmatic Programmer", dueDate: "2026-10-28", status: "Overdue" },
      { id: "b4", title: "Learning React Native", dueDate: "2026-11-25", status: "On loan" },
    ],
  },
};
