// src/components/AppButton.tsx
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../constants/theme";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger";
};

export function AppButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}: AppButtonProps) {
  const backgroundColor =
    variant === "danger" ? theme.colors.danger : theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    alignItems: "center",
  },
  text: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  disabled: { opacity: 0.5 },
});
