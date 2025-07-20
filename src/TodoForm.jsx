import { useState } from 'react';

function TodoForm() {
    const [formData, setFormData] = useState('');

    function handleInputChange(event) {
        setFormData(event.target.value)
    }

    function handleFormSubmit(event) {
        // Prevents default browser refresh on submit
        event.preventDefault();
        console.log(`Your input: \n\t${formData}`);
        setFormData('');
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="todoTitle">Todo
                <input
                    id='todoTitle'
                    type='text'
                    value={formData}
                    style={{ borderRadius: 6, margin: 8 }}
                    onChange={handleInputChange}
                />
            </label>
            <button type="submit">Add Todo</button>
        </form>
    )
}

export default TodoForm;