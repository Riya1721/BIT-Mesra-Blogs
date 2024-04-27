import "./Navbar.css";
import { GoogleAuthProvider, signInWithPopup, signOut } from "@firebase/auth";
import CollegeLogo from "../../../Images/collegelogo.png";
import { auth, db } from "../../../backend/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  setDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";

import Burger from "../../../Images/menu.png";
import { useEffect, useState } from "react";
import NavItems from "./MobileNavItems/NavItems";

const Navbar = ({ type }) => {
  const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState("");
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        userCollection(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const userCollection = async (user) => {
    const docRef = doc(db, "user-details", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.data() === undefined) {
      await setDoc(doc(db, "/user-details/" + user.uid), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        image: user.photoURL,
        follower: arrayUnion(),
        following: arrayUnion(),
        role: "user",
      });
    } else {
      return;
    }
  };

  const LogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    signOut(auth);
  };

  const [open, setOpen] = useState(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const docRef = doc(db, "user-details", user?.uid);
      const docSnap = await getDoc(docRef);
      setCurrentUser(docSnap.data());
    };
    if (user) {
      fetchCurrentUser();
    }
  }, [user?.uid, user]);
  return (
    <div className="navbar-wrapper">
      {/* Logo Section */}
      <div className="left">
        <Link to={`/`}>
          <img src={CollegeLogo} alt="Logo" className="logo" />
        </Link>
        <span>
          BIT Alumni Blogs
        </span>
      </div>

      {/* Menu  */}
      <div className="center">
        <div className="menu-wrapper">
          {user && (
            <>
              <Link
                style={{
                  textDecoration: "none",
                  color: type === "Home" ? "#0077b6" : "black",
                }}
                to={`/`}
              >
                <div
                  className="menu-item"
                  style={{
                    border: type === "Home" ? "3px solid #0077b6" : "none",
                    borderRadius: "12px",
                  }}
                >
                  <span>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/263/263115.png"
                      alt="home"
                      height="18px"
                      width="18px"
                    />
                  </span>
                  <span>Home</span>
                </div>
              </Link>

              <Link
                style={{
                  textDecoration: "none",
                  color: type === "profile" ? "#0077b6" : "black",
                }}
                to={`/profile/${user.uid}`}
              >
                <div
                  className="menu-item"
                  style={{
                    border: type === "profile" ? "3px solid #0077b6" : "none",
                    borderRadius: "12px",
                  }}
                >
                  <span>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/263/263058.png"
                      alt="home"
                      height="18px"
                      width="18px"
                    />
                  </span>
                  <span>Profile</span>
                </div>
              </Link>

              <Link
                style={{
                  textDecoration: "none",
                  color: type === "dashboard" ? "#0077b6" : "black",
                }}
                to={`/dashboard/${user.uid}`}
              >
                <div
                  className="menu-item"
                  style={{
                    border: type === "dashboard" ? "3px solid #0077b6" : "none",
                    borderRadius: "12px",
                    width: "105px",
                  }}
                >
                  <span>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/263/263082.png"
                      alt="home"
                      height="18px"
                      width="18px"
                    />
                  </span>
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link
                style={{
                  textDecoration: "none",
                  color: type === "createPost" ? "#0077b6" : "black",
                }}
                to={`/create-post/${user.uid}`}
              >
                <div
                  className="menu-item"
                  style={{
                    border:
                      type === "createPost" ? "3px solid #0077b6" : "none",
                    borderRadius: "12px",
                    width: "110px",
                  }}
                >
                  <span>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/263/263062.png"
                      alt="home"
                      height="18px"
                      width="18px"
                    />
                  </span>
                  <span>Create Post</span>
                </div>
              </Link>
            </>
          )}
          {currentUser.role === "admin" && (
            <Link
              style={{
                textDecoration: "none",
                color: type === "profile" ? "#0077b6" : "black",
              }}
              to={`/admin`}
            >
              <div
                className="menu-item"
                style={{
                  border: type === "useradmin" ? "3px solid #0077b6" : "none",
                  borderRadius: "12px",
                }}
              >
                <span>
                  <img
                    src="/assets/administration.png"
                    alt="home"
                    height="18px"
                    width="18px"
                  />
                </span>
                <span>Admin</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* login/logout section user information details */}

      <div className="right">
        {open === false ? (
          <>
            <div className="burger-icon">
              <img
                onClick={handleMenu}
                className="burger-menu"
                src={Burger}
                alt=""
              />
            </div>
          </>
        ) : (
          <>
            <div className="menu-container">
              <div className="close-btn" onClick={handleMenu}>
                X
              </div>
              {!user ? (
                <>
                  <button
                    className="SignIn-Mobile"
                    onClick={signInWithGoogle}
                    type="button"
                  >
                    <img
                      width="15px"
                      alt="GoogleLogo"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                      style={{ marginRight: "5px" }}
                    />
                    Sign In with Google
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-wrapper">
                    <div className="user-picture">
                      <div className="picture">
                        <img
                          src={user.photoURL || "/assets/user.png"}
                          alt=""
                          width="40px"
                          height="40px"
                        />
                      </div>
                      <div className="username">
                        {user.displayName.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                  {/* navigation item options */}
                  <NavItems />
                </>
              )}

              {!user ? null : (
                <div
                  style={{
                    width: "100vw",
                    padding: "30px 20px",
                    color: "white",
                  }}
                  onClick={LogOut}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png"
                    alt=""
                    width="20px"
                  />
                  Logout
                </div>
              )}
            </div>
          </>
        )}

        {!user ? (
          <>
            <button className="SignIn" onClick={signInWithGoogle} type="button">
              <img
                className="GoogleLogo"
                width="15px"
                style={{ marginRight: "5px" }}
                alt="GoogleLogo"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
              Sign In with Google
            </button>
          </>
        ) : (
          <>
            <div className="user-login-info">
              <img
                className="user-image"
                src={user.photoURL || "/assets/user.png"}
                alt={user.displayName}
                height="32px"
                width="32px"
              />
              <Link
                className="logout-btn"
                style={{
                  textDecoration: "none",
                  color: "black",
                  border: "3px solid black",
                  padding: "8px 16px",
                  borderRadius: "12px",
                }}
                onClick={LogOut}
                to={`/`}
              >
                Logout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
