// src/features/library/LibraryScreen.tsx
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { theme } from "../../constants/theme";
import { useAuth } from "../auth/AuthContext";
import { BookItem } from "./components/BookItem";

export function LibraryScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  // Lớp bảo vệ thứ hai; route layer (app/library.tsx) đã Redirect
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No active session.</Text>
        <AppButton label="Go to Login" onPress={() => router.replace("/login")} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Library</Text>
      <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{user.fullName}</Text>
      <Text style={styles.info}>Card ID: {user.cardId}</Text>
      <Text style={styles.info}>Tier: {user.memberTier}</Text>

      <Text style={styles.sectionTitle}>Borrowed Books</Text>
      {user.borrowedBooks.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}

      <AppButton label="Logout" onPress={handleLogout} variant="danger" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing.large,
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  title: { fontSize: 28, fontWeight: "700", color: theme.colors.text },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: "center" },
  name: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: theme.colors.text,
  },
  info: { fontSize: 16, color: theme.colors.secondaryText, textAlign: "center" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: theme.spacing.medium,
    color: theme.colors.text,
  },
});
