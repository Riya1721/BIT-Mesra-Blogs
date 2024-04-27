import "./Blogs.css"
import {useEffect, useState, useRef} from "react"
import {db} from "../../../backend/firebase-config"
import { collection, query, where, getDocs } from "firebase/firestore"
import BlogItem from "./BlogItem/BlogItem"
import spinner from "../../../Images/Loading/Spinner.gif"

const Blogs = ({id}) => {

    const dataFetchedRef = useRef(false)

    let temp = []

    let arr = []

    const [items, setItems] = useState([])

    const [isLoading, setLoading] = useState(false) 

    const getData = async () => {

        setLoading(true);

        const condition = where("uid", "==", id)

        const q = query(collection(db, "blogs-post"), condition)

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {

            temp.push({data:doc.data(), id: doc.id})   

            arr = temp

            setItems([...arr])

            })

        setLoading(false)
    }
    
    useEffect(() => {
        if(dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        getData()
    },[])

    return (
    <div className="blog-wrapper">

        {!isLoading && items.length > 0 && <BlogItem items={items} />}

        {isLoading  && <img src={spinner} alt="Loading..." height="80px" width="80px" style={{marginTop: "5rem"}} />}

        {!isLoading && items.length === 0 && <p style={{marginTop:"10rem", fontWeight:"bold", fontSize:'1.5rem'}}>Blogs Not Found</p>}
       
    </div> 
    );
}

export default Blogs;