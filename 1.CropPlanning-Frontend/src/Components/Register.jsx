import "./Register.css"
import axios from "axios"
import { useState } from "react"

const Register=()=>{
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

    const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    mobile: "",
    address: "",
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://127.0.0.1:8000/api/register/",
      form
    );
     if(res.data.error){
  setMsgType("error");
  setMessage(res.data.error);
    }else{
      setMsgType("success");
      setMessage(res.data.success);
    }

    
  };

    return(<>
      <main>
        <h2>Register</h2>
      {message && (
        <p className={`msg ${msgType}`}>
          {message}
        </p>
      )}

     <form onSubmit={handleSubmit}>
         <div>
            <label><span>Name:</span></label>
            <input type="text" name="username" onChange={handleChange} placeholder="Enter User Name" required autoFocus/>
        </div>

        <div>
            <label><span>Email:</span></label>
            <input type="email" name="email" onChange={handleChange} placeholder="Enter Email" required/>
        </div>

        <div>
            <label><span>Password:</span></label>
            <input type="password" name="password" onChange={handleChange} placeholder="Enter Password" required/>
        </div>

        <div>
            <label><span>Confirm Password:</span></label>
            <input type="password" name="confirm_password" onChange={handleChange} placeholder="Re-enter password" required/>
        </div>

        <div>
            <label><span>Mobile Number:</span></label>
            <input type="number" name="mobile" onChange={handleChange} placeholder="Enter mobile number" required/>
        </div>
        <div>
            <label><span>Address:</span></label>
            <textarea name="address" onChange={handleChange} rows="2" cols="30" placeholder="Enter full address" required></textarea>
        </div>

        <button type="submit" id="btn-sub">Submit</button>

    </form>
      </main>
      
       <footer>
             <h4>&copy; 2025 All Rights Reserved SAK Informatics</h4>
        </footer>
    </>)
}
export default Register