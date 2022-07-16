import { Fragment,useState } from "react"

import dynamic from 'next/dynamic'

import axios from "axios"

import Resizer from "react-image-file-resizer";

// import TextareaAutosize from 'react-textarea-autosize';

const ReactQuill = dynamic(() => import('react-quill'), {

  ssr: false,

})


import 'react-quill/dist/quill.bubble.css';

import { showErrorMessage,showSuccessMessage } from "../../../helpers/alert"

import { getCookie } from "../../../helpers/auth"

import classes from '../../../styles/Home.module.css'


export const getServerSideProps = async ({req,query}) => {

    const token = getCookie('token', req)

    console.log("From serverside props [slug] : ",token);

    const response = await axios.post(`http://localhost:8080/api/category/${query.slug}`)

    const {data} = response

    const {category} = data

    return {props: {token, oldCategory: category}}

}


const Update = ({token, oldCategory}) =>{

    const [state, setState] = useState({

        name: oldCategory.name,
        buttonText:'Update',
        image:'',
        imagePreview: oldCategory.image.url,
        imgaeUploadText:'Update Image',
        success:'',
        error:''

    })


    const [content, setContent] = useState(oldCategory.content)

    const {name,buttonText,image,imagePreview,success,error} = state

    const [imgaeUploadText, setImageUploadState] = useState('Upload Image')
    

    const handleName =  e => {

        const value =  e.target.value

        setState({...state, name: value, error:'', success: '',error:''})

        

    }


    const handleContent = (e) =>{

      setContent(e)

      setState({...state, success:'',error:''})

    }


    const handleImage = event =>{

      let fileInput = false;

      if (event.target.files[0]) {

        fileInput = true;

        console.log(event.target.files[0].name);

      }

      setImageUploadState(event.target.files[0].name)

      if (fileInput) {

        try {

          Resizer.imageFileResizer(

            event.target.files[0],
            300,
            300,
            "JPEG",
            100,
            0,

            (uri) => {

              console.log(uri);

              setState({...state, image: uri, success:'', error:''})
              
            },

            "base64",
            200,
            200

          );

        } catch (err) {

          console.log(err);

          

        }
      }
    }
 

    const handleSubmit = async (e) => {

        e.preventDefault();

        // console.table(name,content,image)

        setState({...state, buttonText : 'Updating'})

        try{

            const response = await axios.put(`http://localhost:8080/api/category/${oldCategory.slug}`, {name,content,image},{

                headers: {

                    Authorization: `Bearer ${token}`,
                    contentType: 'application/json'

                }

            })

            console.log("CATEGORY CREATE RESPONSE", response );

            

            setState({...state, name:response.data.name, buttonText: 'Updated', imgaeUploadText: 'Update Image', success: `${response.data.name} is updated!`, imagePreview: response.data.image.url })

            setContent(response.data.content)

            setImageUploadState('Upload Image')
           
        }catch(err){

            if(err.response){

                console.log('CATEGORY CREATE ERROR: ', err.response);

               setState({...state,  buttonText: 'Create', error: error.response, success:'' })

            }

        }

    }


    const updateCategoryForm = () =>{

        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-3  offset-md-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Category Name
              </label>
              <input
                onChange={handleName}
                value={name}
                type="text"
                className="form-control"
                placeholder="Category Name"
                aria-label="Username"
                id="exampleFormControlInputName"
                required
              />
            </div>

            <div className="mb-3  offset-md-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Content
              </label>
              {/* <TextareaAutosize
                onChange={handleContent}
                value={content}
                className="form-control m-3"
                id="exampleFormControlInputEmail"
                placeholder="Write Your Content"
                required
              /> */}

              <ReactQuill
                onChange={handleContent}
                value={content}
                className={`form-control ${classes.react__quill}`}
                placeholder="Write Your Content"
                theme="bubble"
                required
              />
            </div>

            <div className="mb-3  offset-md-3">
              <label
                htmlFor="formFile"
                className="btn btn-outline-secondary form-label"
              >
                {imgaeUploadText}

                <span className="mx-1"><img src={imagePreview} alt="image"height="20"/></span>

                <input
                  onChange={handleImage}
                  className="form-control"
                  accept="image/*"
                  type="file"
                  id="formFile"
                  hidden
                />
              </label>
            </div>

            <div className="mb-3 col-md-6 offset-md-3 form-group">
              <button type="submit" className="btn btn-outline-primary btn-sm">
                {buttonText}
              </button>
            </div>
          </form>
        );
    }


    return (
        <Fragment>
            <div className="row container-fluid">
                <div className="col-md-6 offset-md-3">
                    <h1 className="mb-3  offset-md-3">Update Category</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {updateCategoryForm()}
                </div>
            </div>
        </Fragment>
    )
}

export default Update