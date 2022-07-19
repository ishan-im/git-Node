import { useState,useEffect, Fragment } from "react"

import axios from "axios"


import {isAuth} from '../../helpers/auth'

import { showErrorMessage,showSuccessMessage } from "../../helpers/alert"






const Create = () => {

    //state

    const [state,setState] = useState({

        title: '',
        url:'',
        categories : [],
        loadedCategories: [],
        success:'',
        error:'',
        type:'',
        medium:'',
        buttonText:'Submit Link'

    })

    const {title,url,categories,loadedCategories,success,error,type,medium,buttonText} = state



    useEffect(()=>{

        loadCategories()

    },[success])


    // load categories


    const loadCategories = async ()=>{

        const response = await axios.get('http://localhost:8080/api/categories')

        console.log('loaded categories: ',response);

        setState({...state, loadedCategories: response.data})


    }



     //title change function



     const handleTitleChange = e => {

      setState({...state, title:e.target.value, success:'',error:''})

  }


  // change url


  const handleURLChange =  e => {

      setState({...state, url:e.target.value,success:'',error:''})

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

      setState({...state, categories:all, success:'', error:''})

  }

  // radio type

  const handleTypeClick = (e)=> {

      setState({...state, type: e.target.value, success:'',error:''})

  }


  // radio medium click

  const handleMediumClick = (e)=> {

      setState({...state, medium: e.target.value, success:'',error:''})

  }


   

    const showTypes = () =>{

        return (
          <Fragment>
            <div className="form-check mt-2 mx-5">
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onClick={handleTypeClick}
                defaultChecked={type === "free"}
                value="free"
              />
              
                Free
              </label>
            </div>

            <div className="form-check mx-5">
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onClick={handleTypeClick}
                defaultChecked={type === "paid"}
                value="paid"
              />
              
                Paid
              </label>
            </div>

            
          </Fragment>
        );

    }


    const showMedium = () =>{

        return (
          <Fragment>
            <div className="form-check mt-2 mx-5">
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <input
                className="form-check-input"
                type="radio"
                name="medium"
                id="flexRadioDefault3"
                onClick={handleMediumClick}
                defaultChecked={medium === "video"}
                value="video"
              />
              
                Video
              </label>
            </div>

            <div className="form-check mx-5">
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              <input
                className="form-check-input"
                type="radio"
                name="medium"
                id="flexRadioDefault4"
                onClick={handleMediumClick}
                defaultChecked={medium === "article"}
                value="article"
              />
              
                Article
              </label>
            </div>

            
          </Fragment>
        );

    }



    const submitLinkForm  = () => {

     return (  
       <form>

            <div className="mb-3 form-group offset-md-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Title
              </label>
              <input
                onChange={handleTitleChange}
                value={title}
                type="title"
                className="form-control"
                placeholder="title"
                aria-label="Username"
                id="exampleFormControlInputName"
                required
              />
            </div>

            <div className="mb-3 form-group offset-md-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                URL
              </label>
              <input
                onChange={handleURLChange}
                value={url}
                type="url"
                className="form-control"
                placeholder="url"
                aria-label="Username"
                id="exampleFormControlInputName"
                required
              />
            </div>

            <div className="mb-3 col-md-6 offset-md-3 form-group">
              <button disabled={!isAuth()} type="submit" className="btn btn-outline-primary btn-sm">
                {isAuth() ? `${buttonText}` : 'Login to post'}
              </button>
            </div>

        </form>)
    }


    // show categories

    const showCategories = ()=>{

        return (

            loadedCategories && loadedCategories.map((c,i)=>(

                <li className="list-unstyled ml-4" key={c._id}>

                        <div className="form-check">
                        <input className="form-check-input" type="checkbox" onChange={handleToggle(c._id)} id="flexCheckDefault"/>
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                           {c.name}
                        </label>
                        </div>
                </li>
            ) )

        )
    }


    return (
       <Fragment>
        <div className="container p-5">

        <div className="row">

            <div className="col-md-12 text-center">
                <h1>Submit Link/URL</h1>
                <br/>
            </div>

        </div>

        <div className="row container">

            <div className="col-md-4">
                <div className="form-group">

                      <label className="text-muted mx-5">Category</label>
                        <ul style={{maxHeight: '100px', overflowY: 'scroll', margin:'15px'}}>
                            {showCategories()}
                        </ul>
                </div>

                <div className="form-group">
                <label className="text-muted mx-5">Type</label>
                {showTypes()}

                </div>

                <div className="form-group">
                <label className="text-muted mx-5 mt-3">Medium</label>
                {showMedium()}

                </div>
            </div>

            <div className="col-md-8">
              {error && showErrorMessage(error)}
              {success && showSuccessMessage(success)}
                {submitLinkForm()}
            </div>
        </div>

        </div>

        </Fragment>
        
        )

        
    
}


export default Create