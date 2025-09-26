import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from 'styled-components';
import { StyledButton } from "../components/styles/Button.styles";

function TodoForm({ onAddTodo, isSaving }) {
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
      <TextInputWithLabel
        elementId={'todoTitle'}
        labelText={'Todo'}
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value) }
      />

      <StyledButton
        type="submit"
        disabled={workingTodoTitle.trim() === ''}
        >{isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </form>
  )
}

export default TodoForm;