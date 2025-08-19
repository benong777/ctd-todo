import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter((item) => item.isCompleted === false);
  return (
    <div>
      {
        filteredTodoList.length === 0 ? (
          <p>Add todo above to get started</p>
        ) : (
          <ul>
            {filteredTodoList.map((todo) => <TodoListItem key={todo.id} onCompleteTodo={onCompleteTodo} todo={todo} />)}
          </ul>
        )
      }
    </div>
  )
}

export default TodoList