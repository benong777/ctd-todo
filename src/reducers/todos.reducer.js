export const initialState = {
  todoList: [],
  isLoading: false,
  errorMsg: '',
  isSaving: false
};

export const actions = {
  SET_TODOLIST: 'SET_TODOLIST',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  SET_SAVING: 'SET_SAVING',
}

export function reducer(state=initialState, action){
  switch(action.type) {
    case actions.SET_TODOLIST:
      return { ...state, todoList: action.payload };
    case actions.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actions.SET_ERROR_MESSAGE:
      return { ...state, errorMsg: action.payload};
    case actions.SET_SAVING:
      return { ...state, isSaving: action.payload};
    default:
      return state; 
  }
}