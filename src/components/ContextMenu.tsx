import { doc, updateDoc } from "firebase/firestore";
import useEditDoc from "./hooks/useEditDoc";
import close from "./img/close.svg";
import { PostType } from "./types/PostType";
import { db } from "../config/firebase";
import EditForm from "./EditForm";
import { useState } from "react";
import useDeleteDoc from "./hooks/useDeleteDoc";

export default function ContextMenu(props: {
  showContextMenu: boolean;
  setShowContextMenu: (value: boolean) => void;
  targetDocCol: string;
  targetDoc: PostType;
}) {
  const { showContextMenu, setShowContextMenu, targetDocCol, targetDoc } =
    props;

  const [showEditForm, setShowEditForm] = useState(false);
  const { delDoc: deletePost } = useDeleteDoc("posts", targetDoc.id);

  return (
    <>
      {showContextMenu && (
        <div
          className="relative h-32 top-0 left-0 bg- bg-opacity-70 flex items-center justify-center"
          onClick={() => setShowContextMenu(!showContextMenu)}
        >
          <div
            className=" relative flex flex-col py-2 bg-white w-[32] rounded-2xl border-[1px] border-cGray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-gray-600 hover:text-gray-900 hover:bg-cBlue-100 px-6">
              <button onClick={() => setShowEditForm(!showEditForm)}>
                <p>Edit</p>
              </button>
            </div>
            <div className="text-gray-600 hover:text-gray-900 hover:bg-cBlue-100 px-6">
              <button onClick={deletePost}>
                <p>Delete</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <EditForm
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          targetDoc={targetDoc}
          targetDocCol={targetDocCol}
        />
      )}
    </>
  );
}
