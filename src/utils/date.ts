export function formatStudyDate(date: string | null): string {
  if (!date) return "Chưa có dữ liệu";
  try {
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
      new Date(`${date}T00:00:00`),
    );
  } catch {
    return date;
  }
}

export function formatRelativeStudyDate(date: string | null): string {
  if (!date) return "Chưa học buổi nào";
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
  if (date === todayStr) {
    return "Hôm nay";
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  
  if (date === yesterdayStr) {
    return "Hôm qua";
  }

  return formatStudyDate(date);
}

