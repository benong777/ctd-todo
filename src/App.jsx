import './App.css';
import { useLocation, useSearchParams, useNavigate, Routes, Route, useParams } from 'react-router';
import { useCallback, useEffect, useState, useReducer } from 'react';
import TodosPage from './pages';
import Header from './shared/header';
import AboutPage from './pages/about';
import NotFound from './pages/notFound';

//-- API Configs
import { BASE_URL, AUTH_HEADER } from './utils/apiConfig';
import checkHttpResponse from './utils/checkHttpResponse';

//-- Utility functions
import { recordMapper } from './utils/recordMapper';

//-- Styles
import { StyledButton } from './components/styles/Button.styles';
import classes from './App.module.css';

//-- Hooks
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [title, setTitle] = useState('');
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  //-- Pagination variables
  const filteredTodoList = todoState.todoList.filter((item) => item.isCompleted === false);
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);  // default: 1, the '10' is the radix for the parseInt
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastEntry = currentPage * itemsPerPage;
  const currTodoList = filteredTodoList.slice(indexOfFirstTodo, indexOfLastEntry);
  // const totalPages = Math.ceil(todoState.todoList.length/itemsPerPage);
  const totalPages = Math.ceil(filteredTodoList.length/itemsPerPage);

  console.log('indexOfFirstTodo:', indexOfFirstTodo);
  console.log('totalPages:', totalPages);
  console.log('currentPage:', currentPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
    console.log('Previous page set')
    console.log('Current page:', currentPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
    console.log('Next page set')
    console.log('Current page:', currentPage);
  };

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = ('');

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`
    }

    return encodeURI(`${BASE_URL}?${sortQuery}${searchQuery}`);
  },[sortField, sortDirection, queryString]);

  //-- Ensure currentPage is valid at render
  useEffect(() => {
    // Checks totalPages first before evaluating the 'if' statement inside:
    // to prevent it from automatically navigating to '/' when user refreshes page or navigating directly to a url that includes a page param
    if (totalPages > 0) {
      if (!(Number.isInteger(currentPage) && currentPage >= 1 && currentPage <= totalPages)) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('Todo List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not found.')
    }
  }, [location]);

  useEffect(() => {
    const fetchTodos = async() => {
      dispatch({ type: todoActions.fetchTodos });
      const options = { method: 'GET', headers: AUTH_HEADER };

      try {
        const resp = await fetch(encodeUrl(), options);
        //-- Check for errors in response
        checkHttpResponse(resp);

        //-- Successful fetch
        const { records } = await resp.json();

        //-- Convert each record into a proper todo object and update state
        dispatch({ type: todoActions.loadTodos, payload: records.map(recordMapper) })
      } catch(error) {
          dispatch({ type: todoActions.setLoadError, payload: error.message })
      }
    }
    fetchTodos();

    ////-- Needed?
    // return () => {
    //   // cleanup function
    // };
  // }, []);
  }, [sortField, sortDirection, queryString, encodeUrl]);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo,
            isCompleted: false, // Can we assume it to be false?
          }
        }
      ]
    };

    const options = {
      method: 'POST',
      headers: AUTH_HEADER,
      body: JSON.stringify(payload),
    }

    try {
      dispatch({ type: todoActions.startRequest })
      const resp = await fetch(encodeUrl(), options);
      //-- Check for errors in response
      checkHttpResponse(resp);

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      dispatch({ type: todoActions.addTodo, payload: savedTodo });
    } catch(error) {
      dispatch({ type: todoActions.setLoadError, payload: error.message })
    } finally {
      dispatch({ type: todoActions.endRequest })
    }
  }

  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);

    const payload = {
      records: [
        {
          id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          }
        }
      ]
    };

    const options = {
      method: 'PATCH',
      headers: AUTH_HEADER,
      body: JSON.stringify(payload),
    };

    // Set complete - Optimistic approach
    dispatch({ type: todoActions.completeTodo, payload: id});
    dispatch({ type: todoActions.startRequest });

    try {
      const resp = await fetch(encodeUrl(), options);

      //-- Check for errors in response
      checkHttpResponse(resp);
      dispatch({ type: todoActions.clearError });
    } catch (error) {
        dispatch({ type: todoActions.setLoadError, payload: `${error.message} Reverting todo...` })
        //-- Revert data when having data write error
        //-- Only need to change isComplete to false
        dispatch({ type: todoActions.revertTodo, payload: id });
    } finally {
        dispatch({ type: todoActions.endRequest });
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: AUTH_HEADER,
      body: JSON.stringify(payload)
    }

    //-- Optimistic update
    dispatch({ type: todoActions.updateTodo, payload: editedTodo });
    dispatch({ type: todoActions.startRequest });

    try {
      const resp = await fetch(encodeUrl(), options);

      //-- Check for errors in response
      checkHttpResponse(resp);
      dispatch({ type: todoActions.clearError });
    } catch(error) {
        dispatch({ type: todoActions.setLoadError, payload: `${error.message} Reverting todo...` });

        //-- Error: revert todo
        dispatch({ type: todoActions.revertTodo, payload: originalTodo });
    } finally {
        dispatch({ type: todoActions.endRequest });
    }
  }

  function dimissErrorHandler() {
    dispatch({ type: todoActions.clearError });
  }

  return (
    <div>
      <Header title={title}/>
      <Routes>
        <Route path="/"
          element={
            <div>
              <TodosPage 
                todoList={currTodoList}
                isSaving={todoState.isSaving}
                isLoading={todoState.isLoading}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                sortField={sortField}
                setSortField={setSortField}
                queryString={queryString}
                setQueryString={setQueryString}
                addTodo={addTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          }
        />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>


      {todoState.errorMsg && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <hr />
          <div className={classes.errorMessage}>
            <p>{todoState.errorMsg}</p>
            <StyledButton type='button' onClick={dimissErrorHandler}>Dismiss</StyledButton>
          </div> 
        </div>
      )}
    </div>
  )
}

export default App
