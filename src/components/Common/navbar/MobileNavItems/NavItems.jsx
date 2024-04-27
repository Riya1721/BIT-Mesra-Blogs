import "./NavItems.css";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../backend/firebase-config";

const NavItems = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="menu-list">
      <div className="nav-item-conatiner">
        <div className="nav-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/512/619/619153.png"
            alt=""
            width="30px"
          />
        </div>
        <Link to={`/`} className="nav-title">
          Home
        </Link>
      </div>
      <div className="nav-item-conatiner">
        <div className="nav-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3201/3201671.png"
            alt=""
            width="30px"
          />
        </div>
        <Link to={`/profile/${user.uid}`} className="nav-title">
          Profile
        </Link>
      </div>
      <div className="nav-item-conatiner">
        <div className="nav-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2930/2930685.png"
            alt=""
            width="30px"
          />
        </div>
        <Link to={`/dashboard/${user.uid}`} className="nav-title">
          Dashboard
        </Link>
      </div>
      <div className="nav-item-conatiner">
        <div className="nav-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/128/8103/8103784.png"
            alt=""
            width="30px"
          />
        </div>
        <Link to={`/create-post/${user.uid}`} className="nav-title">
          Create Post
        </Link>
      </div>
    </div>
  );
};

export default NavItems;
