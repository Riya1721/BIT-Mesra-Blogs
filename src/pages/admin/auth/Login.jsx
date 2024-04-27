import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import { useState } from "react";
import { auth, db } from "../../../backend/firebase-config";
import Logo from "../../../Images/collegelogo.png";
import { useNavigate } from "react-router-dom";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCollection(userCredential.user);
        const user = userCredential.user;

        if (user.emailVerified) {
          console.log("Login successful!");
          navigate("/");
        } else {
          alert("Email not verified! Please verify your email.");
          console.log("Email not verified! Please verify your email.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        alert("Login failed. Please check your email and password.");
      });
  };

  const userCollection = async (user) => {
    const docRef = doc(db, "user-details", user.uid);

    const docSnap = await getDoc(docRef);

    console.log(docSnap.data());

    console.log(user.uid);

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

  return (
    <div className="wrapper">
      <div className="form-container">
        <div
          style={{
            width: "100",
            display: "flex",
          }}
        >
          <div>
            <img src={Logo} alt="clogo" className="collegeLogo" />
            <h1>Login</h1>
          </div>
        </div>
        <br />

        <label for="email">
          <b>Email</b>
        </label>
        <input
          className="fields"
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          required
        />

        <label for="psw">
          <b>Password</b>
        </label>
        <input
          className="fields"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter Password"
          name="psw"
          id="psw"
          required
        />

        {/* <label for="psw-repeat">
          <b>Repeat Password</b>
        </label>
        <input
          className="fields"
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Repeat Password"
          name="psw-repeat"
          id="psw-repeat"
          required
        /> */}
        <hr />
        <p>
          Don't have an account{" "}
          <a
            onClick={() => {
              navigate("/registration");
            }}
          >
            Register
          </a>
          .
        </p>

        <button type="submit" className="registerbtn" onClick={handleLogin}>
          Login
        </button>
      </div>
      <div className="background-image"></div>
    </div>
  );
};

export default Login;
