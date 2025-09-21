export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "Chưa có";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Chưa có";

  // Format theo chuẩn Việt Nam: dd/MM/yyyy HH:mm
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLegal(legal: string | null): string {
  if (!legal || legal.trim() === "") return "Chưa rõ";
  return legal;
}
