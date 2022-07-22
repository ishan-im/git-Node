
import React, { Fragment, useEffect, useState } from 'react'

import axios from 'axios'

import Link from 'next/link'

import Head from 'next/head'

import Image from 'next/image'

import moment from 'moment'

import classes from '../styles/Home.module.css'

import {GrCode} from 'react-icons/gr'


export const getServerSideProps = async ({req,res}) => {

  let limit = 6;

  let skip = 0;

  const response = await  axios.post(`http://localhost:8080/api/categorieslist`,{skip, limit})

  console.log("from home ssr response : ", response);
 
  const {data} = response

  const noOfCategory = data.length


  return {

    props: {data,limit,skip,noOfCategory}

  }

}



export default function Home({data,limit,skip,noOfCategory}) {


  const head = () =>(

    <Head>
      <title>gitNode - Learn-Share-Grow </title>
      <meta name="description" content='Find best programming course online in gitNode. Learn-Share & Grow'/>
      <meta property="og:title" content='Find best programming course online in gitNode. Learn-Share & Grow' />
      <meta property="og:description" content='Find best programming course online in gitNode.' />
      {/* <meta property="og:image:secure_url" content={category.image.url} />
      <meta property="og:image" content={category.image.url} /> */}
    </Head>

  )


  const [category, setCategory] = useState(data)

  const [skipCategory, setSkipCategory] = useState(skip)

  const [size,setSize] = useState(noOfCategory)


  const loadMore = async() =>{

    const toSkip =  skipCategory + limit

    const response =  await  axios.post(`http://localhost:8080/api/categorieslist`,{skip: toSkip, limit})

    console.log("loadmore func post response : ", response);
 
     const {data} = response

     setCategory([...category,...data])

     

     console.log('from loadmore all category: ', category, ' skip: ', toSkip);

     setSize(data.length)

     setSkipCategory(toSkip)

  }


  

  const loadMoreButton = () => {

    return(

      size > 0 && size >= limit && (

        <button onClick={loadMore} className="btn btn-outline-primary btn-lg"> Load More Category</button>

      )
    )

  }




  const listOfCategories = () => category.map((c,i)=>{

    return (

      <Link href={`/links/${c.slug}`} key={i}>

        <a className={` col-lg-4 col-md-6  ${classes.item__link}`}>
          
            <div className="row" >
              <div className='col-3'>
                <img className={` ${classes.image}`}  src={c.image.url} alt={c.slug} />
              </div>

              <div
              className='col-5'
                 
                 >
                <p className={classes.paragraph} key={c._id}>{c.name}</p>
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
        <span className="pull-right">{moment(l.createdAt).fromNow()}</span>
        <br/>
          <span className="pull-right">
           by {(l.postedBy.name) ? (l.postedBy.name): ''}
          </span>
          
        </div>


        <div className="col-md-8">

          <span className="badge text-dark">
          {l.medium}{` / `}{l.type} 
          </span>

          {l.categories.map((c,i)=>(
            <span className="badge text-success" key={i}>{c.name}</span>
          ))}

          

        </div>

        <div className="col-md-4">
         <span className="bage text-secondary pull-right">{l.clicks} clicks</span>
        </div>

      </div>

    ))

  )

  return (
    <Fragment>

      {head()}

      <div className="container ">

      <div className='container-fluid p-5'>

      <h3 className='text-center mt-3 p-3'>Find the Best <GrCode/>Programming Courses and Tutorial</h3>
    
      <div className='container-fluid mt-4 '>

       
       <div className={`container ${classes.container__placement}`}>
       <div className={`row my-4 ${classes.category__list}`}>
        
        {listOfCategories()}
       
       </div>

       </div>

       <div className="text-center my-5">
          {loadMoreButton()}
        </div>

      <div className="container mt-5">

       <div className="row ">

        <h2 className="font-weight-bold pb-3 text-center">Trending Links</h2>
        <div className="col-md-12 overflow-hidden">

          {listOfTrendingLinks()}

        </div>
        </div>
       </div>
       </div>
      </div>
      </div>

      </Fragment>
  )

}
