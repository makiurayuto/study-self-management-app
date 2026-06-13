export type StudentDailyLog = {
  uid: string; // student uid
  date: string; // YYYY-MM-DD

  studyTime?: number | null;
  phoneTime?: number | null;

  sleepTime: string;
  satisfaction: string;
};