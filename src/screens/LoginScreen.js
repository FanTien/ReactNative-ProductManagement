
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("tienp.23it@vku.udn.vn");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>QUẢN LÝ GIẢNG VIÊN</Text>
        <Text style={styles.subtitle}>Đăng nhập quản trị viên</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF2F8",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    color: "#174A7E",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666666",
    marginTop: 10,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
    color: "#333333",
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 7,
    paddingHorizontal: 12,
    marginBottom: 18,
    fontSize: 15,
  },
  button: {
    height: 46,
    backgroundColor: "#174A7E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    marginTop: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  error: {
    color: "red",
    marginBottom: 12,
    fontSize: 13,
  },
});
