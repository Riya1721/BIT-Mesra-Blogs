import "./CreatePost.css";
import Navbar from "../../../components/Common/navbar/Navbar";
import { useEffect, useRef, useState } from "react";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../../../backend/firebase-config";
import { v4 } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import JoditEditor from "jodit-react";

const CreatePost = () => {
  const [user] = useAuthState(auth);

  const [popup, setPopup] = useState(false);

  const dataCollectionRef = collection(db, "blogs-post");

  const [newTitle, setNewTitle] = useState("");
  const [newCover, setNewCover] = useState(null);
  const [content, setContent] = useState("");
  const [newCategory, setNewCategory] = useState("campus");
  const [author, setAuthor] = useState("");

  const [imgUrl, setImgUrl] = useState();
  const [progresspercent, setProgresspercent] = useState(0);
  console.log(newCategory);

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "user-details", user.uid);
      const completeUserDetail = await getDoc(docRef);
      setAuthor(completeUserDetail.data().username);
    };
    fetchUser();
  }, [user?.uid]);

  const handleUpload = async () => {
    if (newCover) {
      const storageRef = ref(storage, `CoverImages/${newCover.name + v4()}`);
      const uploadTask = uploadBytesResumable(storageRef, newCover);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent(progress);
          console.log(progress);
        },
        (error) => {
          alert(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImgUrl(downloadURL);
              console.log(downloadURL);
            })
            .catch((error) => {
              console.log("Url Download Error" + error.message);
            });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (newTitle === "" || !content) {
      alert("Title or Article Content is Empty");
    } else {
      await addDoc(dataCollectionRef, {
        title: newTitle,
        text: content,
        cover: imgUrl || "",
        category: newCategory,
        createdAt: Timestamp.now().toDate(),
        comments: [],
        uid: user.uid,
        blogId: v4(),
        views: 0,
        author,
      })
        .then(() => {
          console.log("post added successfully");
          setPopup(true);
        })
        .catch((err) => console.log(err + "an error occurred while uploading"));
    }
  };

  const handlePopup = () => {
    setPopup(false);
    window.location.reload();
  };

  const editor = useRef(null);

  return (
    <div>
      <Navbar type="createPost" />
      {popup ? (
        <div
          className="create-screen-popup"
          style={{ marginTop: window.innerHeight / 1.5 }}
        >
          <div>post uploaded successfully</div>
          <button onClick={handlePopup}>Done</button>
        </div>
      ) : null}
      <div
        className="dash-wrapper"
        style={{
          opacity: popup ? "0.5" : "1",
          touchAction: popup ? "none" : "auto",
        }}
      >
        <form className="create-post">
          <div className="form-grp">
            <div className="title">Add Title</div>
            <input
              type="text"
              className="form-item title-inp"
              placeholder=""
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
            />
          </div>

          <div className="form-grp">
            <div className="title">Select Category</div>
            <select
              className="form-item"
              type="text"
              placeholder="All"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
              }}
            >
              <option value="campus">Campus</option>
              <option value="informative">Informative</option>
              <option value="fests">Fests</option>
              <option value="extra-curricula activities">
                Extra-curricular activities
              </option>
              <option value="clubs and societies">Clubs and Societies</option>
              <option value="life after college">Life after college</option>
            </select>

            <div>
              {progresspercent === 0 ? (
                <>
                  <div
                    style={{
                      width: "100%",
                      height: "20px",
                      marginBottom: "40px",
                      marginTop: "40px",
                    }}
                  ></div>
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    backgroundColor: "grey",
                    transition: "ease-in-out",
                    marginBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <div
                    style={{
                      width: `${progresspercent}%`,
                      height: "inherit",
                      background: "#FFABE1",
                      marginLeft: "0%",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    {progresspercent === 100
                      ? "Upload Completed"
                      : `${progresspercent}%`}
                  </div>
                </div>
              )}
              <div className="button-container">
                <input
                  type="file"
                  onChange={(e) => {
                    setNewCover(e.target.files[0]);
                  }}
                />
                <div className="imageUpload-btn" onClick={handleUpload}>
                  Upload Image
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr
          style={{
            marginTop: "4rem",
            width: "60%",
            boxShadow:
              "rgba(240, 46, 170, 0.4) 0px 5px, rgba(240, 46, 170, 0.3) 0px 10px, rgba(240, 46, 170, 0.2) 0px 15px, rgba(240, 46, 170, 0.1) 0px 20px, rgba(240, 46, 170, 0.05) 0px 25px",
          }}
        />
        <form style={{ marginTop: "2rem" }}>
          <div className="input-title" style={{ width: "91.6%" }}>
            Write your views
          </div>
          <div style={{ width: "91.6%" }}>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1} // tabIndex of textarea
              onChange={(newContent) => {
                setContent(newContent);
              }}
            />
          </div>
        </form>
        <div className="postUpload-wrapper">
          <button className="postUpload-button">clear</button>
          <button className="postUpload-button" onClick={handleSubmit}>
            post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
