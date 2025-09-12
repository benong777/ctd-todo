const TodosViewForm = ({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
  }) => {

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
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />
        <button type='button' onClick={() => setQueryString('')}>Clear</button>
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