import { BASE_URL } from './apiConfig';

const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = ('');

  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`
  }
  
  return encodeURI(`${BASE_URL}?${sortQuery}${searchQuery}`); 
}

export default encodeUrl;