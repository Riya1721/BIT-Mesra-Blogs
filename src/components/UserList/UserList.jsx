import React, { useEffect, useState } from "react";
import "./user-list.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Home/searchbar/SearchBar";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../backend/firebase-config";
const UserList = ({ userList }) => {
  const [searchUserName, setSearchUserName] = useState("");
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (userList) {
      setUsers(userList);
    }
  }, [userList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchUserName) {
      return setUsers(userList);
    }
    console.log(searchUserName.trim().toLowerCase());
    const filteredUsers = userList?.filter((user) =>
      user.username
        .trim()
        .toLowerCase()
        .includes(searchUserName.trim().toLowerCase())
    );
    console.log(filteredUsers);
    setUsers(filteredUsers);
  };

  const handleDeleteUser = async (userId) => {
    // Delete user's document from "user-details" collection
    await deleteDoc(doc(db, "user-details", userId));

    // Delete all blog posts by this user
    await deleteBlogPostsByUser(userId);

    // Update the local state to remove the deleted user
    setUsers((prev) => prev.filter((user) => user.uid !== userId));
  };

  const deleteBlogPostsByUser = async (userId) => {
    try {
      // Query blog posts by user ID
      const querySnapshot = await getDocs(
        query(collection(db, "blogs-post"), where("uid", "==", userId))
      );

      // Delete each blog post
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(`All blog posts by user ${userId} deleted.`);
    } catch (error) {
      console.error("Error deleting blog posts:", error);
    }
  };

  return (
    <div className="user-container">
      {users?.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "15rem",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          No Users Found
        </p>
      )}
      <h2>Users </h2>
      <SearchBar
        value={searchUserName}
        handleSearchKey={(e) => setSearchUserName(e.target.value)}
        formSubmit={handleSubmit}
      />
      <div className="userlist">
        {users &&
          users.map((user) => (
            <div className="single-user" key={user.uid}>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.role}</div>
              <div className="action">
                <button
                  className="view"
                  onClick={() => navigate(`/admin/user-blogs/${user.uid}`)}
                >
                  View
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteUser(user.uid)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserList;
