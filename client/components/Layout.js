
import { Fragment } from 'react';

import Link from 'next/link'


import { isAuth , logOut } from '../helpers/auth';

import dynamic from 'next/dynamic'


const Layout = ()=>{

    

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
    
    
    return (<Fragment>

             

             {nav()}
            
             
      
          </Fragment>)

}


export default dynamic(()=> Promise.resolve(Layout), {ssr: false});