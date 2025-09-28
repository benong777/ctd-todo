export const initialState = {
  todoList: [],
  isLoading: false,
  errorMsg: '',
  isSaving: false
};

// export const actions = {
//   SET_TODOLIST: 'SET_TODOLIST',
//   SET_LOADING: 'SET_LOADING',
//   SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
//   SET_SAVING: 'SET_SAVING',
// }

export const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

export function reducer(state=initialState, action) {
  switch(action.type) {
    case actions.fetchTodos: 
      return { ...state };
    case actions.loadTodos:
      return { ...state };
    case actions.setLoadError:
      return { ...state };
    case actions.startRequest:
      return { ...state };
    case actions.addTodo:
      return { ...state };
    case actions.endRequest:
      return { ...state };
    case actions.updateTodo:
      return { ...state };
    case actions.completeTodo:
      return { ...state };
    case actions.revertTodo:
      return { ...state };
    case actions.clearError:
      return { ...state };
    default:
      return { ...state };
  }
};

// export function reducer(state=initialState, action){
//   switch(action.type) {
//     case actions.SET_TODOLIST:
//       return { ...state, todoList: action.payload };
//     case actions.SET_LOADING:
//       return { ...state, isLoading: action.payload };
//     case actions.SET_ERROR_MESSAGE:
//       return { ...state, errorMsg: action.payload};
//     case actions.SET_SAVING:
//       return { ...state, isSaving: action.payload};
//     default:
//       return state; 
//   }
// }