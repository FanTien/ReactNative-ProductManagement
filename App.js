
import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./src/config/firebase";

import LoginScreen from "./src/screens/LoginScreen";
import LecturerListScreen from "./src/screens/LecturerListScreen";
import LecturerFormScreen from "./src/screens/LecturerFormScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [screen, setScreen] = useState("list");
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      setScreen("list");
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAdd = () => {
    setSelectedLecturer(null);
    setScreen("form");
  };

  const handleEdit = (lecturer) => {
    setSelectedLecturer(lecturer);
    setScreen("form");
  };

  const handleSaved = () => {
    setReloadKey((previous) => previous + 1);
    setSelectedLecturer(null);
    setScreen("list");
  };

  const handleCancel = () => {
    setSelectedLecturer(null);
    setScreen("list");
  };

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (screen === "form") {
    return (
      <LecturerFormScreen
        lecturer={selectedLecturer}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <LecturerListScreen
      onAdd={handleAdd}
      onEdit={handleEdit}
      onLogout={handleLogout}
      reloadKey={reloadKey}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
