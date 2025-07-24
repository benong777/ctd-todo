function TodoList() {
    const todos = [
      { id: 1, title: "Review resources"},
      { id: 2, title: "Take notes"},
      { id: 3, title: "Code out app"},
    ];

    return (
      <ul>
        {todos.map((item) => <li key={item.id}>{item.title}</li>)}
      </ul>
    )
}

export default TodoList