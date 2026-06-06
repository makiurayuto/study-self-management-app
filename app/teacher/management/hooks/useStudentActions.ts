import {
  updateStudentStatus,
  bulkUpdateStatus,
} from "@/app/lib/studentService";

export function useStudentActions(fetchData: () => void) {
    const changeStatus = async (
    uid: string,
    status: StudentStatus
    ) => {
    await updateStudentStatus(uid, status);
    fetchData();
    };

    type StudentStatus = "active" | "hidden" | "graduated";

    const bulkChange = async (
    uids: string[],
    status: StudentStatus
    ) => {
    await bulkUpdateStatus(uids, status);
    fetchData();
    };

    return {
        changeStatus,
        bulkChange,
    };
}