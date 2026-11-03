import Button from "@/components/shared/Button";

type Props = {
  currentDateLabel: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onYesterday: () => void;
  onToday: () => void;
  disableNext?: boolean;
  isYesterday?: boolean;
  isToday?: boolean;
};

export default function DateNavigator({
  currentDateLabel,
  onPrevDay,
  onNextDay,
  onYesterday,
  onToday,
  disableNext = false,
  isYesterday = false,
  isToday = false,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Button variant="secondary" size="sm" onClick={onPrevDay} ariaLabel="前日">
          ◀
        </Button>

        <div style={{ fontSize: 20, fontWeight: 700, minWidth: 120, textAlign: "center" }}>
          {currentDateLabel}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onNextDay}
          disabled={disableNext}
          ariaLabel="翌日"
        >
          ▶
        </Button>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <Button
          variant={isYesterday ? "primary" : "secondary"}
          size="sm"
          onClick={onYesterday}
        >
          昨日
        </Button>
        <Button
          variant={isToday ? "primary" : "secondary"}
          size="sm"
          onClick={onToday}
        >
          今日
        </Button>
      </div>
    </div>
  );
}
