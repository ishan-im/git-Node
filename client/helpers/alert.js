
export const showSuccessMessage = (success)=>(

    <div className="alert alert-info mb-3 col-md-6 offset-md-3" role="alert">
            {success}
    </div>

)



export const showErrorMessage = (error)=>(

    <div className="alert alert-warning mb-3 col-md-6 offset-md-3" role="alert">
            {error}
    </div>

)