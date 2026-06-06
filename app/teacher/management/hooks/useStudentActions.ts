import {
  updateStudentStatus,
  bulkUpdateStatus,
} from "@/app/lib/studentService";

export function useStudentActions(fetchData: () => void) {
  const changeStatus = async (
    uid: string,
    status: "active" | "hidden" | "graduated"
  ) => {
    await updateStudentStatus(uid, status);
    fetchData();
  };

  const bulkChange = async (
    uids: string[],
    status: "active" | "hidden" | "graduated"
  ) => {
    await bulkUpdateStatus(uids, status);
    fetchData();
  };

  return {
    changeStatus,
    bulkChange,
  };
}