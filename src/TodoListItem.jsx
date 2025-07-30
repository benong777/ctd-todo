
function TodoListItem ({ todo }) {
    console.log('Title:', todo);
    return (
        <li>{todo}</li>
    )
}

export default TodoListItem;