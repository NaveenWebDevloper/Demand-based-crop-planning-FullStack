import "./Client.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Client = () => {
  const [client, setClient] = useState({});
  const [jobs, setJobs] = useState([]);

  const [showDetails, setShowDetails] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Load client profile details
  const loadClientDetails = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/freelancer/details/?username=${username}`
    );
    setClient(res.data.freelancer || {});
  };

  // Load jobs posted by client
  const loadClientJobs = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/admin/jobs/");
    const mine = res.data.jobs.filter((job) => job.client_name === username);
    setJobs(mine);
  };

  useEffect(() => {
    loadClientDetails();
    loadClientJobs();
  }, [username]);

  const openPostJob = () => navigate("/postnewjob");
  const openManageJobs = () => navigate("/managejob");

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Freelance Marketplace</h1>
        </div>

        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>Client Page</h2>

        {/* ---------------- CARDS SECTION ---------------- */}
        <div id="event-catogeries">

          {/* Client Details Card */}
          <div className="card-box">
            <h3 id="catogeries-head">Client Details</h3>
            <p id="random-words">View your personal profile information.</p>
            <button
              className="catogeries-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "View"}
            </button>
          </div>

          {/* My Jobs Card */}
          <div className="card-box">
            <h3 id="catogeries-head">My Posted Jobs</h3>
            <p id="random-words">View all jobs you have posted.</p>
            <button
              className="catogeries-btn2"
              onClick={() => setShowJobs(!showJobs)}
            >
              {showJobs ? "Hide" : "View"}
            </button>
          </div>

          {/* Post Job Card */}
          <div className="card-box">
            <h3 id="catogeries-head">Post New Job</h3>
            <p id="random-words">Add a new job listing to hire freelancers.</p>
            <button className="catogeries-btn" onClick={openPostJob}>
              Post Job
            </button>
          </div>

          {/* Manage Jobs Card */}
          <div className="card-box">
            <h3 id="catogeries-head">Manage Jobs</h3>
            <p id="random-words">Edit or remove your job postings.</p>
            <button className="catogeries-btn4" onClick={openManageJobs}>
              Manage
            </button>
          </div>
        </div>

        {/* ---------------- DETAILS TABLE ---------------- */}
        {showDetails && (<>
       
          <h3 className="tab-h3">My Details</h3>
          <table id="admin-table" border="1">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{client.username}</td>
                <td>{client.email}</td>
                <td>{client.mobile}</td>
                <td>{client.approved}</td>
              </tr>
            </tbody>
          </table>
        </> )}

        {/* ---------------- JOBS TABLE ---------------- */}
        {showJobs && (
          <>
            <h3 className="tab-h3">My Posted Jobs</h3>
            <table id="admin-table" border="1">
              <thead>
                <tr>
                 
                  <th>Title</th>
                  <th>Description</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job, index) => (
                  <tr key={index}>
                  
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>{job.budget}</td>
                    <td>{job.status}</td>
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

export default Client;
