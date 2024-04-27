import "./BlogItem.css";
import Lable from "../../../Common/lable/Lable";
import { Link } from "react-router-dom";
import { db } from "../../../../backend/firebase-config";
import { updateDoc, doc, increment, deleteDoc } from "firebase/firestore";
import view from "../../../../Images/view.png";

const BlogItem = ({
  type,
  blog: { id, title, description, author, category, cover, createdAt, views },
}) => {
  const handleView = async () => {
    await updateDoc(doc(db, "blogs-post", id), {
      views: increment(1),
    }).catch((err) => console.log(err));
  };

  const handleDeleteBlog = async () => {
    await deleteDoc(doc(db, "blogs-post", id));
    window.location.reload();
  };

  return (
    <div className="blogItem-wrap">
      <img src={cover} className="cover-img" alt="cover" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Lable lable={category} />
        <div
          style={{
            marginRight: "2%",
            display: "flex",
            alignItems: "center",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          {" "}
          {!views ? "no views" : views}{" "}
          <img
            src={view}
            alt="views"
            style={{ width: "16px", height: "16px", marginLeft: "5px" }}
          />
        </div>
      </div>
      <h3>{title}</h3>
      <h6>{description}</h6>
      <footer>
        <div className="author-details">
          <h5 className="author-name">Author: {author}</h5>
          <p className="timestamp">{createdAt?.toDate()?.toDateString()}</p>
        </div>
        <Link onClick={handleView} className="Link" to={`/blog/${id}`}>
          Start Reading
        </Link>
      </footer>
      {type && (
        <div className="w-full">
          {" "}
          <img
            src="/assets/delete.png"
            className="blog_del_img"
            width={20}
            height={20}
            alt=""
            onClick={handleDeleteBlog}
          />
        </div>
      )}
    </div>
  );
};

export default BlogItem;
