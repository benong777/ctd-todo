import TodoListItem from "./TodoListItem";
import classes from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((item) => item.isCompleted === false);
  return (
    <div>
      {isLoading ? <p>Todo list is loading...</p> : (
        filteredTodoList.length === 0 ? (
          <p>Add todo above to get started</p>
        ) : (
          <ul className={classes.noBulletList}>
            {filteredTodoList.map((todo) => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}  />)}
          </ul>
        )
      )}
    </div>
  )
}

export default TodoList