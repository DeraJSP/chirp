export default function CommentCount(props: { count: number }) {
  const countCheck = () =>
    `${props.count > 1 ? props.count + " Comments" : props.count + " Comment"}`;
  return <p>{countCheck()}</p>;
}
