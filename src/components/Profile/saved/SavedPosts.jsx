import "./SavedPosts.css"

import SavedItem from "./saveditem/SavedItem"


const SavedPosts = ({data}) => {

    console.log(data)

    return ( 
        <div className="PostWrapper">
            {data.map((item) => (
                <SavedItem Item={item} 
                key={item.blogId}/>
            ))}
        </div>
     );
}
 
export default SavedPosts;