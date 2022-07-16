
import React from 'react'

import axios from 'axios'

import Link from 'next/link'

import Image from 'next/image'

import classes from '../styles/Home.module.css'


export const getServerSideProps = async ({req,res}) => {

  const response = await  axios.get(`http://localhost:8080/api/categories`)

  console.log("from home ssr response : ", response);
 
  const {data} = response


  return {

    props: {data}

  }

}



export default function Home({data}) {

  const listOfCategories = () => data.map((c,i)=>{

    return (

      <Link href={`/links/${c.slug}`} key={c._id}>
        <a
          className={` col-md-6  ${classes.item__link}`}
         
        >
          
            <div className="row" >
              <div className="col-md-4" >
                <img className="img-fluid" src={c.image.url} alt={c.slug} />
              </div>

              <div
                key={c.name}
                 className="col-md-8"
                 style={{
                  display:'flex',
                  alignItems:'center',
                 }}
                 >
                <p key={c._id}>{c.name}</p>
              </div>
            </div>
          
        </a>
      </Link>
    );

  })

  return (
    
      <div className='container p-3'>
       
       <div className="row">

        {listOfCategories()}

       </div>

      </div>
  )

}
