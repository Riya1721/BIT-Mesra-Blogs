import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";
import Loading from "../../Images/Loading/Pulse.gif";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../backend/firebase-config";
import { v4 } from "uuid";
import Lable from "../../components/Common/lable/Lable";
import Navbar from "../../components/Common/navbar/Navbar";
import SavePost from "../../components/Blog/savepost/SavePost";

import "./Blog.css";

const Blog = () => {
  const [user] = useAuthState(auth);

  const [username, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "user-details", user.uid);
      const completeUserDetail = await getDoc(docRef);
      setUserName(completeUserDetail.data().username);
    };
    fetchUser();
  }, [user?.uid]);
  console.log(username);

  const { id } = useParams();

  const [url, setUrl] = useState();

  const [blogTitle, setBlogTitle] = useState("");

  const [blogAuthor, setBlogAuthor] = useState("");

  const [blogDate, setBlogDate] = useState("");

  const [blogCover, setBlogCover] = useState("");

  const [blogText, setBlogText] = useState("");

  const [blogCat, setBlogCat] = useState("");

  const [blog, setBlog] = useState();

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);

  const [authorId, setAuthorId] = useState();

  const blogRef = doc(db, "blogs-post", id);

  const loadBlog = async () => {
    const blog = await getDoc(blogRef);
    if (blog.exists()) {
      setBlog(blog.data());
      setBlogTitle(blog.data().title);
      setBlogDate(blog.data().createdAt.toDate().toDateString());
      setBlogCover(blog.data().cover);
      setBlogCat(blog.data().category);
      setBlogText(blog.data().text);
      setComments(blog.data().comments);
      setAuthorId(blog.data().uid);
      setBlogAuthor(blog.data().author || "");
    } else {
      console.log("No such document");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadBlog();
    }, 1000);

    setUrl(window.location.href);
  }, []);

  const inputRef = useRef(null);

  const handleComment = async () => {
    await updateDoc(doc(db, "blogs-post", id), {
      comments: arrayUnion({
        commentId: v4(),
        userId: user.uid,
        userPic: user.photoURL,
        userName: username,
        comment: comment,
        createdAt: Timestamp.now().toDate(),
      }),
    }).then((inputRef.current.value = ""));
  };
  useEffect(() => {
    onSnapshot(doc(db, "blogs-post", id), (doc) => {
      setComments(doc.data().comments);
    });
  }, []);

  function showHtml() {
    let body = blogText;
    return <div dangerouslySetInnerHTML={{ __html: body }}></div>;
  }

  const handleDeleteComment = async (commentId) => {
    try {
      // Update the comments array in Firebase
      await updateDoc(blogRef, {
        comments: arrayRemove(
          comments.find((comment) => comment.commentId === commentId)
        ),
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="main">
      <Navbar type="create-post" />
      <div className="blog-wrapper">
        {blog === undefined ? (
          <>
            <img
              className="Loading"
              src={Loading}
              alt="Loading..."
              height="100px"
              width="100px"
            />
          </>
        ) : (
          <>
            <div className="top-wrapper">
              <div className="content-wrapper">
                <span className="label-wrapper">
                  <Lable className="label" lable={blogCat} />
                  <div className="SavePost">
                    {user && (
                      <SavePost
                        userId={user.uid}
                        blogId={id}
                        cover={blogCover}
                        url={url}
                      />
                    )}
                  </div>
                </span>

                <span>
                  <h1
                    style={{
                      fontSize: `${
                        blogTitle?.length > 30 ? "1.5rem" : "2.5rem"
                      }`,
                      paddingBottom: "1rem",
                    }}
                  >
                    {blogTitle?.toLocaleUpperCase()}
                  </h1>
                </span>

                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <p
                    style={{
                      marginRight: "0",
                      fontSize: "0.8rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Author : {blogAuthor}
                  </p>
                  <div
                    style={{
                      width: "inherit",
                      height: "32px",
                      display: "flex",
                    }}
                  >
                    {/* {user && <Follow user={user.uid} author={authorId} />} */}
                    <p
                      style={{
                        marginRight: "0",
                        fontSize: "0.8rem",
                        opacity: "0.7",
                      }}
                      className="Date"
                    >
                      Published Date : {blogDate?.toLowerCase()}
                    </p>
                  </div>
                </span>
              </div>
            </div>
            <img
              className="Cover"
              src={blogCover}
              alt="cover"
              height={(window.innerHeight / 2) * 2}
              width={(window.innerWidth / 2) * 1.5}
            />
            <div className="blog-text">{showHtml()}</div>

            <div className="comment-wrapper">
              <h3 style={{ marginBottom: "2rem", marginLeft: "0px" }}>
                Comments
              </h3>

              {!user ? (
                <div
                  style={{
                    marginBottom: "2rem",
                    width: "100%",
                    display: "flex",
                  }}
                >
                  <Link
                    style={{
                      textDecoration: "none",
                      padding: "1rem",
                      backgroundColor: "#2192FF",
                      borderRadius: "10px",
                      cursor: "pointer",
                      color: "#FFFF",
                      textAlign: "center",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                    to={`/`}
                  >
                    Please Login To Comment{" "}
                    <img
                      height="20px"
                      width="20px"
                      src="https://cdn-icons-png.flaticon.com/512/891/891399.png"
                      alt=""
                    />
                  </Link>
                </div>
              ) : (
                <div className="comment-section">
                  <div className="create-comment">
                    <textarea
                      ref={inputRef}
                      type="text"
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />
                    <button className="comment-btn" onClick={handleComment}>
                      Send
                    </button>
                  </div>
                </div>
              )}
              <div className="comment-scroller">
                {comments?.length === 0 ? (
                  <div
                    style={{
                      fontSize: "16px",
                      marginLeft: "29%",
                      marginTop: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    No Comments Yet. Be The First To Comment 😍
                  </div>
                ) : (
                  <>
                    {comments &&
                      comments
                        .map((comments) => (
                          <div className="comments" key={comments.commentId}>
                            <div className="comment-in-wrapper">
                              <div className="comment-title">
                                <img
                                  src={comments.userPic || "/assets/user.png"}
                                  width="30px"
                                  height="30px"
                                  alt=""
                                  style={{ borderRadius: "50%" }}
                                />
                                <div
                                  style={{
                                    marginLeft: "40px",
                                    marginTop: "-27px",
                                    fontSize: "0.9rem",
                                    fontFamily: "'Nunito', sans-serif",
                                  }}
                                >
                                  {comments.userName}
                                </div>
                              </div>
                              <p className="comment-text">{comments.comment}</p>
                              <p
                                style={{
                                  marginTop: "10px",
                                  fontSize: "0.7rem",
                                }}
                                className="comment-text"
                              >
                                {comments?.createdAt?.toDate()?.toDateString()}
                              </p>
                            </div>

                            {comments.userId === user.uid && (
                              <img
                                alt="delete"
                                width={20}
                                style={{ cursor: "pointer" }}
                                height={20}
                                src="/assets/delete.png"
                                onClick={() =>
                                  handleDeleteComment(comments?.commentId)
                                }
                              />
                            )}
                          </div>
                        ))
                        .reverse()}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
