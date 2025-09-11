import { useEffect, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem ({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  {/* 
    Cover edge case where an outdated value is displayed:
    when a user saves a todo and clicks it again immediately
    Added todo as a dependency.
  */}
  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (isEditing === false)  return;
    event.preventDefault();

    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
            <>
              <TextInputWithLabel
                value={workingTitle}
                onChange={handleEdit}
              />
              <button type="button" onClick={handleCancel}>Cancel</button>
              <button type="button" onClick={handleUpdate}>Update</button>
            </>
          ) : (
            <>
              <input 
                type='checkbox'
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
              <span onClick={() => setIsEditing(true)}>
                {todo.title}
              </span>
            </>
          )}
      </form>
    </li>
  )
}

export default TodoListItem;