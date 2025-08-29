export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN");
