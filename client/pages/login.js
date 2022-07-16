import { Fragment, useState , useEffect} from "react"

import axios from 'axios'




import Router from "next/router"

import { showErrorMessage, showSuccessMessage } from '../helpers/alert' 

import { authenticate, isAuth } from "../helpers/auth"

// import dynamic from 'next/dynamic'




const Login =  ()=>{

  const [state, setState] = useState({
    
    email: "ishanmondal713127@gmail.com",
    password: "12345678",
    error: "",
    buttonText: "Log In",
    success: ""

  });

  useEffect(()=>{

      isAuth() && Router.push('/')

  },[])

  const { name, email, password, error, buttonText, success } = state;

  const handleChange = (name) => (e) => {

    setState({

      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Log In"

    });
  };

  const handleSubmit = async (e) =>{

    e.preventDefault();

    setState({

      ...state,
      buttonText: 'Logging In'

    })

    try{

      const response = await axios.post(`http://localhost:8080/api/login`,{

        
        email:email,
        password:password


      })

     

      console.log(response);

      authenticate(response, ()=>(isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user')))


    }
    
    catch(error){

      setState({

        ...state,
         error: error.response.data.error,
         buttonText: "Log In"

     })

    }

  }




  const LogInForm = () => (

    <form  onSubmit={handleSubmit}>
     

      <div className="mb-3 col-md-6 offset-md-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Enter Your Email
        </label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          required
        />
      </div>

      <div className="mb-3 col-md-6 offset-md-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Password
        </label>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          autoComplete="new-password"
          placeholder="*******"
          required
        />
      </div>

      <div className="mb-3 col-md-6 offset-md-3 form-group">
        <button type="submit" className="btn btn-outline-primary btn-sm">
          {buttonText}
        </button>
      </div>
    </form>
    
  );

  return (
      <Fragment>
        <div className="container p-5">

          <h1 style={{"display": "flex", "justifyContent": "center"}}>Log In</h1>
            
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {LogInForm()}
          </div>
      </Fragment>)
};
    

export default Login