import Link from "next/link";

import { useState } from "react";

import axios from "axios";
import { Fragment } from "react";

import HtmlToReactParser  from 'html-to-react'

import InfiniteScroll from 'react-infinite-scroller';



export async function getServerSideProps({req,query}) {

    let skip = 0
    let limit = 2

    const response = await axios.post(`http://localhost:8080/api/category/${query.slug}`,{skip,limit})

    console.log('from [slug] ssrfunc: ',response);

    const {data} = response

    const {category, links} = data

    // const totalLinks = Object.keys(data).length

    const totalLinks = links.length

    console.log('from [slug] ssr: ',totalLinks);

    return {

      props: {query, category, links, totalLinks,  skip, limit}

    }
  }


const Links = ({query, category,links,totalLinks,skip,limit})=>{

  const [allLinks, setAllLinks] = useState(links)
  const [limits, setLimits] = useState(limit)
  const [skips, setSkip] = useState(0)
  const [size, setSize] = useState(totalLinks)


  const loadUpdatedLinks = async() =>{

    const response = await axios.post(`http://localhost:8080/api/category/${query.slug}`)

    const {data} = response

    const {category, links} = data

    console.log('from load links func: ', links);

    setAllLinks(links)


  }

  const handleClick = async (linkId) =>{

    const response = await axios.put(`http://localhost:8080/api/click-count/`,{linkId})

    loadUpdatedLinks() 

  }


  const listOfLinks = () => (

    allLinks.map((l,i)=>(

        <div className="row alert alert-primary p-2" key={l._id}>

            <div className="col-md-8" onClick={e => handleClick(l._id)}>
              <a href={l.url} target='_blank' key={l._id} >
                <div className="pt-2">
                  <h6 className="pt-2 text-danger">
                    {l.title}
                  </h6>
                </div>
              </a>
            </div>

            <div className="col-md-4 pt-2">
              <span className="pull-right">{new Date(l.createdAt).toLocaleString()} by {l.postedBy.name} </span>
              <br />
              <span className="badge text-secondary pull-right">{l.clicks} clicks</span>
            </div>

            <div className="col-md-12">

              <span className="badge text-dark">
                {l.type}/{l.medium}
              </span>

              {l.categories.map((c,i)=> <span className="badge text-success" key={c._id}>{c.name}</span>)}

              
            </div>
        </div>
      )

    )

  )

  const loadMore = async () =>{

    let toSkip = skip + limit

    const response = await axios.post(`http://localhost:8080/api/category/${query.slug}`,{skip: toSkip, limit: limits})

    console.log('from loadmore function: ', response);

    const {data} = response

    const {category, links} = data


    setAllLinks([...allLinks,...links])


    console.log('allLinks: ', [...allLinks,...links]);

    console.log('response.data.links.length: ', links.length);

    setSize(links.length)

    setSkip(toSkip)



  }


  const hasMore = size > 0 && size >= limit


  const loadMoreButton = () => {

    return(

      size > 0 && size > limit && (

        <button onClick={loadMore} className="btn btn-outline-primary btn-lg"> Load More</button>

      )
    )

  }

   return ( 
   
   <Fragment>
    <div className="container">

        <div className="row ">

            <div className="col-md-8">

                <h1 className="display-4 font-weight-bold">{category.name} - URL/Links</h1>
                <p className="lead alert alert-secondary pt-4">{category.content}</p>
            </div>

        <div className="col-md-4">

           <img src={category.image.url} alt={category.name} style={{width: 'auto', maxHeight: '200px'}}/>

        </div>
   
        </div>

        <div className="row">
          <div className="col-md-8">
          {/* <InfiniteScroll  pageStart={0}
               loadMore={loadMore}
               hasMore={hasMore}
               loader={<div className="loader" key={0}>Loading ...</div>}> */}
               {listOfLinks()}

          {/* </InfiniteScroll> */}
          </div>

          <div className="col-md-4">
            <h2 className="lead">Most popular links in {category.name}</h2>
            <p>Show popular links</p>
          </div>
        </div>
        
        {/* <div className="text-center pt-4 pb-5">
          {loadMoreButton()}
        </div> */}

        <div className="row">
          <div className="col-md-12 text-center">

            {/* <InfiniteScroll  pageStart={0}
               loadMore={loadMore}
               hasMore={ size > 0 && size >= limit &&}
               loader={<div className="loader" key={0}>Loading ...</div>}
               /> */}
              
            

          </div>
        </div>

        </div>
    </Fragment>
    
    )

}


export default Links