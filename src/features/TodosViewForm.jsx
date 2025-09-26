import { useEffect, useState } from "react";
import { StyledButton } from "../components/styles/Button.styles";
import styled from 'styled-components';

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

  //-- Styled Components
  const StyledSortContainer = styled.div`
    display: flex;
    align-items: center;
    label {
      margin-right: 1em;
    }
  `;

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
        <StyledButton
          type='button'
          onClick={() => setLocalQueryString('')}>Clear
        </StyledButton>
      </div>

      <div>
        <StyledSortContainer>
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
        </StyledSortContainer>

        <StyledSortContainer>
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
        </StyledSortContainer>
      </div>
    </form>
  );
}

export default TodosViewForm;