"use client";

import Card from "@/components/shared/Card";
import SectionTitle from "@/components/shared/SectionTitle";
import DateNavigator from "@/components/shared/DateNavigator";

type Props = {
  currentDateLabel: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onYesterday: () => void;
};

export default function DateSection({
  currentDateLabel,
  onPrevDay,
  onNextDay,
  onYesterday,
}: Props) {
  return (
    <Card>
      <SectionTitle>
        📅 日付ナビ
      </SectionTitle>

      <DateNavigator
        currentDateLabel={currentDateLabel}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onYesterday={onYesterday}
      />
    </Card>
  );
}