import TodoListItem from "./TodoListItem";

function TodoList() {
    const todos = [
      { id: 1, title: "Review resources"},
      { id: 2, title: "Take notes"},
      { id: 3, title: "Code out app"},
    ];

    return (
      <ul>
        {todos.map((item) => <TodoListItem key={item.id} todo={item.title} />)}
      </ul>
    )
}

export default TodoList