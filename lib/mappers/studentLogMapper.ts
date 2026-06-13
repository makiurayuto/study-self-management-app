export const toStudentDailyLog = (data: any) => {
  return {
    uid: data.uid,
    date: data.date,
    studyTime: data.studyTime ?? null,
    phoneTime: data.phoneTime ?? null,
    sleepTime: data.sleepTime ?? "",
    satisfaction: data.satisfaction ?? "",
  };
};