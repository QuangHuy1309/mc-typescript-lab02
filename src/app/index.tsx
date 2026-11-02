// src/app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../features/auth/AuthContext";

export default function Index() {
  const { user } = useAuth();
  return <Redirect href={user ? "/library" : "/login"} />;
}
