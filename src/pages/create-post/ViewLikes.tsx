import { ReactNode } from "react";
import close from "../../components/img/close.svg";

export default function ViewLikes(props: {
  children: ReactNode;
  trigger: boolean;
  setTrigger: (value: boolean) => void;
}) {
  return props.trigger ? (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative p-8 bg-white shadow-xl w-96 h-96 rounded-2xl border-[1px] border-cGray-100">
        <button
          onClick={() => props.setTrigger(false)}
          className="absolute top-3 right-3"
        >
          <img src={close} alt="Close popup" className="w-9" />
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}
