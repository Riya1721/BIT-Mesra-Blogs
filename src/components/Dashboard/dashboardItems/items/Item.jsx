import "./Item.css";
import { db } from "../../../../backend/firebase-config";
import { doc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Item = ({ Items: { data, id } }) => {
  const cover = data?.cover;

  const handleRemove = async () => {
    await deleteDoc(doc(db, "blogs-post", id));
    window.location.reload();
  };

  return (
    <div className="Posts">
      <img src={cover} alt="" style={{ width: "100%", height: "100%" }} />
      <div className="Bottom">
        <Link className="Update" to={`/update-post/${id}`}>
          Edit
        </Link>
        <div className="Remove" onClick={handleRemove}>
          Remove
        </div>
      </div>
    </div>
  );
};

export default Item;
