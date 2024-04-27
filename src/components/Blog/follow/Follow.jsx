import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../backend/firebase-config";

const Follow = ({ user, author }) => {
  const [followed, setFollowed] = useState(false);

  const userRef = doc(db, "user-details", user);

  const authorRef = doc(db, "user-details", author);

  const handleFollow = async () => {
    await updateDoc(userRef, {
      following: arrayUnion({ authorId: author }),
    });

    await updateDoc(authorRef, {
      follower: arrayUnion({ userId: user }),
    });
    setFollowed(true);
  };

  const checkExists = async () => {
    const data = await getDoc(userRef);
    var found = data.data().following.find((e) => e.authorId === author);
    if (found.authorId === author) {
      setFollowed(true);
    }
  };

  const handleRemoveFollowing = async () => {
    await updateDoc(userRef, {
      following: arrayRemove({ authorId: author }),
    });
    await updateDoc(authorRef, {
      follower: arrayRemove({ userId: user }),
    });
    setFollowed(false);
  };

  useEffect(() => {
    checkExists();
  });

  return (
    <div style={{ marginLeft: "0px" }}>
      {followed === true ? (
        <>
          <div
            title="unfollow"
            style={{
              height: "32px",
              width: "80px",
              marginTop: "-16px",
              borderRadius: "10px",
              border: "1px solid white",
              cursor: "pointer",
              textAlign: "center",
              lineHeight: "30px",
            }}
            onClick={handleRemoveFollowing}
          >
            following
          </div>
        </>
      ) : (
        <>
          <div
            title="follow"
            style={{
              height: "32px",
              width: "72px",
              marginTop: "-16px",
              borderRadius: "10px",
              border: "1px solid white",
              cursor: "pointer",
              textAlign: "center",
              lineHeight: "30px",
            }}
            onClick={handleFollow}
          >
            follow
          </div>
        </>
      )}
    </div>
  );
};

export default Follow;
