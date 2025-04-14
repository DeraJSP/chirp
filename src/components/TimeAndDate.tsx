export default function TimeAndDate(props: { docDate: Date }) {
  const { docDate } = props;
  const currentDate = new Date();

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const showTime = (currentDate: Date) =>
    `${
      docDate.getFullYear() === currentDate.getFullYear()
        ? docDate.toLocaleDateString() === currentDate.toLocaleDateString()
          ? docDate.toTimeString().slice(0, 5)
          : docDate.getDate() + " " + month[docDate.getMonth()]
        : docDate.getDate() +
          " " +
          month[docDate.getMonth()] +
          ", " +
          docDate.getFullYear()
    }`;
  return <>{showTime(currentDate)}</>;
}
