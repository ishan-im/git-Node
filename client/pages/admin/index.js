
import axios from "axios";
import { Fragment } from "react";

import { getCookie } from "../../helpers/auth";

import Link from 'next/link'



export const getServerSideProps = async ({req,res}) => {

    const token = getCookie('token', req)

    console.log(token);

    let user = null

    if(token){

        try {

            const response = await axios.get(`http://localhost:8080/api/admin`,{

                headers: {

                    authorization: `Bearer ${token}`,
                    contentType: 'application/json'

                }

        

            })

            user = response.data

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

    return {props: {user}}
}




const Admin = ({user}) =>{
    return (
                <div className="container-fluid ">
                    <h1>Admin Dashboard</h1>
                    <br/>

                    <div className="row container">
                        <div className="col-md-4">
                            <ul className="nav flex-item">
                                <li className="nav-item">
                                    <Link href='/admin/category/create'>
                                        <a className="nav-link">Create Category</a>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link href='/admin/category/read'>
                                        <a className="nav-link">All Categories</a>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link href='/admin/link/read'>
                                        <a className="nav-link">All Links</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8"></div>
                    </div>
                  <div></div>
                </div>
    )
}




export default Admin