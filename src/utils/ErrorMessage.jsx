const ErrorMessage = ({ errorMsg, dimissErrorHandler }) => {
  return (
     <div>
      <hr />
      <p>{errorMsg}</p>
      <button type='button' onClick={dimissErrorHandler}>Dismiss</button>
    </div> 
  )
}

export default ErrorMessage;