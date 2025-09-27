import './App.css';
import { useCallback, useEffect, useState, useReducer } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

//-- API Configs
import { BASE_URL, AUTH_HEADER } from './utils/apiConfig';
import checkHttpResponse from './utils/checkHttpResponse';

//-- Utility functions
import { recordMapper } from './utils/recordMapper';

//-- Styles
import { StyledButton } from './components/styles/Button.styles';
import classes from './App.module.css';

//-- Hooks
import { initialState, actions, reducer } from './reducers/todos.reducer';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState('');
  // const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = ('');

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`
    }

    return encodeURI(`${BASE_URL}?${sortQuery}${searchQuery}`);
  },[sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async() => {
      // setIsLoading(true);
      dispatch({ type: actions.SET_LOADING, payload: true });
      const options = { method: 'GET', headers: AUTH_HEADER };

      try {
        const resp = await fetch(encodeUrl(), options);
        //-- Check for errors in response
        checkHttpResponse(resp);

        //-- Successful fetch
        const { records } = await resp.json();

        //-- Process each record data and update state
        setTodoList(records.map(recordMapper));
        // setErrorMsg('');
        dispatch({ type: actions.SET_ERROR_MESSAGE, payload: '' });
      } catch(error) {
          // setErrorMsg(error.message);
          dispatch({ type: actions.SET_ERROR_MESSAGE, payload: error.message });
      } finally {
          // setIsLoading(false);
          dispatch({ type: actions.SET_LOADING, payload: false });
      } 
    }
    fetchTodos();

    ////-- Needed?
    // return () => {
    //   // cleanup function
    // };
  // }, []);
  }, [sortField, sortDirection, queryString]);

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
      // setIsSaving(true);
      dispatch({ type: actions.SET_SAVING, payload: true });
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
      setTodoList([...todoList, savedTodo]);
      // setErrorMsg('');
      dispatch({ type: actions.SET_ERROR_MESSAGE, payload: '' });
    } catch(error) {
        // setErrorMsg(error.message)
        dispatch({ type: actions.SET_ERROR_MESSAGE, payload: error.message });
    } finally {
        // setIsSaving(false);
        dispatch({ type: actions.SET_SAVING, payload: false });
    }
  }

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);

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
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        todo.isCompleted = true;
      }
      return todo;
    });
    setTodoList([...updatedTodos])

    try {
      // setIsSaving(true);
      dispatch({ type: actions.SET_SAVING, payload: true });
      const resp = await fetch(encodeUrl(), options);

      //-- Check for errors in response
      checkHttpResponse(resp);
      // setErrorMsg('');
      dispatch({ type: actions.SET_ERROR_MESSAGE, payload: '' });
    } catch (error) {
        // setErrorMsg(`${error.message} Reverting todo...`);
        dispatch({ type: actions.SET_ERROR_MESSAGE, payload: `${error.message} Reverting todo...` });
        //-- Revert data when having data write error
        //-- Only need to change isComplete to false
        const restoredTodos = todoList.map((todo) => {
          if (todo.id === id) {
            return { ...todo, isCompleted: false };
          }
          return todo;
        });
        setTodoList([...restoredTodos]);
    } finally {
        // setIsSaving(false);
        dispatch({ type: actions.SET_SAVING, payload: false });
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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
    const updatedTodos = todoList.map((todo)=> {
      if (todo.id === editedTodo.id) {
        return {...editedTodo};
      }
      return {...todo};
    })
    setTodoList([...updatedTodos]);

    try {
      // setIsSaving(true);
      dispatch({ type: actions.SET_SAVING, payload: true });
      const resp = await fetch(encodeUrl(), options);

      //-- Check for errors in response
      checkHttpResponse(resp);
      // setErrorMsg('');
      dispatch({ type: actions.SET_ERROR_MESSAGE, payload: '' });
    } catch(error) {
        // setErrorMsg(`${error.message} Reverting todo...`);
        dispatch({ type: actions.SET_ERROR_MESSAGE, payload: `${error.message} Reverting todo...` });

        //-- Error - revert todo
        const restoredTodos = todoList.map((todo) => {
          if (todo.id === originalTodo.id) {
            return {...originalTodo};
          } 
          return {...todo};
        });
        setTodoList([...restoredTodos]);
    } finally {
        // setIsSaving(false);
        dispatch({ type: actions.SET_SAVING, payload: false });
    }
  }

  function dimissErrorHandler() {
    // setErrorMsg('');
    dispatch({ type: actions.SET_ERROR_MESSAGE, payload: '' });
  }

  return (
    <div>
      <h1>Todo List</h1>
      <div className='app-columns'>
        <div id='menu-column'>
          <TodosViewForm 
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            sortField={sortField}
            setSortField={setSortField}
            queryString={queryString}
            setQueryString={setQueryString}
          />
        </div>
        <div id='content-column'>
          <TodoForm onAddTodo={addTodo} isSaving={state.isSaving} />
          <TodoList
            todoList={todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            isLoading={state.isLoading}
          />
        </div>
      </div>
      <hr />
      {state.errorMsg && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={classes.errorMessage}>
          <p>{state.errorMsg}</p>
          <StyledButton type='button' onClick={dimissErrorHandler}>Dismiss</StyledButton>
        </div> 

        </div>
      )}
    </div>
  )
}

export default App
