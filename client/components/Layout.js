
import { Fragment, useState } from 'react';

import Link from 'next/link'

import classes from './Layout.module.css'

import { useRouter } from 'next/router';


import { isAuth , logOut } from '../helpers/auth';

import dynamic from 'next/dynamic'

import {FaPlus} from 'react-icons/fa'

import {BiGitMerge} from 'react-icons/bi'

import {BsSearch} from 'react-icons/bs'


const Layout = ()=>{

  const router = useRouter()

  const [searchQuery,setSearchQuery] = useState('')

  const handleSubmit = (e)=>{

    e.preventDefault();

    router.push({

      pathname: `search/${searchQuery}`,

    })


    setSearchQuery('')


  }

    

    const nav = () => (
      <nav className="navbar navbar-expand-lg navbar-light bg-light ">
        <div className="container-fluid">
          <Link href="/">
            <a className="navbar-brand">GitNode</a>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse " id="navbarNav">
            <ul className="navbar-nav">

              {!isAuth() && (
                <Fragment>
                  <li className="nav-item" key={1}>
                    <Link href="/login">
                      <a className="nav-link">Login</a>
                    </Link>
                  </li>

                  <li className="nav-item" key={2}>
                    <Link href="/register">
                      <a className="nav-link">Register</a>
                    </Link>
                  </li>
                </Fragment>
              )}

              {isAuth() && isAuth().role === "admin" && (
                
                <Fragment>
                  <li className="nav-item ml-auto" key={3}>
                    <Link href="/admin">
                      <a className="nav-link">{isAuth().name}</a>
                    </Link>
                  </li>

                  <li className="nav-item ml-auto" key={5}>
                <Link href="/user/link/create">
                  <a className="nav-link">Submit Link</a>
                </Link>
              </li>

                  </Fragment>
               
              )}

              {isAuth() && isAuth().role === "subscriber" && (
                <Fragment>
                  <li className="nav-item ml-auto" key={4}>
                    <Link href="/user">
                      <a className="nav-link">{isAuth().name}</a>
                    </Link>
                  </li>
                
                  <li className="nav-item ml-auto" key={5}>
                <Link href="/user/link/create">
                  <a className="nav-link">Submit Link</a>
                </Link>
              </li>
                  </Fragment>
              )}

              

              {isAuth() && (
                
                  <li className="nav-item" key={5}>
                    
                    <a className="nav-link" style={{"cursor":"pointer"}} onClick={logOut}>
                      Log Out
                    </a>
                   
                  </li>
                
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
    

   

    const header = () => (

      <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top" >
        <div className="container">

        <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link href="/">
            <a className="navbar-brand mb-0 h1 text-warning" style={{fontSize: '30px'}}>
              <BiGitMerge/>
              gitNode
            </a>
          </Link>

          

          <div className="collapse navbar-collapse" id="navbarSupportedContent">

            {isAuth() &&
            (<ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${classes.submit__link}`}>
              <li className="nav-item">
                <Link href="/user/link/create">
                  <a className="nav-link text-white"><FaPlus/> Submit Tutorial Link</a>
                </Link>
              </li>
            </ul>)
            }


     {isAuth() && isAuth().role === 'admin' &&
            (<ul className={`navbar-nav me-5 mb-2 mb-lg-0 ${classes.submit__link}`}>
              <li className="nav-item">
                <Link href="/admin/category/create">
                  <a className="nav-link text-white"><FaPlus/> Create Category</a>
                </Link>
              </li>
            </ul>)
            }

          {!isAuth() &&
            (<ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${classes.submit__link}`}>
              <li className="nav-item">
                <Link href="/user/create">
                  <a className="nav-link text-white"><FaPlus/> Submit Tutorial Link</a>
                </Link>
              </li>
            </ul>)
            }


            <form className="d-flex" role="search" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e)=>setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <button className="btn  btn-outline-warning" type="submit" style={{borderWidth : '0px'}}>
              <BsSearch/>
              </button>
            </form>

            <div className={classes.user__prof}>

            {isAuth() && isAuth().role === "subscriber" && (
              <Link href="/user">
                <a>
                  <img
                    src={`https://via.placeholder.com/90x90.png/293462/FFFFFF?text=${isAuth().name}`}
                    alt={isAuth().name}
                    width="40"
                    height="40"
                    className={`rounded-circle ${classes.margin__image}`}
                  />
                </a>
              </Link>
            )}

            {isAuth() && isAuth().role === "admin" && (
              <Link href="/admin">
                <a>
                  <img
                    src={`https://via.placeholder.com/90x90.png/293462/FFFFFF?text=${isAuth().name}`}
                    alt={isAuth().name}
                    width="40"
                    height="40"
                    className={`rounded-circle ${classes.margin__image}`}
                  />
                </a>
              </Link>
            )}

            {isAuth() && (
              <a
                className={`btn btn-outline-warning ${classes.log__out}`}
                type="button"
                style={{ cursor: "pointer" }}
                onClick={logOut}
              >
                Log Out
              </a>
            )}

          

            {!isAuth() && (
              <Fragment>
                <Link href="/login">
                  <a type="button" className={`btn btn-outline-light me-2 ${classes.customized__btn} `}>
                    Login
                  </a>
                </Link>

                <Link href="/register">
                  <a type="button" className={`btn btn-warning ${classes.customized__btn}`}>
                    Sign-up
                  </a>
                </Link>
              </Fragment>
            )}

         </div>
          </div>
        </div>
      </nav>
    );

    
    return (<Fragment>


             {header()}
      
          </Fragment>)

}


export default dynamic(()=> Promise.resolve(Layout), {ssr: false});

