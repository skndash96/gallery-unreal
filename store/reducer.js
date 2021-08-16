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
    case 'ADD_IMAGES':
      return {
        ...state,
        images: [...state.images, ...action.payload]
      }
    case 'SET_IMAGES':
      return {
        ...state,
        images: action.payload
      }
    default:
      return state
  }
}