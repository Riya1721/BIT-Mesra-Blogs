import "./Dashboard.css";
import Navbar from "../../components/Common/navbar/Navbar";
import Dashboarditem from "../../components/Dashboard/dashboardItems/Dashboarditem";
import { useEffect, useState, useRef } from "react";
import { db } from "../../backend/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "react-router";
import spinner from "../../Images/Loading/Spinner.gif";

const Dashboard = () => {
  const dataFetchedRef = useRef(false);

  const [item, setItem] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const { id } = useParams();

  let temp = [];

  let arr = [];

  const getData = async () => {
    setLoading(true);

    const condition = where("uid", "==", id);

    const q = query(collection(db, "blogs-post"), condition);

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      temp.push({ data: doc.data(), id: doc.id });

      arr = temp;

      setItem([...arr]);

      console.log([...arr]);
    });
    setLoading(false);
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getData();
  }, []);

  return (
    <div>
      <Navbar type="dashboard" />
      <div className="Wrapper">
        {!isLoading && item.length > 0 && <Dashboarditem Items={item} />}

        {isLoading && (
          <img
            src={spinner}
            alt="Loading"
            height="80px"
            width="80px"
            style={{
              marginTop: "20%",
              marginLeft: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {!isLoading && item.length === 0 && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15rem",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Blogs Not Found
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
