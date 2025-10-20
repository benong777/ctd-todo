export const initialState = {
  todoList: [],
  isLoading: false,
  errorMsg: '',
  isSaving: false
};

export const actions = {
    //-- Load Todos (in useEffect)
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //-- Handle failed requests (in useEffect and addTodo)
    setLoadError: 'setLoadError',
    //-- addTodos actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //-- Reverts todos when requests fail
    revertTodo: 'revertTodo',
    //-- Dismiss Error button
    clearError: 'clearError',
};

export function reducer(state=initialState, action) {
  switch(action.type) {
    case actions.fetchTodos: 
      return { ...state, isLoading: true, errorMsg: '' };
    case actions.loadTodos:
      return { ...state, todoList: action.payload, isLoading: false, errorMsg: '' };
    case actions.setLoadError:
      return { ...state, isLoading: false, errorMsg: action.payload };
    case actions.startRequest:
      return { ...state, isSaving: true, errorMsg: '' };

    case actions.addTodo:
      return { ...state, todoList: [...state.todoList, action.payload], errorMsg: '' };
    case actions.endRequest:
      return { ...state, isSaving: false };

    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map(todo => {
          return todo.id === action.payload.id ? { ...action.payload } : todo;
        }),
        errorMsg: ''
      };

    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          return (todo.id === action.payload) ? {...todo, isCompleted: true } : todo;
        }),
        errorMsg: ''
      };

    case actions.revertTodo:
      if (typeof action.payload === 'object') {
        //-- Revert entire todo object (for updateTodo revert)
        return {
          ...state,
          todoList: state.todoList.map((todo) => {
            return (todo.id === action.payload.id) ?  {...action.payload} : todo
          }),
        };
      } else {
        //-- Revert only isCompleted field (for completeTodo revert)
        return {
          ...state,
          todoList: state.todoList.map((todo) => {
            return (todo.id === action.payload) ?  { ...todo, isCompleted: false } : todo
          }),
        };
      }

    //-- Dismiss error button
    case actions.clearError:
      return { ...state, errorMsg: '' };
    default:
      return state;
  }
};