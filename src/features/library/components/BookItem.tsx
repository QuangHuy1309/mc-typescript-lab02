// src/features/library/components/BookItem.tsx
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";
import type { Book, BookStatus } from "../../auth/types";

type BookItemProps = {
  book: Book;
  showDueDate?: boolean;
};

const STATUS_COLOR: Record<BookStatus, string> = {
  "On loan": theme.colors.success,
  "Due soon": theme.colors.warning,
  Overdue: theme.colors.danger,
};

export function BookItem({ book, showDueDate = true }: BookItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{book.title}</Text>
      {showDueDate && <Text style={styles.due}>Due: {book.dueDate}</Text>}
      <Text style={[styles.status, { color: STATUS_COLOR[book.status] }]}>
        {book.status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.surface,
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
  due: { fontSize: 14, color: theme.colors.secondaryText },
  status: { fontSize: 14, fontWeight: "700" },
});
