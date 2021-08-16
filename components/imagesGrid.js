import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import ImageCard from "./imageCard";
import { bucket, db } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'

export default function images() {
  const dispatch = useDispatch()
  const {user, images} = useSelector(state => state)
  
  const [screenWidth, setScreenWidth] = useState(null);
  const [moving, setMoving] = useState(null);
  
  const getParams = (event) => {
    event.stopPropagation();
    event.preventDefault();

    let clientX, clientY;
    clientX = event.changedTouches[0].clientX;
    clientY = event.changedTouches[0].clientY;

    const { x, y, width, height } = moving?.getBoundingClientRect() || {};
    const maxX = x + width / 2 + 25;
    const maxY = y + height / 2 + 25;
    const minX = x + width / 2 - 25;
    const minY = y + height / 2 - 25;

    const isInBin = !moving
      ? false
      : clientX > minX && clientX < maxX && clientY > minY && clientY < maxY
      ? true
      : false;

    return {
      clientX,
      clientY,
      isInBin,
    };
  };

  const handlePick = (event) => {
    const { clientX, clientY } = getParams(event);

    const elems = document.elementsFromPoint(clientX, clientY);
    
    if (elems[1].firstChild.src) setMoving(elems[1]);

    return;
  };

  const handleMove = (event) => {
    if (!moving) return
    
    const { isInBin } = getParams(event);

    moving.querySelector("div").classList.remove("redBin", "activeBin");
    moving.querySelector("div").classList.add(isInBin ? "redBin" : "activeBin");

    return;
  };

  const handleDrop = (event) => {
    if (!moving) return
    
    const { isInBin } = getParams(event);
    
    const imageURL = moving.querySelector("img").src
    
    if (isInBin) {
      //TODO: delete from db
      if (user) {
        if (!window.confirm("Confirm Delete?")) return
        
        db.collection('users').doc(user.uid).get()
        .then(doc => {
          const images = doc.data().images.slice()
          const imageName = imageURL.split('?')[0].split('%2F').slice().pop()
          const imageIndex = images.indexOf(imageURL)
          
          images.splice(imageIndex, 1)
          
          db.collection('users').doc(user.uid).set({
            images: images
          }, { merge: true })
          .then(() => {
            bucket.ref().child(`${user.uid}/${imageName}`).delete().then(() => {
              dispatch({
                type: 'SET_IMAGES',
                payload: images
              })
            })
          })
          .catch((error) => {
            console.error(error)
          })
        })
        .catch((error) => {
          console.error(error)
        })
      }
    }

    moving.querySelector("div").classList.remove("redBin", "activeBin");

    setMoving(null);

    return;
  };

  useEffect(() => {
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));

    setScreenWidth(window.innerWidth);
  }, []);

  const isMediumScreen = () => screenWidth >= 640;

  return (
    <ImagesContainer
      onTouchStart={handlePick}
      onTouchMove={handleMove}
      onTouchEnd={handleDrop}
    >
      {isMediumScreen()
        ? [
            <ImagesCol width={"33vw"} key={3}>
              {images.slice((2 * images.length) / 3).map((image) => {
                return <ImageCard src={image} />;
              })}
            </ImagesCol>,
            <ImagesCol width={"33vw"} key={2}>
              {images
                .slice(images.length / 3, (2 * images.length) / 3)
                .map((image) => {
                  return <ImageCard src={image} />;
                })}
            </ImagesCol>,
            <ImagesCol width={"33vw"} key={1}>
              {images.slice(0, images.length / 3).map((image) => {
                return <ImageCard src={image} />;
              })}
            </ImagesCol>,
          ]
        : [
            <ImagesCol key={2}>
              {images.slice(images.length / 2).map((image) => {
                return <ImageCard src={image} />;
              })}
            </ImagesCol>,
            <ImagesCol key={1}>
              {images.slice(0, images.length / 2).map((image) => {
                return <ImageCard src={image} />;
              })}
            </ImagesCol>,
          ]}
    </ImagesContainer>
  );
}

const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #111;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(33vw, 1fr));
`;
const ImagesCol = styled.div`
  position: relative;
  max-width: ${(props) => props.width};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
