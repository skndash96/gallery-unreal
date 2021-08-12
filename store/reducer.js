export default (state, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        logged: true,
        user: action.payload,
      }
    case 'LOG_OUT':
      return {
        ...state,
        logged: false,
        user: null,
      }
    default:
      return state
  }
}