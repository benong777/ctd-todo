function TodoForm() {
    return (
        <form >
            <label htmlFor="todoTitle">Todo
                <input id='todoTitle' type='text' />
            </label>
            <button type="submit">Add Todo</button>
        </form>
    )
}

export default TodoForm;