import BlogItem from "./blogItems/BlogItem";
import "./BlogList.css";

const BlogList = ({ blogs, type }) => {
  console.log(blogs);
  return (
    <div className="blogList-wrap">
      {blogs?.map((blog) => (
        <BlogItem type={type} blog={blog} key={blog.id} />
      ))}
    </div>
  );
};

export default BlogList;
