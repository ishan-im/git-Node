import { Fragment,useEffect,useState } from "react"

import dynamic from 'next/dynamic'
import Link from "next/link"

import classes from '../../../styles/Home.module.css'
import axios from "axios"


import { showErrorMessage,showSuccessMessage } from "../../../helpers/alert"

import { getCookie } from "../../../helpers/auth"




export const getServerSideProps = async ({req,res}) => {

    const token = getCookie('token', req)

    console.log("From serverside props: ",token);

    return {props: {token}}

}


const Read = ({token}) =>{

    const [state, setState] = useState({

        success:'',
        error:'',
        categories: []

    })

    const {error, success, categories} = state

    useEffect(()=>{

        loadCategories()

    },[])


    const loadCategories = async ()=>{

        const response = await axios.get(`http://localhost:8080/api/categories`)

        setState({...state, categories: response.data})

    }

    const handleDelete = async (slug) =>{

      try{

        const response = await axios.delete(`http://localhost:8080/api/category/${slug}`,{

          headers: {
            Authorization : `Bearer ${token}`
          }

        })

        console.log('Category delete success: ', response);

        loadCategories()

      }
      catch(err){

        console.log('Category delete err: ', err);

      }

    }


    const confirmDelete =(e, slug )=> {

      e.preventDefault()

      let answer = window.confirm('Are you sure you want to delete?')

      if(answer){

        handleDelete(slug)

      }
        
        
    }

    const listOfCategories = () => categories.map((c,i)=>{

        return (
    
          <Link href={`/links/${c.slug}`} key={i}>
            <a

              className={` col-md-6  ${classes.item__link}`}
              
            >
              
                <div className="row" >
                  <div 
                      className="col-md-4" 
                      style={{
                        display:'flex',
                        alignItems:'center',
                       }}>
                    <img className="img-fluid" src={c.image.url} alt={c.slug} />
                  </div>
    
                  <div
                    key={c.name}
                     className="col-md-5"
                     style={{
                      display:'flex',
                      alignItems:'center',
                     }}
                     >
                    <p key={c._id}>{c.name}</p>
                  </div>

                  <div className="col-md-3">

                    <Link href={`/admin/category/${c.slug}`}>
                        <button className="btn btn-sm btn-outline-success btn-block mb-2">Update</button>
                    </Link>

                    <button className="btn btn-sm btn-outline-danger btn-block" onClick={(e)=> confirmDelete(e,c.slug)}>
                        Delete
                    </button>

                  </div>
                </div>
              
            </a>
          </Link>
        );
    
      })


    return (
        <div className="container p-4">
        <div className="row ">
            <div className="col text-center">
                <h1>List Of Categories</h1>
                <br/>
            </div>
        </div>

        <div className="row">
            {listOfCategories()}
        </div>

        </div>
    )


}



export default Read