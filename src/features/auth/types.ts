// src/features/auth/types.ts
export type BookStatus = "On loan" | "Due soon" | "Overdue";

export type Book = {
  id: string;
  title: string;
  dueDate: string;
  status: BookStatus;
};

export type MemberProfile = {
  id: string;
  username: string;
  fullName: string;
  cardId: string;
  memberTier: string;
  avatarUrl: string;
  borrowedBooks: Book[];
};
