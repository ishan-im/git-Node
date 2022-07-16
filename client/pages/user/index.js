
import axios from "axios";
import { Fragment } from "react";

import Router from "next/router";

import Link from "next/link";

import { getCookie } from "../../helpers/auth";


import Dashboard from "../../components/Dashboard";

import { Duration } from "luxon";



export const getServerSideProps = async ({req,res}) => {

    const token = getCookie('token', req)

    console.log(token);

    let user = null
    let userLinks = []

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

            userLinks = response.data.links

            console.log(user, " ", userLinks);

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

    return {props: {user, userLinks, token}}
}




const User = ({user, userLinks, token}) =>{


    const handleDelete = async (id) =>{

        try{
  
          const response = await axios.delete(`http://localhost:8080/api/link/${id}`,{
  
            headers: {
              Authorization : `Bearer ${token}`
            }
  
          })
  
          console.log('LINK delete success: ', response);
  
         Router.replace('/user') 
  
        }
        catch(err){
  
          console.log('Link delete err: ', err);
  
        }
  
      }
  
  
      const confirmDelete =(e, id )=> {
  
        e.preventDefault()
  
        let answer = window.confirm('Are you sure you want to delete?')
  
        if(answer){
  
          handleDelete(id)
  
        }
          
          
      }


    const listOfLinks = ()=> userLinks.map((link, index)=>(

       
        <div  className="row alert alert-primary p-2" key={index}>

            <div className="col-md-8">
                <a href={link.url} target='_blank' >
                <h5 className="pt-2">{link.title}</h5>
                <h6 className="pt-2 text-danger" style={{fontSize: '14px'}}>{link.url}</h6>
                </a>
            </div>

            <div className="col-md-4 pt-2">

                <span className="pull-right">{link.createdAt} by {link.postedBy.name}</span>

            </div>

            <div className="col-md-12">
                <span className="badge text-dark">
                    {link.type}/{link.medium}
                </span>
                {link.categories.map((category,index)=>(
                    
                    <span key={index} className='badge text-success'>
                        {category.name}
                    </span>

                ))}

                <span className="badge text-secondary">{link.clicks} clicks</span>

                

                <Link href={`/user/link/${(link._id) ? (link._id): '404'}`}>
                    <a>
                      <span className="badge text-warning pull-right">Update</span>
                    </a>
                </Link>

                <span onClick={(e)=> confirmDelete(e, link._id)} className="badge text-danger pull-right">Delete</span>
            </div>

        </div>
        

    ))

    return (

        <div className="row container-fluid p-5" >

            <div className="col-md-4">
             <Dashboard userName={user.name} role={user.role}/>
            </div>
        
        <div className="col-md-8 p-3">
            <h2 className="text-center">Your Links</h2>
            <hr />
            {listOfLinks()}
        </div>

        
        </div>
        
    )

}




export default User