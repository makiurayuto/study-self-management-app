import TeacherLayout from "@/features/teacher/components/TeacherLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
