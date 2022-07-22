import Link from "next/link";

import Head from 'next/head'

import { useState , useEffect} from "react";

import loading from '../../public/static/image/loading.gif'

import axios from "axios";
import { Fragment } from "react";

import moment from 'moment';



import InfiniteScroll from 'react-infinite-scroller';





export async function getServerSideProps({req,query}) {

    let skip = 0
    let limit = 5

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
  
  const [skipLink, setSkipLink] = useState(skip)

  const [size, setSize] = useState(totalLinks)

  const [popular, setPopular] = useState([])


  const loadPopular = async() =>{


    const response = await axios.get(`http://localhost:8080/api/link/popular/${category.slug}`)

    setPopular(response.data)

  }


  useEffect(()=>{

    loadPopular()

  },[])

  const stripHTML = data => data.replace(/<\/?[^>]+(>|$)/g, '');
  
  const head = () =>(

    <Head>
      <title>{category.name} - gitNode</title>
      <meta name="description" content={stripHTML(category.content.substring(0,200))}/>
      <meta property="og:title" content={category.name} />
      <meta property="og:description" content={category.content.substring(0,160)} />
      <meta property="og:image:secure_url" content={category.image.url} />
      <meta property="og:image" content={category.image.url} />
    </Head>

  )



  const listOfTrendingLinks = ()=> (
    
    popular.map((l,i)=>(

      <div className="row alert alert-secondary p-2" key={i}>

        <div className="col-md-8" onClick={()=> handleClick(l._id) !== null ? (l._id): ''}>
         <a href={l.url} target="_blank">
          <h5 className="pt-2">
            {l.title}
          </h5>
          <h6 className="pt-2 text-danger overflow-hidden" style={{fontSize: '12px'}}>
            {l.url}
          </h6>
         </a>
        </div>

        <div className="col-md-4 pt-2">
        <span className="pull-right">{moment(l.createdAt).fromNow()}</span>
        <br/>
          <span className="pull-right">
           by {(l.postedBy.name)}
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


  const loadUpdatedLinks = async() =>{

    const response = await axios.post(`http://localhost:8080/api/category/${query.slug}`,{skip: skipLink,limit})

    const {data} = response

    const {links} = data

    console.log('from load links func: ', links);

    setAllLinks(links)


  }


  const handleClick = async (linkId) =>{

    const response = await axios.put(`http://localhost:8080/api/click-count/`,{linkId})

    loadUpdatedLinks()
    
    loadPopular()

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
              <span className="pull-right">{moment(l.createdAt).fromNow()} by {l.postedBy.name} </span>
              <br />
              <span className="badge text-secondary pull-right">{l.clicks} clicks</span>
            </div>

            <div className="col-md-12">

              <span className="badge text-dark">
                {l.type}/{l.medium}
              </span>

              {l.categories.map((c,i)=> <span className="badge text-success" key={i}>{c.name}</span>)}

              
            </div>
        </div>
      )

    )

  )



  const loadMore = async () =>{

    const toSkip = skipLink + limit

    const response = await axios.post(`http://localhost:8080/api/category/${query.slug}`,{skip: toSkip, limit})

    console.log('from loadmore function: ', response);

    const {data} = response

    const {category, links} = data


    setAllLinks([...allLinks,...links])


    console.log('allLinks hello: ', allLinks);

    console.log('response.data.links.length: ', allLinks.length);

    setSize(links.length)

    setSkipLink(toSkip)



  }


  const hasMore = size > 0 && size >= parseInt(limit)


  const loadMoreButton = () => {

    return(

      size > 0 && size >= limit && (

        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">Load More</button>

      )
    )

  }

   return ( 
   
   <Fragment>
    {head()}
    <div className="container p-5">

        <div className="row ">

            <div className="col-md-8">

                <h2 className="display-4 font-weight-bold mb-3">{category.name} - URL/Links</h2>
                <div className="lead alert alert-secondary pt-4"  dangerouslySetInnerHTML={{__html: category.content}}>

                </div>
            </div>

        <div className="col-md-4 px-5 py-2">

           <img src={category.image.url} alt={category.name} style={{width: 'auto', maxHeight: '200px'}}/>

        </div>
   
        </div>

        <div className="row">
          <div className="col-md-8">
            
          <InfiniteScroll  pageStart={0}
               loadMore={loadMore}
               hasMore={hasMore}
               loader={<h3 key={10} className='loader'>Loading...</h3>}
               >

               {listOfLinks()}

          </InfiniteScroll>

          
          </div>

          <div className="col-md-4 p-5">
            <h2 className="lead">Most popular links in {category.name}</h2>
            
            {listOfTrendingLinks()}
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


export default Links