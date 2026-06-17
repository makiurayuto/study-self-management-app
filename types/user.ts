export type UserRole =
  | "student"
  | "teacher"
  | "admin";

export type User = {
  uid: string;
  name: string;
  role: UserRole;
  schoolId: string | null;
};