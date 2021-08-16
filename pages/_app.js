import { Provider } from 'react-redux'
import { useStore } from '../store/store'
import { GlobalStyle } from '../util/style'

export default function App({ Component, pageProps }) {
  const store = useStore()

  return (
    <Provider store={store}>
      <GlobalStyle />
      <Component {...pageProps} />
    </Provider>
  )
}