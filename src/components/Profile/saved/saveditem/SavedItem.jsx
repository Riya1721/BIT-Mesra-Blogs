import "./SavedItem.css"

const SavedItem = ({Item:{cover,url}}) => {

    return ( 
    <div className="Posts">
        <a href={url} style={{width:"100%" , height:"100%",  borderRadius: "5%"}}>
        <img className="image" src={cover} alt="" style={{width: '100%', height: '100%', borderRadius: "5%" }}/>
        </a>
    </div>
        
     );
}
 
export default SavedItem;