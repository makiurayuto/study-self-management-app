"use client";

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Props = {
  visibleLogs: Log[];
  studentMap: Record<string, string>;
};

export default function StudentTable({
  visibleLogs,
  studentMap,
}: Props) {
  return (
    <table>
      <tbody>
        {visibleLogs.map((log) => (
          <tr key={log.uid + log.date}>
            <td>{studentMap[log.uid]}</td>
            <td>{log.studyTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}