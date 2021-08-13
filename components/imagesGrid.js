import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import ImageCard from './imageCard'

export default function images({ images }) {
  const [screenWidth, setScreenWidth] = useState(null)
  
  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.screen.width))
    
    setScreenWidth(window.screen.width)
  }, [])
  
  const isMediumScreen = () => screenWidth >= 640
  
  return (
    <ImagesContainer>{
      isMediumScreen()
      ? [
        <ImagesCol width={'33vw'} key={3}>
          {images.slice(2*images.length/3).map(image => {
            return (
              <ImageCard src={image} />
            )
          })}
        </ImagesCol>,
        <ImagesCol width={'33vw'} key={2}>
          {images.slice(images.length/3, 2*images.length/3).map(image => {
            return (
              <ImageCard src={image} />
            )
          })}
        </ImagesCol>,
        <ImagesCol width={'33vw'} key={1}>
          {images.slice(0, images.length/3).map(image => {
             return (
              <ImageCard src={image} />
            )
          })}
        </ImagesCol>
      ]
      : [
        <ImagesCol key={2}>
          {images.slice(images.length/2).map(image => {
            return (
              <ImageCard src={image} />
            )
          })}
        </ImagesCol>,
        <ImagesCol key={1}>
          {images.slice(0, images.length/2).map(image => {
            return (
              <ImageCard src={image}/>
            )
          })}
        </ImagesCol>
      ]
    }</ImagesContainer>
  )
}


const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #111;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(33vw, 1fr));
`
const ImagesCol = styled.div`
  position: relative;
  max-width: ${props => props.width};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`