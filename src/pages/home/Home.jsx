import BlogList from "../../components/Home/bloglist/BlogList";
import Header from "../../components/Home/header/Header";
import SearchBar from "../../components/Home/searchbar/SearchBar";
import Navbar from "../../components/Common/navbar/Navbar";
import { useState, useEffect } from "react";
import { auth, db } from "../../backend/firebase-config";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import spinner from "../../Images/Loading/Spinner.gif";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [blogPost, setBlogPost] = useState([]);

  const [searchKey, setSearchKey] = useState("");

  const blogPostCollectionRef = collection(db, "blogs-post");

  const getBlogPost = async () => {
    const data = await getDocs(blogPostCollectionRef);
    setBlogPost(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getBlogPost();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const blogsInstance = await getDocs(blogPostCollectionRef);
    const blogs = blogsInstance.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    if (!searchKey) {
      setBlogPost(blogs);
      return;
    }
    const filteredBlogs = blogs.filter((blog) =>
      blog?.title
        ?.trim()
        ?.toLowerCase()
        .includes(searchKey?.trim()?.toLowerCase())
    );
    setBlogPost(filteredBlogs);
  };

  const Loader = () => {
    <></>;
  };

  setTimeout(() => {
    Loader();
  }, 1000);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        navigate("/login");
      } else {
        // User is logged in, fetch blog posts
        getBlogPost();
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div style={{ position: "relative" }}>
      {/* Navbar  */}

      <Navbar type="Home" />

      {/*page header*/}
      <div className="home-bg">
        <Header />

        {/*search bar*/}

        <SearchBar
          value={searchKey}
          formSubmit={handleSearchSubmit}
          handleSearchKey={(e) => setSearchKey(e.target.value)}
        />

        {/*empty list*/}

        {blogPost.length === 0 ? (
          <>
            <p
              style={{
                textAlign: "center",
                marginTop: "15rem",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              No Blogs Found At The Moment
            </p>
          </>
        ) : (
          <BlogList blogs={blogPost} />
        )}
      </div>
    </div>
  );
};
export default Home;
