export type StudentStatus = "active" | "hidden" | "graduated";

export type Student = {
  uid: string;
  name: string;

  role: "student" | "teacher";

  status: StudentStatus;

  schoolId?: string | null;

  hiddenAt?: any;      // ←一旦anyでもOK（移行中）
  graduatedAt?: any;
};