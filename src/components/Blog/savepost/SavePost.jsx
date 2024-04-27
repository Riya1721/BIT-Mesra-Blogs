import "./SavePost.css";
import Save from "../../../Images/save.png";
import Saved from "../../../Images/saved.png";
import { db } from "../../../backend/firebase-config";
import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const SavePost = ({ userId, blogId, url, cover }) => {
  const [saved, setSaved] = useState(false);

  const SaveRef = doc(db, "user-details", userId);

  const handleSave = async () => {
    await updateDoc(SaveRef, {
      savedpost: arrayUnion({
        blogId: blogId,
        url: url,
        cover: cover,
      }),
    });
    setSaved(true);
  };

  const handleRemoveSave = async () => {
    await updateDoc(SaveRef, {
      savedpost: arrayRemove({
        blogId: blogId,
        url: url,
        cover: cover,
      }),
    });
    setSaved(false);
  };

  const checkExists = async () => {
    const data = await getDoc(SaveRef);
    var found = data.data().savedpost.find((e) => e.blogId === blogId);
    if (found.blogId === blogId) {
      setSaved(true);
    }
  };

  useEffect(() => {
    checkExists();
  }, []);

  return (
    <div>
      {saved === true ? (
        <>
          <img
            title="Remove"
            src={Saved}
            alt="saved"
            className="save-btn"
            onClick={handleRemoveSave}
          />
        </>
      ) : (
        <>
          <img
            title="Save"
            src={Save}
            alt="save"
            className="save-btn"
            onClick={handleSave}
          />
        </>
      )}
    </div>
  );
};

export default SavePost;
