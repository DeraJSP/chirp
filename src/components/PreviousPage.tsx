import { useNavigate } from "react-router-dom";
import left_arrow from "./img/left_arrow.svg";

export default function PreviousPage(props: { page: string }) {
  const page = props.page;
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-x-3 ml-10 font-bold text-xl text-gray-600">
      <button
        onClick={() => navigate(-1)}
        className="hover:bg-gray-200 hover:rounded-xl p-2"
      >
        <img src={left_arrow} alt="go to previous page" className="w-6" />
      </button>
      <p>{page}</p>
    </div>
  );
}
