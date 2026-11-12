
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

const lecturerCollection = collection(db, "GiangVien");

// Lấy danh sách giảng viên
export const getAllLecturers = async () => {
  const snapshot = await getDocs(lecturerCollection);

  return snapshot.docs.map((item) => ({
    ...item.data(),
    documentId: item.id,
  }));
};

// Thêm giảng viên
export const addLecturer = async (lecturer) => {
  const IDGV = lecturer.IDGV.trim();

  const lecturerRef = doc(db, "GiangVien", IDGV);
  const existingLecturer = await getDoc(lecturerRef);

  if (existingLecturer.exists()) {
    throw new Error("Mã giảng viên đã tồn tại.");
  }

  const lecturerData = {
    IDGV,
    Fullname: lecturer.Fullname.trim(),
    Image: lecturer.Image.trim(),
    SumClass: Number(lecturer.SumClass),
  };

  await setDoc(lecturerRef, lecturerData);
};

// Cập nhật giảng viên
export const updateLecturer = async (IDGV, lecturer) => {
  const lecturerData = {
    Fullname: lecturer.Fullname.trim(),
    Image: lecturer.Image.trim(),
    SumClass: Number(lecturer.SumClass),
  };

  const lecturerRef = doc(db, "GiangVien", IDGV);

  await updateDoc(lecturerRef, lecturerData);
};

// Xóa giảng viên
export const deleteLecturer = async (IDGV) => {
  const lecturerRef = doc(db, "GiangVien", IDGV);

  await deleteDoc(lecturerRef);
};
