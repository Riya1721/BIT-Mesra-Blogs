import "./Profile.css";
import Navbar from "../../components/Common/navbar/Navbar";
import { useParams } from "react-router-dom";
import { db } from "../../backend/firebase-config";
import {
  getDoc,
  doc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Blogs from "../../components/Profile/blogs/Blogs";
import SavedPosts from "../../components/Profile/saved/SavedPosts";

const Profile = () => {
  const { id } = useParams();

  const docRef = doc(db, "user-details", id);

  const [name, setName] = useState(" ");

  const [following, setFollowing] = useState(0);

  const [follower, setFollower] = useState(0);

  const [profilePicture, setProfilePicture] = useState(" ");

  const getUserInfo = async () => {
    let followings = [];

    let followers = [];

    try {
      const user = await getDoc(docRef);

      setName(user.data().username);
      setProfilePicture(user.data().image);

      followings = user.data().following;
      setFollowing(followings.length);

      followers = user.data().follower;
      setFollower(followers.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const [activeSwitch, setActiveSwitch] = useState(true);

  const toggleSwitchLeft = () => {
    setActiveSwitch(true);
  };
  const toggleSwitchRight = () => {
    setActiveSwitch(false);
  };

  const [saveData, setSaveData] = useState([]);

  const Ref = doc(db, "user-details", id);

  const GetSavedData = async () => {
    let arr = [];

    let temp = [];

    const savedBlogPost = await getDoc(Ref);

    arr = savedBlogPost.data().savedpost;

    temp = [...arr];

    setSaveData([...temp]);
  };

  const [post, setPost] = useState([]);

  const GetUserPost = async () => {
    let arr = [];

    const condition = where("uid", "==", id);

    const q = query(collection(db, "blogs-post"), condition);

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      arr.push(doc.id);
    });

    setPost([...arr]);
  };

  useEffect(() => {
    GetSavedData();
    GetUserPost();
  }, []);

  return (
    <div>
      <Navbar type="profile" />
      <div className="Wrapper">
        <div className="ProfileWrapper">
          <div className="left-side">
            <img
              src={profilePicture || "/assets/user.png"}
              alt=""
              height="150px"
              width="150px"
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div className="right-side">
            <div className="user_name">{name}</div>
            <div className="profile-info">
              <div className="">
                <span style={{ fontWeight: "bold" }}> {post.length} </span>
                <span>post</span>
              </div>
              {/* {false && (
                <>
                  {" "}
                  <div className="">
                    <span style={{ fontWeight: "bold" }}> {follower} </span>{" "}
                    <span>followers</span>
                  </div>
                  <div className="">
                    <span style={{ fontWeight: "bold" }}> {following} </span>
                    <span>following</span>
                  </div>
                </>
              )} */}
            </div>
          </div>
        </div>
        <div className="switch-section">
          <div className="switch-box">
            <div
              className="switch-left"
              onClick={toggleSwitchLeft}
              style={{
                borderTop: activeSwitch === true ? "1.5px solid black" : "none",
                opacity: activeSwitch === true ? "1" : "0.5",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/238/238910.png"
                alt=""
                height="15px"
                width="15px"
                style={{ marginRight: "5px" }}
              />{" "}
              BLOGS
            </div>
            <div
              className="switch-right"
              onClick={toggleSwitchRight}
              style={{
                borderTop:
                  activeSwitch === false ? "1.5px solid black" : "none",
                opacity: activeSwitch === false ? "1" : "0.5",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/5668/5668020.png"
                alt=""
                height="15px"
                width="15px"
                style={{ marginRight: "5px" }}
              />{" "}
              SAVED
            </div>
          </div>
        </div>
        {activeSwitch === true ? (
          <>
            {" "}
            <Blogs id={id} />{" "}
          </>
        ) : null}
        {activeSwitch === false ? (
          <>
            {" "}
            <SavedPosts data={saveData} />{" "}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
