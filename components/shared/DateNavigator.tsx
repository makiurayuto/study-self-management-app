import Button from "@/components/shared/Button";

type Props = {
  currentDateLabel: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onYesterday: () => void;
};

export default function DateNavigator({
  currentDateLabel,
  onPrevDay,
  onNextDay,
  onYesterday,
}: Props) {
  return (
    <>
      <h2>{currentDateLabel}の記録</h2>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <Button variant="secondary" onClick={onPrevDay}>
          ← 前日
        </Button>

        <Button variant="secondary" onClick={onYesterday}>
          昨日
        </Button>

        <Button variant="secondary" onClick={onNextDay}>
          次日 →
        </Button>
      </div>
    </>
  );
}