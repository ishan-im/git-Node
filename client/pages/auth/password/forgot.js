import { useEffect,useState } from "react"


import axios from "axios"

import {showSuccessMessage,showErrorMessage} from '../../../helpers/alert'




const ForgotPassword = ()=>{


    const [state,setState] = useState({

        email:'',
        buttonText:'Forgot Password',
        success:'',
        error:''

    })


    const {email,buttonText,success,error} = state

    const handleChange = (e) =>{

        setState({...state, email: e.target.value, success:"", error: ""})

    }


    const handleSubmit = async (e) => {


        e.preventDefault();


        try{

            const response = await axios.put(`http://localhost:8080/api/forgot-password`,{email})

            console.log('response from forgotpassword:', response);

            setState({...state, success: response.data.message , buttonText:'Check Email'})

        }catch(error){

            console.log('forgot password error',error);

            setState({

                ...state,
                 error: error.response.data.error,
                 buttonText: "Forgot Password"
        
             })

        }


    }


    const forgotPasswordForm = () => (

        <form onSubmit={handleSubmit}>


<div className="mb-3 col-md-6 offset-md-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Enter Your Email
        </label>
        <input
          value={email}
          onChange={handleChange}
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
          required
        />
      </div>

      <div className="mb-3 col-md-6 offset-md-3 form-group">
        <button type="submit" className="btn btn-outline-warning btn-sm">
          {buttonText}
        </button>
      </div>

        </form>

    )



    return (

        <div className="container p-5">
 
            <h2 className="text-center mb-4">Forgot Password</h2>

            {success && showSuccessMessage(success)}

            {error && showErrorMessage(error)}

            {forgotPasswordForm()}

            
        </div>
    )


}


export default ForgotPassword

