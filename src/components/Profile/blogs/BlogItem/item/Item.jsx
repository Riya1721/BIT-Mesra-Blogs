import "./Item.css";
import { Link } from "react-router-dom";

const Item = ({Item:{data:{cover},id}}) => {

    return (  
    <div className="Posts">
    <Link to={`/blog/${id}`} style={{textDecoration:"none", width: '100%', height: '100%'}}>
    <img className="image" src={cover} alt="" style={{width: '100%', height: '100%', borderRadius: '5%'}}/>
    </Link>
    </div> );
}
 
export default Item;