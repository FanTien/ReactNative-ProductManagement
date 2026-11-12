
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import {
  getAllLecturers,
  deleteLecturer,
} from "../services/lecturerService";

export default function LecturerListScreen({
  onAdd,
  onEdit,
  onLogout,
  reloadKey,
}) {
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLecturers = async () => {
    try {
      setLoading(true);
      const data = await getAllLecturers();
      setLecturers(data);
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") {
        window.alert("Không thể tải danh sách giảng viên.");
      } else {
        Alert.alert("Lỗi", "Không thể tải danh sách giảng viên.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturers();
  }, [reloadKey]);

  const handleDelete = (IDGV) => {
    const executeDelete = async () => {
      try {
        await deleteLecturer(IDGV);
        await loadLecturers();
      } catch (error) {
        console.error(error);
        if (Platform.OS === "web") {
          window.alert("Không thể xóa giảng viên.");
        } else {
          Alert.alert("Lỗi", "Không thể xóa giảng viên.");
        }
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Bạn có chắc muốn xóa giảng viên ${IDGV}?`)) {
        executeDelete();
      }
    } else {
      Alert.alert(
        "Xác nhận xóa",
        `Bạn có chắc muốn xóa giảng viên ${IDGV}?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: executeDelete,
          },
        ]
      );
    }
  };

  const keyword = search.trim().toLowerCase();

  const filteredLecturers = lecturers.filter((item) =>
    item.IDGV?.toLowerCase().includes(keyword) ||
    item.Fullname?.toLowerCase().includes(keyword)
  );

  const renderLecturer = ({ item }) => (
    <View style={styles.card}>
      {item.Image ? (
        <Image
          source={{ uri: item.Image }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text>Không có ảnh</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.Fullname}</Text>
        <Text>Mã GV: {item.IDGV}</Text>
        <Text>Số lớp: {item.SumClass}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.IDGV)}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QUẢN LÝ GIẢNG VIÊN</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm theo mã hoặc họ tên..."
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
      >
        <Text style={styles.buttonText}>+ Thêm giảng viên</Text>
      </TouchableOpacity>

      <Text style={styles.count}>
        Tổng số giảng viên: {lecturers.length}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredLecturers}
          keyExtractor={(item) => item.IDGV}
          renderItem={renderLecturer}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Không tìm thấy giảng viên.
            </Text>
          }
          onRefresh={loadLecturers}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#174A7E",
  },
  logoutButton: {
    backgroundColor: "#777777",
    padding: 10,
    borderRadius: 7,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#16834A",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  count: {
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#EEEEEE",
  },
  avatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#174A7E",
  },
  actions: {
    gap: 6,
  },
  editButton: {
    backgroundColor: "#D89B20",
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#D93636",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#777777",
    marginTop: 30,
  },
});
