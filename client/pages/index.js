
import React, { useEffect, useState } from 'react'

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


  const [popular, setPopular] = useState([])


  const loadPopular = async() =>{


    const response = await axios.get(`http://localhost:8080/api/link/popular`)

    setPopular(response.data)

  }


  useEffect(()=>{

    loadPopular()

  },[])

const handleClick = async(id) =>{

  

  const response = await axios.put(`http://localhost:8080/api/click-count`, {linkId: id});

  loadPopular();

}


  const listOfTrendingLinks = ()=> (
    
    popular.map((l,i)=>(

      <div className="row alert alert-secondary p-2" key={i}>

        <div className="col-md-8" onClick={()=> handleClick(l._id) !== null ? (l._id): ''}>
         <a href={l.url} target="_blank">
          <h5 className="pt-2">
            {l.title}
          </h5>
          <h6 className="pt-2 text-danger" style={{fontSize: '12px'}}>
            {l.url}
          </h6>
         </a>
        </div>

        <div className="col-md-4 pt-2">
          <span className="pull-right">
           by {(l.postedBy.name) ? (l.postedBy.name): ''}
          </span>
          
        </div>


        <div className="col-md-8">

          <span className="badge text-dark">
          {l.medium}{` `}{l.type} 
          </span>

          {l.categories.map((c,i)=>(
            <span className="badge text-info" key={i}>{c.name}</span>
          ))}

          

        </div>

        <div className="col-md-4">
         <span className="bage text-secondary pull-right">{l.clicks} clicks</span>
        </div>

      </div>

    ))

  )

  return (
    
      <div className='container p-3'>
       
       <div className="row">

        {listOfCategories()}

       </div>


       <div className="row">

        <h2 className="font-weight-bold pb-3 text-center">Trending Links</h2>
        <div className="col-md-12 overflow-hidden">

          {listOfTrendingLinks()}

        </div>
       </div>

      </div>
  )

}
