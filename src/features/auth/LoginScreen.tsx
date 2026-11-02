// src/features/auth/LoginScreen.tsx
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { FormInput } from "../../components/FormInput";
import { theme } from "../../constants/theme";
import { useAuth } from "./AuthContext";

export function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Chặn bấm lặp ngay lập tức (state cập nhật bất đồng bộ nên cần thêm ref)
  const submitting = useRef(false);

  async function handleLogin() {
    if (submitting.current) return;
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    submitting.current = true;
    setLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        setError("Invalid credentials.");
        return;
      }
      router.replace("/library");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library Pocket</Text>
      <Text style={styles.subtitle}>Member Login</Text>

      <FormInput
        label="Username"
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <FormInput
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AppButton
        label={loading ? "Checking..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.large,
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  title: { fontSize: 28, fontWeight: "700", color: theme.colors.text },
  subtitle: { fontSize: 16, color: theme.colors.secondaryText },
  error: { color: theme.colors.danger },
});
