import { useEffect,useState } from "react"

import  Jwt  from "jsonwebtoken"

import axios from "axios"

import {showSuccessMessage,showErrorMessage} from '../../../../helpers/alert'



import { useRouter } from "next/router"



const Reset = ()=>{

    const Router = useRouter()


    const [state,setState] = useState({

        name:'',
        token: '',
        newPassword:'',
        buttonText:'Reset Password',
        success:'',
        error:''

    })


    const {name,token,newPassword,buttonText,success,error} = state


    useEffect(()=>{

        const decoded = Jwt.decode(Router.query.reset)

        if(decoded){

            setState({...state, name: decoded.name, token: Router.query.reset})

        }

    },[Router])


    const handleChange = (e) =>{

        setState({...state, newPassword: e.target.value, success:"", error: ""})

    }


    const handleSubmit = async (e) => {


        e.preventDefault();

        setState({...state, buttonText: 'Reseting Password'})

        try{

            const response = await axios.put(`http://localhost:8080/api/reset-password`,{resetPasswordLink:token, newPassword})

            console.log('response from forgotpassword:', response);

            setState({...state, success: response.data.message , buttonText:'Password Changed!', newPassword:'',error})

        }catch(error){

            console.log('reset password error',error);

            setState({

                ...state,
                 error: error.response.data.error,
                 buttonText: "Reset Password",
                 success:''
             })

        }


    }


    const resetPasswordForm = () => (

        <form onSubmit={handleSubmit}>


<div className="mb-3 col-md-6 offset-md-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Change Password
        </label>
        <input
          value={newPassword}
          onChange={handleChange}
          type="password"
          className="form-control"
          autoComplete="new-password"
          placeholder="*******"
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
 
            <h2 className="text-center mb-4">Hi {name}, Ready to Reset Password?y</h2>

            {success && showSuccessMessage(success)}

            {error && showErrorMessage(error)}

            {resetPasswordForm()}

            
        </div>
    )


}


export default Reset

