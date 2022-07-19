
import axios from "axios";
import { Fragment } from "react";

import { getCookie } from "../../helpers/auth";

import Link from 'next/link'
import classes from '../../components/Dashboard.module.css'



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

            user = response.data.user

            console.log('admin data: ',user);

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


    const dashBoard = ()=>

        (
        <div className={classes.body}>

            <div className={classes.card} style={{height:'36rem', width:'25rem'}}>
        <div className={classes.card__img}>
            <img src={`https://via.placeholder.com/90x90.png/293462/FFFFFF?text=${user.name}`} alt={user.name}/>
        </div>
        <div className={classes.card__name}>
            <h2>{user.name}</h2>
        </div>
        <div className={classes.card__job}>
            <span>{user.role}</span>
        </div>
        
        <div className={classes.card__btn}>
            <Link href='/user/profile/update'>
            <button className={classes.card__btn_contact}>Update Profile</button>
            </Link>

            <Link href='/user/link/create'>
            <button className={classes.card__btn_contact}>Create Link</button>
            </Link>

            <Link href='/admin/category/create'>
                                        <button className={classes.card__btn_contact}>Create Category</button>   
                                        </Link>

                                        <Link href='/admin/category/read'>
                                        <button className={classes.card__btn_contact}>All Categories</button>
                                    </Link>

                                    <Link href='/admin/link/read'>
                                        <button className={classes.card__btn_contact}>All Links</button>
                                    </Link>
        </div>
    </div>

        </div>
    )






    return (
                <div className="container p-5">
                    <h1 className="text-center">{user.name}'s Dashboard</h1>
                    <br/>

                    <div className="row container">
                        {/* <div className="col-md-4">
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
                  <div> */}

                  {dashBoard()}

                  </div>
                </div>
    )
}




export default Admin