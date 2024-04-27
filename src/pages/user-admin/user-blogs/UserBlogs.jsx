import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Common/navbar/Navbar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../backend/firebase-config";
import Dashboarditem from "../../../components/Dashboard/dashboardItems/Dashboarditem";
import BlogList from "../../../components/Home/bloglist/BlogList";
import spinner from "../../../Images/Loading/Spinner.gif";
import ReactHeatMap from "../../../components/reactHeatmap/ReactHeatMap";
const UserBlogs = () => {
  const { id } = useParams();
  const [userBlogs, setUserBlogs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUserBlogs = async () => {
      setIsLoading(true);
      const condition = where("uid", "==", id);
      const userBlogsInstance = query(collection(db, "blogs-post"), condition);
      const blogs = await getDocs(userBlogsInstance);
      setUserBlogs(blogs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(false);
    };
    fetchUserBlogs();
  }, [id]);

  console.log(userBlogs);

  return (
    <div>
      <Navbar />
      {isLoading && (
        <img
          src={spinner}
          alt="Loading"
          height="80px"
          width="80px"
          style={{
            marginTop: "20%",
            marginLeft: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {!isLoading && userBlogs?.length >= 1 && (
        <div className="list">
          <BlogList type={true} blogs={userBlogs} />
          <div className="heatmap">
            <ReactHeatMap blogs={userBlogs} />
          </div>
        </div>
      )}
      {!isLoading && userBlogs.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "15rem",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          No Blogs Found For The User
        </p>
      )}
    </div>
  );
};

export default UserBlogs;
