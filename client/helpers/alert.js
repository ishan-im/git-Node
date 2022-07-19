
export const showSuccessMessage = (success)=>(

    <div className="alert alert-info   offset-md-3" role="alert">
            {success}
    </div>

)



export const showErrorMessage = (error)=>(

    <div className="alert alert-warning   offset-md-3" role="alert">
            {error}
    </div>

)