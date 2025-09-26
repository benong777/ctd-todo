import { useEffect, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styled from "styled-components";
import { StyledButton } from "../../components/styles/Button.styles";
import classes from './TodoListItem.module.css';

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

  //-- Styled Components
  const StyledListItem = styled.div`
    margin-top: .5em;
    font-size: 1.2em;
    span {
      margin-left: .3em;
  }
  `
  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
            <>
            <div style={{ marginTop: 28, marginBottom: 28 }}>
              <TextInputWithLabel
                value={workingTitle}
                onChange={handleEdit}
              />
              <StyledButton type="button" onClick={handleCancel}>Cancel</StyledButton>
              <StyledButton type="button" onClick={handleUpdate}>Update</StyledButton>
            </div>
            </>
          ) : (
            <>
              <StyledListItem className={classes.listItem}>
                <input 
                  type='checkbox'
                  checked={todo.isCompleted}
                  onChange={() => onCompleteTodo(todo.id)}
                />
                <span onClick={() => setIsEditing(true)}>
                  {todo.title}
                </span>
              </StyledListItem>
            </>
          )}
      </form>
    </li>
  )
}

export default TodoListItem;