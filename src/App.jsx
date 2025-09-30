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
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

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
          <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
          <TodoList
            todoList={todoState.todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            isLoading={todoState.isLoading}
          />
        </div>
      </div>
      <hr />
      {todoState.errorMsg && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
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
