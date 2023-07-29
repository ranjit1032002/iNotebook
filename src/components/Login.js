import React ,{useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Login = (props) => {

  const [credentials, setCredentials] = useState({email:"", password:""});
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:credentials.email, password:credentials.password }), 
    });
    const json = await response.json();
    console.log(json);
    if (json.success = true) {
      // Save the auth token and Redirect 
      localStorage.setItem('token', json.authToken);
      props.showAlert("Account LoggedIn Successfully","success");
      navigate("/");
    }
    else {
      props.showAlert("Invalid Credentials","danger")
    }
    setCredentials({name:"", email:"", password:""});
  }

  const onChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }
  return (
  <>
    <div className="d-flex vh-98 align-items-center justify-content-center border-2 ">
      <form className="border border-light-subtle shadow-lg p-3 mb-5 bg-body rounded" onSubmit={handleSubmit}>
        <div className="mb-3 mx-5 my-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange}/>
        </div>
        <div className="mb-3 mx-5 my-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary mx-5 my-3" >Submit</button>
      </form>
    </div>
  </>
  )
}

export default Login
