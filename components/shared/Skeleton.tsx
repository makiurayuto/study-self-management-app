type Props = {
  height?: number | string;
  width?: number | string;
  radius?: number;
};

// 読み込み中のプレースホルダー
export default function Skeleton({
  height = 16,
  width = "100%",
  radius = 8,
}: Props) {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: radius }}
    />
  );
}
