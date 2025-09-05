import './App.css';
import { useEffect, useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async() => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

        setTodoList([...fetchedRecords]);
        setErrorMessage('');
      } catch(error) {
          setErrorMessage(error.message);
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
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        //-- Authentication Error
        if (resp.status === 401) {
          throw new Error('Not authorized. Please log in.')
        }
        //-- All other errors
        throw new Error('Error posting data');
      }

      const { records } = await resp.json();

      const savedTodo = {
        ...records[0].fields,
        id: records[0].id,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
      setErrorMessage('');
    } catch(error) {
        console.log(error)
        setErrorMessage(error.message)
    } finally {
        setIsSaving(false);
    }
  }

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    console.log('OriginalTodo:', originalTodo);

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
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
      const resp = await fetch(url, options);

      if (!resp.ok) {
        //-- Authentication error
        if (resp.status === 401) {
          throw new Error('Not authorized. Please log in.');
        }
        //-- All other errors
        throw new Error('Error occurred while setting todo complete.');
      }

      setErrorMessage('');
    } catch (error) {
        setErrorMessage(`${error.message} Reverting todo...`);
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
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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

      const resp = await fetch(url, options);

      if (!resp.ok) {
        //-- Authentication Error
        if (resp.status === 401) {
          throw new Error('Not authorized. Please log in.');
        }
        //-- All other errors
        throw new Error('Error updating data.');
      }

      setErrorMessage('');
    } catch(error) {
        console.log(error);
        setErrorMessage(`${error.message} Reverting todo...`);

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
    setErrorMessage('');
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
