import "./UpdatePost.css"
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../../Common/navbar/Navbar";
import { db } from "../../../backend/firebase-config"
import { getDoc, doc, updateDoc } from "firebase/firestore";
import JoditEditor from "jodit-react";

const UpdatePost = () => {

  const { id } = useParams()

  const [blogTitle, setBlogTitle] = useState("")
  const [blogAuthor, setBlogAuthor] = useState("")

  /*const [blogCover, setBlogCover] = useState("")*/

  const [content, setContent] = useState("")
  const [blogCat, setBlogCat] = useState("")

  /*const [blog, setBlog] = useState()*/
  const [blogDesc, setBlogDesc] = useState("")

  /*const [imgUrl, setImgUrl] = useState();*/
  const [progresspercent, setProgresspercent] = useState(0);

  const blogRef = doc(db, 'blogs-post', id);

  const loadBlog = async () => {
    const blog = await getDoc(blogRef)
    if (blog.exists()) {

      setBlogTitle(blog.data().title)
      setBlogAuthor(blog.data().author)

      setBlogCat(blog.data().category)
      setContent(blog.data().text)
      setBlogDesc(blog.data().description)
    }
    else {
      console.log("No such document")
    }
  }

  useEffect(() => {

    loadBlog();

  }, [])


  const handleUpdate = async () => {
    await updateDoc(doc(db, 'blogs-post', id), {
      title: blogTitle,
      author: blogAuthor,
      description: blogDesc,
      text: content,
      category: blogCat,
    }).then(() => {
      console.log('updated successfully')
      setPopup(true)
    }

    )
  }
  

  const handleUpload = () => { }

  const handlePopup = () => {
    setPopup(false)
  }

  const [popup, setPopup] = useState(false)

  const editor = useRef(null);

  return (
    <div>
      <Navbar type="dashboard" />
          {popup ?
            <div className="create-screen-popup" style={{marginTop: window.innerHeight/1.5}}>
              <div>post updated successfully</div>
              <button onClick={handlePopup}>Done</button>
            </div>
            :
          null}
    <div className="dash-wrapper" style={{opacity: popup ? '0.5' : '1', touchAction: popup ? 'none' : 'auto'}}>
      <form>
        <div className="input-container">
          <div className="input-title">add your title</div>
          <input type="text" value={blogTitle} className="input-primary" placeholder="" onChange={(e) => { setBlogTitle(e.target.value) }} />
        </div>
        <div className="input-container">
          <div className="input-title">add your name</div>
          <input type="text" value={blogAuthor} className="input-primary" placeholder="" onChange={(e) => { setBlogAuthor(e.target.value) }} />
        </div>
        <div className="input-container">
          <div className="input-title">write description</div>
          <textarea style={{ height: "192px", resize: "none", paddingTop: "10px" }} value={blogDesc} type="text" className="input-primary" placeholder="" onChange={(e) => { setBlogDesc(e.target.value) }} />
        </div>
        <div className="input-container">
          <div className="input-title">select category</div>
          <select type="text" className="input-primary" placeholder="" value={blogCat} onChange={(e) => { setBlogCat(e.target.value) }}>
            <option>Campus</option>
            <option>Informative</option>
            <option>Fests</option>
            <option>Extra-curricular activities</option>
            <option>Clubs and Societies</option>
            <option>Life after college</option>
          </select>
          <div>
            {
              progresspercent === 0 ? <>
                <div
                  style={{
                    width: '100%',
                    height: '20px',
                    marginBottom: "40px",
                    marginTop: "40px"
                  }}
                ></div></> :
                <div

                  style={{
                    width: '100%',
                    height: '20px',
                    backgroundColor: 'grey',
                    transition: 'ease-in-out',
                    marginBottom: "40px",
                    marginTop: "40px"
                  }}>
                  <div style={{
                    width: `${progresspercent}%`,
                    height: "inherit",
                    background: '#FFABE1',
                    marginLeft: "0%",
                    textAlign: 'center',
                    color: 'white',
                  }}>
                    {progresspercent === 100 ? "Upload Completed" : `${progresspercent}%`}
                  </div>
                </div>
            }
            <div className="button-container">
              <input type="file" />
              <div className="imageUpload-btn" onClick={handleUpload}>upload image</div>
            </div>
          </div>
        </div>
      </form>

      <form style={{ marginTop: "2rem" }}>
        <div className="input-title" style={{ width: "91.6%" }}>write article</div>
        <div style={{width:"91.6%"}}>
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1} // tabIndex of textarea
          onChange={newContent => { setContent(newContent) }}
        />
        </div>
      </form>
      <div className="postUpload-wrapper">
        <button className="postUpload-button">Clear</button>
        <button className="postUpload-button" onClick={handleUpdate}>Update</button>
      </div>
    </div>
    </div>
  );
}
export default UpdatePost;