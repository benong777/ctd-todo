import './App.css';
import { useEffect, useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

//-- API Configs
import { BASE_URL, AUTH_HEADER } from './utils/apiConfig';
import checkHttpResponse from './utils/checkHttpResponse';

//-- Utility functions
import { recordMapper } from './utils/recordMapper';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTodos = async() => {
      setIsLoading(true);
      const options = { method: 'GET', headers: AUTH_HEADER };

      try {
        const resp = await fetch(BASE_URL, options);
        //-- Check for errors in response
        checkHttpResponse(resp);

        //-- Successful fetch
        const { records } = await resp.json();

        //-- Process each record data and update state
        setTodoList(records.map(recordMapper));
        setErrorMsg('');
      } catch(error) {
          setErrorMsg(error.message);
      } finally {
          setIsLoading(false);
      } 
    }
    fetchTodos();

    ////-- Needed?
    // return () => {
    //   // cleanup function
    // };
  }, []);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo,
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
      setIsSaving(true);
      const resp = await fetch(BASE_URL, options);
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
      setErrorMsg('');
    } catch(error) {
        console.log(error)
        setErrorMsg(error.message)
    } finally {
        setIsSaving(false);
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
      setIsSaving(true);
      const resp = await fetch(BASE_URL, options);

      //-- Check for errors in response
      checkHttpResponse(resp);
      setErrorMsg('');
    } catch (error) {
        setErrorMsg(`${error.message} Reverting todo...`);
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
        setIsSaving(false);
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
        return editedTodo;
      }
      return todo;
    })
    setTodoList([...updatedTodos]);

    try {
      setIsSaving(true);

      const resp = await fetch(BASE_URL, options);
      //-- Check for errors in response
      checkHttpResponse(resp);
      setErrorMsg('');
    } catch(error) {
        console.log(error);
        setErrorMsg(`${error.message} Reverting todo...`);

        //-- Error - revert todo
        const restoredTodos = todoList.map((todo) => {
          if (todo.id === originalTodo.id) {
            return originalTodo;
          } 
          return todo;
        });
        setTodoList([...restoredTodos]);
    } finally {
        setIsSaving(false);
    }
  }

  function dimissErrorHandler() {
    setErrorMsg('');
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMsg && (
        <div>
          <hr />
          <p>{errorMsg}</p>
          <button type='button' onClick={dimissErrorHandler}>Dismiss</button>
        </div> 
      )}
    </div>
  )
}

export default App
