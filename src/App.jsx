import './App.css'

function App() {
  const todos = [
    { id: 1, title: "Review course for the week"},
    { id: 2, title: "Complete assignment"},
    { id: 3, title: "Push code to GitHub"},
  ];

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.map((item) => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  )
}

export default App
