import React, { useEffect, useState } from "react";
import "./user-admin.css";
import Navbar from "../../components/Common/navbar/Navbar";
import { collection, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../../backend/firebase-config";
import UserList from "../../components/UserList/UserList";
import { useAuthState } from "react-firebase-hooks/auth";

const UserAdmin = () => {
  const [users, setUsers] = useState("");
  const [user] = useAuthState(auth);

  const loggedInUserId = user?.uid;
  useEffect(() => {
    const userInstance = collection(db, "user-details");
    const fetchUsers = async () => {
      const dbUsers = await getDocs(userInstance);
      const filteredUsers = dbUsers.docs
        .map((doc) => ({ ...doc.data() }))
        .filter((user) => user?.uid !== loggedInUserId);

      setUsers(filteredUsers);
    };
    fetchUsers();
  }, [loggedInUserId]);
  return (
    <div>
      <Navbar type={"useradmin"} />
      <UserList userList={users} />
    </div>
  );
};

export default UserAdmin;
