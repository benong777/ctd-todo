import { useEffect, useState } from "react";

const TodosViewForm = ({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
  }) => {

  const [localQueryString, setLocalQueryString] = useState(queryString);

  //-- Add delay (500ms here) before setting queryString and submitting an API call.
  //-- Sending a network call for every character typed can use up API and network resources.
  useEffect(() => {
    const debounce = setTimeout(
      () => setQueryString(localQueryString),
      500);
    
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  const preventRefresh = (e) => {
    e.preventDefault();
  }

  return(
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor='search-input'>Search todos</label>
        <input
          id='search-input'
          name='searchInput'
          type='text'
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button type='button' onClick={() => setLocalQueryString('')}>Clear</button>
      </div>

      <div>
        <label htmlFor='sort-field-select'>Sort by</label>
        <select
          id='sort-field-select'
          name='sortFieldSelect'
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value='title'>Title</option>
          <option value='createdTime'>Time added</option>
        </select>

        <label htmlFor='sort-direction-select'>Direction</label>
        <select 
          id='sort-direction-select'
          name='sortDirectionSelect'
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;