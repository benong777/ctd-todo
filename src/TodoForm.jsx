import { useRef, useState } from "react";

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo
        <input
          ref={todoTitleInput}
          id='todoTitle'
          type='text'
          name='title'
          value={workingTodoTitle}
          onChange={(event) => setWorkingTodoTitle(event.target.value) }
        />
      </label>
      <button
        type="submit"
        disabled={workingTodoTitle === ''}
      >Add Todo
      </button>
    </form>
  )
}

export default TodoForm;