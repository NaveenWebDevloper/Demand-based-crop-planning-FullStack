import "./Admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [marketData, setMarketData] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showViewData, setShowViewData] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [demand, setDemand] = useState({
    crop: "",
    region: "",
    season: "",
    quantity: "",
    price: "",
  });

  // -------- LOAD USERS --------
  const loadUsers = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/admin/user/");
    setUsers(res.data.users || []);
  };

  // -------- LOAD MARKET DATA --------
  const loadMarketDemand = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/market-demand/"
    );
    setMarketData(res.data.demand || []);
  };

  useEffect(() => {
    loadUsers();
    loadMarketDemand();
  }, []);

  // -------- APPROVE USER --------
  const approveUser = async (username) => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/approve/",
      { username }
    );
    alert(res.data.success);
    loadUsers();
  };

  // -------- ADD / UPDATE MARKET DEMAND --------
  const addMarketDemand = async (e) => {
    e.preventDefault();

    if (
      !demand.crop ||
      !demand.region ||
      !demand.season ||
      !demand.quantity ||
      !demand.price
    ) {
      alert("All fields required");
      return;
    }

    if (isEditing) {
      await axios.post(
        "http://127.0.0.1:8000/api/update-market-demand/",
        { ...demand, id: editId }
      );
      alert("Demand updated");
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/add-market-demand/",
        demand
      );
      alert("Demand added");
    }

    setDemand({
      crop: "",
      region: "",
      season: "",
      quantity: "",
      price: "",
    });

    setIsEditing(false);
    setEditId(null);
    loadMarketDemand();
  };

  // -------- EDIT DEMAND --------
  const handleEdit = (m) => {
    setDemand({
      crop: m.crop,
      region: m.region,
      season: m.season,
      quantity: m.quantity,
      price: m.price,
    });
    setEditId(m.id);
    setIsEditing(true);
    setShowMarket(true);
    setShowViewData(false);
  };

  return (
    <>
      <header>
        <h1>Demand-Based Crop Planning System</h1>

        <div className="components">
          <button onClick={() => {
            setShowUsers(!showUsers);
            setShowMarket(false);
            setShowViewData(false);
          }}>
            {showUsers ? "Hide Farmers" : "Farmer Approvals"}
          </button>

          <button onClick={() => {
            setShowMarket(!showMarket);
            setShowUsers(false);
            setShowViewData(false);
          }}>
            {showMarket ? "Hide Market Data" : "Market Demand"}
          </button>

          {/* ✅ NEW BUTTON */}
          <button onClick={() => {
            setShowViewData(!showViewData);
            setShowMarket(false);
            setShowUsers(false);
          }}>
            View Data
          </button>

          <NavLink id="adlog" to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        {/* -------- FARMER APPROVALS -------- */}
        {showUsers && (
          <>
            <h2>Farmer Registrations</h2>
            <table border="1" id="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Approved</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.mobile}</td>
                    <td>{u.approved}</td>
                    <td>
                      {u.approved === 0 ? (
                        <button onClick={() => approveUser(u.username)}>
                          Approve
                        </button>
                      ) : "Approved"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* -------- ADD / EDIT MARKET DEMAND -------- */}
        {showMarket && (
          <>
            <h2>{isEditing ? "Edit Market Demand" : "Add Market Demand"}</h2>
            <div id="admin-form12">
            <form
              onSubmit={addMarketDemand}
            >
              <input
                type="text"
                placeholder="Crop Name"
                value={demand.crop}
                onChange={(e) =>
                  setDemand({ ...demand, crop: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Region"
                value={demand.region}
                onChange={(e) =>
                  setDemand({ ...demand, region: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Season"
                value={demand.season}
                onChange={(e) =>
                  setDemand({ ...demand, season: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Demand Quantity (Tons)"
                value={demand.quantity}
                onChange={(e) =>
                  setDemand({ ...demand, quantity: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price per Quintal"
                value={demand.price}
                onChange={(e) =>
                  setDemand({ ...demand, price: e.target.value })
                }
              /><br/>

              <button type="submit">
                {isEditing ? "Update Demand" : "Add Demand"}
              </button>
            </form>
            </div>
          </>
        )}

        {/* -------- VIEW DATA (TABLE + EDIT BUTTON) -------- */}
        {showViewData && (
          <>
            <h2>Market Demand Data</h2>
            <table border="1" id="admin-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Region</th>
                  <th>Season</th>
                  <th>Demand</th>
                  <th>Price</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((m, i) => (
                  <tr key={i}>
                    <td>{m.crop}</td>
                    <td>{m.region}</td>
                    <td>{m.season}</td>
                    <td>{m.quantity}</td>
                    <td>{m.price}</td>
                    <td>
                      <button onClick={() => handleEdit(m)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>

      <footer>
        <h4>© 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default Admin;
