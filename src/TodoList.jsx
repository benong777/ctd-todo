function TodoList() {
    const todos = [
      { id: 1, title: "Review course for the week"},
      { id: 2, title: "Complete assignment"},
      { id: 3, title: "Push code to GitHub"},
    ];

    return (
      <ul>
        {todos.map((item) => <li key={item.id}>{item.title}</li>)}
      </ul>
    )
}

export default TodoList