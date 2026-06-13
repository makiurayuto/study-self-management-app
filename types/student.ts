import { Timestamp } from "firebase/firestore";
export type StudentStatus = "active" | "hidden" | "graduated";

export type Student = {
  uid: string;
  name: string;

  role: "student" | "teacher";

  status: StudentStatus;

  schoolId?: string | null;

  hiddenAt?: Timestamp | null;
  graduatedAt?: Timestamp | null;
};