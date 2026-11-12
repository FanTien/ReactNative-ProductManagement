
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import {
  addLecturer,
  updateLecturer,
} from "../services/lecturerService";

export default function LecturerFormScreen({
  lecturer,
  onSaved,
  onCancel,
}) {
  const isEditing = !!lecturer;

  const [IDGV, setIDGV] = useState(lecturer?.IDGV || "");
  const [Fullname, setFullname] = useState(lecturer?.Fullname || "");
  const [ImageURL, setImageURL] = useState(lecturer?.Image || "");
  const [SumClass, setSumClass] = useState(
    lecturer ? String(lecturer.SumClass) : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showMessage = (message) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Thông báo", message);
    }
  };

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const selectedAsset = result.assets[0];

      // Resize và nén ảnh để phù hợp giới hạn Firestore
      const compressedImage = await ImageManipulator.manipulateAsync(
        selectedAsset.uri,
        [{ resize: { width: 500 } }],
        {
          compress: 0.45,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (!compressedImage.base64) {
        throw new Error("Không thể xử lý ảnh.");
      }

      const imageData =
        "data:image/jpeg;base64," + compressedImage.base64;

      if (imageData.length > 700000) {
        showMessage("Ảnh vẫn quá lớn. Vui lòng chọn ảnh khác.");
        return;
      }

      setImageURL(imageData);
      setError("");
    } catch (err) {
      console.error(err);
      showMessage("Không thể chọn hoặc xử lý ảnh.");
    }
  };

  const handleSave = async () => {
    setError("");

    if (
      !IDGV.trim() ||
      !Fullname.trim() ||
      !ImageURL ||
      !SumClass.trim()
    ) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn ảnh.");
      return;
    }

    const numberOfClasses = Number(SumClass);

    if (!Number.isInteger(numberOfClasses) || numberOfClasses < 0) {
      setError("Số lớp phải là số nguyên không âm.");
      return;
    }

    const lecturerData = {
      IDGV: IDGV.trim(),
      Fullname: Fullname.trim(),
      Image: ImageURL,
      SumClass: numberOfClasses,
    };

    try {
      setLoading(true);

      if (isEditing) {
        await updateLecturer(lecturer.IDGV, lecturerData);
      } else {
        await addLecturer(lecturerData);
      }

      showMessage(
        isEditing
          ? "Cập nhật giảng viên thành công!"
          : "Thêm giảng viên thành công!"
      );

      onSaved();
    } catch (err) {
      console.error(err);
      setError(
        "Không thể lưu dữ liệu. Hãy kiểm tra kết nối hoặc dung lượng ảnh."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {isEditing ? "CẬP NHẬT GIẢNG VIÊN" : "THÊM GIẢNG VIÊN"}
        </Text>

        <Text style={styles.label}>Mã giảng viên (IDGV)</Text>
        <TextInput
          style={[styles.input, isEditing && styles.disabledInput]}
          value={IDGV}
          onChangeText={setIDGV}
          placeholder="Ví dụ: GV001"
          editable={!isEditing}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Họ và tên (Fullname)</Text>
        <TextInput
          style={styles.input}
          value={Fullname}
          onChangeText={setFullname}
          placeholder="Nhập họ và tên"
        />

        <Text style={styles.label}>Ảnh giảng viên (Image)</Text>

        {ImageURL ? (
          <Image
            source={{ uri: ImageURL }}
            style={styles.preview}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text>Chưa chọn ảnh</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {ImageURL ? "CHỌN ẢNH KHÁC" : "CHỌN ẢNH TỪ THƯ VIỆN"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Số lớp (SumClass)</Text>
        <TextInput
          style={styles.input}
          value={SumClass}
          onChangeText={setSumClass}
          placeholder="Nhập số lớp"
          keyboardType="numeric"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "LƯU THAY ĐỔI" : "THÊM GIẢNG VIÊN"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.buttonText}>QUAY LẠI</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FA",
    padding: 20,
  },
  form: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#174A7E",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontWeight: "600",
    marginBottom: 7,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 7,
    padding: 12,
    marginBottom: 17,
    fontSize: 15,
  },
  disabledInput: {
    backgroundColor: "#EEEEEE",
    color: "#777777",
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "center",
    backgroundColor: "#EEEEEE",
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: "#2878B5",
    padding: 12,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#16834A",
    padding: 14,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#777777",
    padding: 14,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  error: {
    color: "#D93636",
    marginBottom: 12,
  },
});
