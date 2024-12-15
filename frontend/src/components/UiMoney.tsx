interface UiMoneyProps {
  cents: number;
  currency: string; // e.g., 'USD', 'EUR', 'GBP'
}

export const UiMoney: React.FC<UiMoneyProps> = ({ cents, currency }) => {
  const formatter = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const dollars = cents / 100;

  return <span>{formatter.format(dollars)}</span>;
};
