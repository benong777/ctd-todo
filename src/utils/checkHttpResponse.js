export default function checkHttpResponse(response) {
  //-- Error
  if (!response.ok) {
    //-- Authentication Error
    if (response.status === 401) {
      throw new Error('Not authorized. Please log in.');
    }
    //-- All other errors
    throw new Error('HTTP response error.');
  }
}