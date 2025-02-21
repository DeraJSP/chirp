export default function TimeAndDate(props: { postDate: Date }) {
  const { postDate } = props;
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
      postDate.getFullYear() === currentDate.getFullYear()
        ? postDate.toLocaleDateString() === currentDate.toLocaleDateString()
          ? postDate.toTimeString().slice(0, 5)
          : postDate.getDate() + " " + month[postDate.getMonth()]
        : postDate.getDate() +
          " " +
          month[postDate.getMonth()] +
          ", " +
          postDate.getFullYear()
    }`;
  return <>{showTime(currentDate)}</>;
}
