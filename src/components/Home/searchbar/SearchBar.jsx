import "./SearchBar.css";

const SearchBar = ({value, handleSearchKey, formSubmit}) => {
    return ( 
        <div className="searchBar-wrap">
            <form onSubmit={formSubmit}>
                <input
                type="text"
                placeholder="Search"
                value={value}
                onChange={handleSearchKey}
                />
                <button>Go</button>
            </form>
        </div>
     );
}
 
export default SearchBar;