import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = todoList.filter((item) => item.isCompleted === false);
  return (
    <div>
      { filteredTodoList.length === 0 ? (
          <p>Add todo above to get started</p>
        ) : (
          <ul>
            {filteredTodoList.map((todo) => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}  />)}
          </ul>
      )}
    </div>
  )
}

export default TodoList