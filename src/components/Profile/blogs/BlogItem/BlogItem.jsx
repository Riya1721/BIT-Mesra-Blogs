import "./BlogItem.css"
import Item from './item/Item'

const BlogItem = ({items}) =>{ 

    console.log(items)
        
    return(
        <div className="PostWrapper">
            {items.map((item)=>(
                <Item Item={item}
                key={item.id}
                 />
            ))}
        </div>
    );}
 
export default BlogItem;