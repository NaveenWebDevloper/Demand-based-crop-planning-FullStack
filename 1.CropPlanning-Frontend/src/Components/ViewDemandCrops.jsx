import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ViewDemandCrops = () => {
  const [demandData, setDemandData] = useState([]);

  // Load market demand data
  const loadDemand = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/market-demand/"
      );
      setDemandData(res.data.demand || []);
    } catch (err) {
      console.log("Error loading demand data");
    }
  };

  useEffect(() => {
    loadDemand();
  }, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Demand-Based Crop Planning System</h1>
        </div>

        <div className="components">
          <NavLink to="/user">Back</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2 style={{ textAlign: "center", marginTop: "1rem" }}>
          Market Demand – Crops
        </h2>

        <table border="1" id="admin-table">
          <thead>
            <tr>
              <th>Crop Name</th>
              <th>Region</th>
              <th>Season</th>
              <th>Demand (Tons)</th>
              <th>Price / Quintal</th>
            </tr>
          </thead>

          <tbody>
            {demandData.length === 0 ? (
              <tr>
                <td colSpan="5">No demand data available</td>
              </tr>
            ) : (
              demandData.map((d, index) => (
                <tr key={index}>
                  <td>{d.crop}</td>
                  <td>{d.region}</td>
                  <td>{d.season}</td>
                  <td>{d.quantity}</td>
                  <td>₹ {d.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>

      <footer>
        <h4>© 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default ViewDemandCrops;
