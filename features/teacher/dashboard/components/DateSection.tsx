"use client";

import Card from "@/app/components/shared/Card";
import SectionTitle from "@/app/components/shared/SectionTitle";
import DateNavigator from "@/app/components/shared/DateNavigator";

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