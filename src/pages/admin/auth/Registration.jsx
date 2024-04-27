import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import "./Registration.css";
import { useState } from "react";
import { auth, db } from "../../../backend/firebase-config";
import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [openModule, setOpenModule] = useState(true);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [sentEmail, setSentEmail] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = () => {
    const emailRegex = /^[^\s@]+@bitmesra\.ac\.in$/i;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!emailRegex.test(email)) {
      alert(
        "Invalid email format or domain. Please use an @bitmesra.ac.in email."
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCollection(userCredential.user);
        const user = userCredential.user;

        sendEmailVerification(user)
          .then(() => {
            setSentEmail(true);
            console.log("Verification email sent");
            alert(
              "Registration successful! Check your email for verification."
            );
          })
          .catch((error) => {
            console.error("Email verification error:", error.message);
          });
      })
      .catch((error) => {
        console.error("Registration error:", error.message);
        alert("Registration failed. Please try again.");
      });

    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     if (user.emailVerified) {
    //       console.log("Email verified!");
    //     } else {
    //       console.log("Email not verified!");
    //       alert("Please verify your email before signing in.");
    //       auth.signOut();
    //     }
    //   } else {
    //     console.log("User signed out");
    //   }
    // });
  };

  const userCollection = async (user) => {
    const docRef = doc(db, "user-details", user.uid);

    const docSnap = await getDoc(docRef);

    console.log(docSnap.data());

    console.log(user.uid);

    if (docSnap.data() === undefined) {
      await setDoc(doc(db, "/user-details/" + user.uid), {
        uid: user.uid,
        username: username,
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
        {sentEmail ? (
          <>
            <div>
              Email Verification Code Has Been Send Please Verify{" "}
              <a
                onClick={() => {
                  navigate("/login");
                }}
              >
                LogIn.
              </a>
            </div>
          </>
        ) : (
          <>
            <h1>Create Account</h1>
            <br />
            <p>Please fill in this form to create an account.</p>
            <hr />

            <label for="username">
              <b>Username</b>
            </label>
            <input
              className="fields"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter Username"
              name="username"
              id="username"
              required
            />

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

            <label for="psw-repeat">
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
            />
            <hr />
            <p>
              Already have an account{" "}
              <a onClick={() => navigate("/login")}>Login</a>.
            </p>

            <button
              type="submit"
              className="registerbtn"
              onClick={handleRegistration}
            >
              Register
            </button>
          </>
        )}
      </div>
      <div className="background-image"></div>
    </div>
  );
};

export default Registration;
