import Link from "next/link";

import Router from "next/router";

import { useState } from "react";

import moment from "moment";

import axios from "axios";
import { Fragment } from "react";

import HtmlToReactParser  from 'html-to-react'

import InfiniteScroll from 'react-infinite-scroller';

import { getCookie } from "../../../helpers/auth";



export async function getServerSideProps({req}) {

    const token = getCookie('token', req)

    let skip = 0
    let limit = 3

    const response = await axios.post(`http://localhost:8080/api/links/`,{skip,limit},{

        headers: {

            Authorization: `Bearer ${token}`

        }

    })

    console.log('from [slug] ssrfunc: ',response);

    const {data} = response.data

    console.log('data: ', data);

    

    const totalLinks = data.length

    // console.log(totalLinks);

    console.log('from [slug] ssr: ',totalLinks);

    return {

      props: {data, totalLinks,  skip, limit, token}

    }
  }




const Read = ({data,totalLinks,skip,limit, token})=>{

  const [allLinks, setAllLinks] = useState(data)
  const [skipLink, setSkipLink] = useState(skip)
  const [size, setSize] = useState(totalLinks)



  const handleDelete = async (id) =>{

    try{

      const response = await axios.delete(`http://localhost:8080/api/link/admin/${id}`,{

        headers: {
          Authorization : `Bearer ${token}`
        }

      })

      console.log('LINK delete success: ', response);

    

    typeof window !== 'undefined' && window.location.reload()

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



  const listOfLinks = () => (

    allLinks.map((l,i)=>(

        <div className="row alert alert-primary p-2" key={i}>

            <div className="col-md-8">
              <a href={l.url} target='_blank'>
                <div className="pt-2">
                  <h6 className="pt-2 text-danger">
                    {l.title}
                  </h6>
                </div>
              </a>
            </div>

            

            <div className="col-md-4 pt-2">
            <span className="pull-right">{moment(l.createdAt).fromNow()}</span>
              <br />
              <span className="pull-right">
           by {(l.postedBy.name) ? (l.postedBy.name): ''}
            </span>
           </div>

            <div className="col-md-12">

                <div className="col-md-8">
              <span className="badge text-dark">
                {l.type}/{l.medium}
              </span>

              {l.categories.map((c,i)=> <span className="badge text-success" key={i}>{c.slug}</span>)}

              
              
              <Link href={`/user/link/${l._id}`}>
                  <a><span className="badge text-warning pull-right">Update</span></a>
              </Link>

              <span onClick={(e)=> confirmDelete(e,l._id)} style={{cursor: 'pointer'}} className="badge text-danger pull-right">Delete</span>
              </div>

              <div className="col-md-4">
              <span className="bage text-secondary pull-right">{l.clicks} clicks</span>
             </div>

              </div>
             
            
        </div>
      )

    )

  )

  const loadMore = async () =>{

    const toSkip = skipLink + limit

    const response = await axios.post(`http://localhost:8080/api/links/`,{skip: toSkip, limit},{

        headers: {

            Authorization: `Bearer ${token}`

        }

    })

    console.log('from loadmore function: ', response);

    const {data} = response.data

    // const { links} = data


    setAllLinks([...allLinks,...data])


    console.log('allLinks: ', [...allLinks,...data]);

    console.log('response.data.links.length: ', data.length);

    setSize(data.length)

    setSkipLink(toSkip)



  }


  // const hasMore ={ size>0 && size >= limit}


  const loadMoreButton = () => {

    return(

      size > 0 && size >= limit &&  (

        <button onClick={loadMore} className="btn btn-outline-primary btn-lg"> Load More</button>

      )
    )

  }

   return ( 
   
   <Fragment>
    <div className="container p-5">

        <div className="row ">

            <div className="col-md-12 p-3">

                <h2 className="display-4 font-weight-bold text-center">All - URL/Links</h2>
               
            </div>

       
   
        </div>

        <div className="row">
          <div className="col-md-12">
          <InfiniteScroll  pageStart={0}
               loadMore={loadMore}
               hasMore={size>0 && size >= limit}
               loader={<div className="loader" key={0}>Loading ...</div>}>
               {listOfLinks()}

          </InfiniteScroll>
          </div>

          
        </div>
        
        

        <div className="row">
          <div className="col-md-12 text-center">


          </div>
        </div>

        </div>
    </Fragment>
    
    )

}


export default Read