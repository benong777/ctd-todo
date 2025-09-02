import './App.css';
import { useEffect, useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async() => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const resp = await fetch(url, options);
        //-- Error
        if (!resp.ok) {
          //-- Authentication Error
          if (resp.status === 401) {
            throw new Error('Not authorized. Please log in.');
          }
          const fetchData = await resp.json();
          if (fetchData.error) {
            throw new Error(fetchData.error);
          }
          //-- All other errors
          throw new Error('Error occurred while fetching todo list.');
        }

        //-- Successful fetch
        const { records } = await resp.json();
        const fetchedRecords = records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          }
          if (!record.fields.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });

        console.log(fetchedRecords[0].title);
        setTodoList([...fetchedRecords]);
      } catch(error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      } 
    }
    fetchTodos();

    //-- Needed?
    return () => {
      // cleanup function
    };
  }, []);

  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false }
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true }
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      } else {
        return todo;
      }
    });

    setTodoList(updatedTodos);
  }

  function dimissErrorHandler() {
    setErrorMessage('');
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button type='button' onClick={dimissErrorHandler}>Dismiss</button>
        </div>
      )}
    </div>
  )
}

export default App
