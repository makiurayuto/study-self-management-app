import { Timestamp } from "firebase/firestore";

export type StudentStatus = "active" | "hidden" | "graduated";

export type Student = {
  uid: string;
  name: string;

  role: "student" | "teacher";

  // ←ここが重要：まだ移行途中なので optional
  status?: StudentStatus;

  schoolId?: string | null;

  hiddenAt?: Timestamp | null;
  graduatedAt?: Timestamp | null;
};