import styled, { createGlobalStyle, css } from 'styled-components'

const sizes = {
  medium: '768px', //handhelds
  large: '992px', //tabs and pcs
}
export const media = Object.keys(sizes).reduce((all, key) => {
  all[key] = (...args) => {
    return`
      @media screen and (min-width: ${sizes[key]}) {
        ${css(...args)}
      }
    `
  }
  return all
}, {})

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    transform: all 0.2s ease;
    box-sizing: border-box;
  }
  html {
    font-size: 2.rem;
    ${media.medium`font-size: 3.5rem`}
  }
`
