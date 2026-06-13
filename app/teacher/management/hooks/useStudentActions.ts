import {
  updateStudentStatus,
  bulkUpdateStatus,
  updateStudentName,
} from "@/lib/studentService";
import type { StudentStatus } from "@/types/student";

export function useStudentActions(fetchData: () => void) {

  const changeStatus = async (
    uid: string,
    status: StudentStatus
  ) => {
    await updateStudentStatus(uid, status);
    fetchData();
  };

  const bulkChange = async (
    uids: string[],
    status: StudentStatus
  ) => {
    await bulkUpdateStatus(uids, status);
    fetchData();
  };

  const updateName = async (
    uid: string,
    name: string
  ) => {
    await updateStudentName(uid, name);
    fetchData();
  };

  return {
    changeStatus,
    bulkChange,
    updateName,
  };
}