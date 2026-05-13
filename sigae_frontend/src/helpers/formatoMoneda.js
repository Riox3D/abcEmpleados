export default (money) =>{
  if (money === undefined) {
    return "$0";
  }
  const formatMoney = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });

  return formatMoney.format(money);
}
