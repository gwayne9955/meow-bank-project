interface UiDateTimeProps {
  date: Date;
}

export const UiDateTime: React.FC<UiDateTimeProps> = ({ date }) => {
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: "long",
  });

  return <span>{formatter.format(date)}</span>;
};