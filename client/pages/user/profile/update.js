import { Fragment, useState , useEffect} from "react"

import axios from 'axios'

import Router from "next/router";

import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert' 



import {getCookie, isAuth , updateUser} from "../../../helpers/auth";


export const getServerSideProps = async ({req,res}) => {

    const token = getCookie('token', req)

    console.log(token);

    let user = null
    

    if(token){

        try {

            const response = await axios.get(`http://localhost:8080/api/user`,{

                headers: {

                    authorization: `Bearer ${token}`,
                    contentType: 'application/json'

                }

        

            })

            console.log('response from user: ',response);

            user = response.data.user

           

            console.log(user);

        }catch(error){

            console.log(error);

            if(error.response.status === 401){


                user = null

            }

        }

        if(user === null){

            //redirect

            res.writeHead(302, {

                'Content-Type': 'text/plain',
                'Location': '/'

            });

            
            res.end('ok');

        }

        

    }

    return {props: {user, token}}
}


const Update = ({user, token}) => {


  const [state, setState] = useState({

    name: user.name,
    email: user.email,
    password: "",
    error: "",
    buttonText: "Update Profile",
    success: "",
    loadedCategories:[],
    categories: user.categories


  });

  const { name, loadedCategories, categories, email, password, error, buttonText, success } = state;



useEffect(()=>{

  loadCategories()

},[])


// load categories


const loadCategories = async ()=>{

  const response = await axios.get('http://localhost:8080/api/categories')

  console.log('loaded categories: ',response);

  setState({...state, loadedCategories: response.data})


}

 
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update Profile",
    });
  };

  const handleSubmit = async (e) =>{

    e.preventDefault();

    setState({
      ...state,
      buttonText: 'Updating...'
    })
    try{

      const response = await axios.put(`http://localhost:8080/api/user`,{

        name,
        password,
        categories

      },{
        headers: {

            authorization: `Bearer ${token}`,
            contentType: 'application/json'

        }
      })

      console.log(response);

      updateUser(response.data , ()=>{

        setState({

            ...state,
            
            error: "",
            buttonText: "Updated!",
            success: 'Profile updated successfully!'
    
    
          });

          typeof window !== 'undefined' && window.location.reload()

      })

     

      console.log(response.data);


    }catch(error){

      console.log(error);

      setState({

        ...state,
         error: error.response.data.error,
         buttonText: "Update Profile"

     })

    }

  }


   // checkbox controller function

   const handleToggle = (c) =>() =>{

    //return first index or -1

    const clickedCategory = categories.indexOf(c)

    const all = [...categories]

    if(clickedCategory === -1){

        all.push(c)
        
    }else{

        all.splice(clickedCategory, 1)

    }

    

    console.log('all categories >> ',all);

    setState({...state, categories:all, success:'', error: ''})

}



  const showCategories = ()=>{

    return (

        loadedCategories && loadedCategories.map((c,i)=>(

            <li className="list-unstyled " key={i}>

                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={categories.includes(c._id)} onChange={handleToggle(c._id)} />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                       {c.name}
                    </label>
                    </div>
            </li>
        ) )

    )
}


  const updateForm = () => (

    <form  onSubmit={handleSubmit}>
      <div className="mb-3 col-md-6 offset-md-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Enter Your Name
        </label>
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Your Name"
          aria-label="Username"
          id="exampleFormControlInputName"
          required
        />
      </div>

      <div className="mb-3 col-md-6 offset-md-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Enter Your Email
        </label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          id="exampleFormControlInputEmail"
          placeholder="name@example.com"
          disabled
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
          id="exampleFormControlInputPassword"
          
        />
      </div>

      {/* <div className="form-group mb-3 col-md-6 offset-md-3">

        <label className="text-muted ">Category</label>
        <ul style={{ maxHeight: '100px', overflowY: 'scroll', margin: '15px 0 15px' }}>
          {showCategories()}
        </ul>
      </div> */}

      
      <div className="mb-3 col-md-6 offset-md-3 form-group">
      <label className="text-muted ">Category</label>
                        <ul style={{maxHeight: '100px', overflowY: 'scroll', margin: '15px 0'}}>
                            {showCategories()}
                        </ul>
        <button type="submit" className="btn btn-outline-primary btn-sm">
          {buttonText}
        </button>
      </div>
    </form>
    
  );

  return (
      <Fragment>
        <div className="container p-5">
            <h1 className="text-center">Update Profile</h1>
            <br/>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateForm()}
          </div>
      </Fragment>)
};
    

export default Update