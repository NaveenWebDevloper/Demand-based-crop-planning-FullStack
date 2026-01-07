import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const loadUser = async () => {
    const username = localStorage.getItem("username");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/userdetails/?username=${username}`
    );

    setUser(res.data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Navigation
  const openDemandCrops = () => navigate("/view-demand");

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Demand-Based Crop Planning System</h1>
        </div>

        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>User Dashboard</h2>

        {/* ---------- CARD SECTION ---------- */}
        <div id="event-catogeries">

          {/* User Details Card */}
          <div className="card-box">
            <h3 id="catogeries-head">User Details</h3>
            <p id="random-words">View your personal and farm information.</p>
            <button
              className="catogeries-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "View Details"}
            </button>
          </div>

          {/* View Demand Crops Card */}
          <div className="card-box">
            <h3 id="catogeries-head">View Demand Crops</h3>
            <p id="random-words">
              Check real-time market demand and crop price data.
            </p>
            <button className="catogeries-btn" onClick={openDemandCrops}>
              View Demand
            </button>
          </div>

        </div>

        {/* ---------- DETAILS TABLE ---------- */}
        {showDetails && user && (
          <table border="1" id="admin-table">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{user.username}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>

              <tr>
                <th>Mobile</th>
                <td>{user.mobile}</td>
              </tr>

              <tr>
                <th>Address</th>
                <td>{user.address}</td>
              </tr>
            </tbody>
          </table>
        )}
      </main>

      <footer>
        <h4>© 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default User;
