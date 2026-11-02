// src/app/library.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../features/auth/AuthContext";
import { LibraryScreen } from "../features/library/LibraryScreen";

export default function LibraryPage() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/login" />;
  }
  return <LibraryScreen />;
}
