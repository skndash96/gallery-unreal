import styled, { keyframes } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { provider, auth, db, bucket } from '../firebase'
import { media } from '../util/style'
import { FcGoogle } from 'react-icons/fc'
import { VscLoading } from 'react-icons/vsc'
import ImagesGrid from '../components/imagesGrid'

export default function Index() {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state)
  
  const [images, setImages] = useState([])
  const [toAddImages, setToAddImages] = useState([])
  const [formIsActive, setFormIsActive] = useState(true)
  const [uploadProgress, setUploadProgress] = useState([])
  const [errors, setErrors] = useState([])
  
  useEffect(() => {
    if (!user) return
    
    db.collection('users').doc(user.uid).set({
      images: images
    }, { merge: true })
  }, [images.length])
  
  //Listen for auths
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        setImages(['https://firebasestorage.googleapis.com/v0/b/gallery-app-96.appspot.com/o/CejU0o6NfzRKjoGhk4NaJwLXRhs2%2FloginToContinue.jpg?alt=media&token=41540630-437b-4080-9a74-e630803f26b3', 'https://firebasestorage.googleapis.com/v0/b/gallery-app-96.appspot.com/o/CejU0o6NfzRKjoGhk4NaJwLXRhs2%2FloginToContinue.jpg?alt=media&token=41540630-437b-4080-9a74-e630803f26b3'
        ]) //Default LoginToContinue images..
        return
      } else {
        dispatch({
          type: 'LOG_IN',
          payload: user
        })
      }
      
      db.collection('users').doc(user.uid).get()
      .then(doc => {
        const data = doc.data()
        
        if (data) {
          setImages(data.images)
        } else {
          setImages([])
          
          db.collection('users').doc(user.uid).set({
            images: []
          })
          .catch(error => {
            console.error(error)
          })
        }
      })
      .catch(error => {
        console.error(error)
      })
    })
  }, [])
  
  const addImages = async () => {
    await Promise.all(
      toAddImages.map(async (image, index, array) => {
        if (image.size > 5 * 1024 * 1024) return setErrors(array => [...array, 'File size greater than 5mb - ' + image.name])
        
          return await new Promise((resolve, reject) => {
          const destination = `${user.uid}/${image.name}`
          
          const uploadTask = bucket.ref().child(destination).put(image)
          
          uploadTask.on(
            'state_changed',
            
            null,
            
            function handleError(error)  {
              setErrors(array => [...array, 'Something went wrong while uploginStatus ' + image.name])
              reject(error)
            },
            
            function handleCompletion() {
              bucket.ref().child(destination).getDownloadURL()
              .then(url => {
                setUploadProgress(count => [(count[0]||0)+1, array.length])
                
                setImages(state => [...state, url])
                
                resolve()
              })
              .catch(error => {
                reject(error)
              })
            }
          )
        })
      })
    )
    
    document.querySelector('#addImageInput').value = ''
    setToAddImages([])
    setUploadProgress([])
  }
  
  const handleLogin = (event) => {
    event.stopPropagation()
    event.preventDefault()

    auth.signInWithPopup(provider)
    .then(({ user }) => {
      dispatch({
        type: 'LOG_IN',
        payload: user
      })
    })
    .catch(error => {
      console.error(error)
    })
  }
  
  const handleAddImageClick = (event) => {
    event.preventDefault()
    
    setErrors([])
    if (toAddImages.length) addImages()
    else setFormIsActive(state => !state)
  }
  
  return <Container>
    <LoadingScreen>
      <VscLoading />
    </LoadingScreen>
    
    <ImagesGrid images={images} onClick={(e) => user ? null : handleLogin(e)}/>
    
    <AddImageContainer hideInput={formIsActive} validInput={toAddImages.length ? true : false}>
      
      <ErrorsContainer valid={errors.length ? true : false}>
        {errors.map(error => <p> {error} </p>)}
      </ErrorsContainer>
      
      <div>
        {user
        ? <>
            <input id='addImageInput' onChange={({ target }) => setToAddImages(Array.from(target.files).filter(x => x.name))} type='file' accept='.png,.jpeg,.jpg,.svg,.webp' multiple />
            <label id='addImageLabel'> {toAddImages.length ? `${toAddImages.length} images` : 'Browse files'} </label>
          </>
        : <button onClick={handleLogin}>
          <FcGoogle />
          Continue with Google
        </button>
        }
      </div>
      
      <button id='addImageButton' onClick={handleAddImageClick}>
        {uploadProgress.length ? `${uploadProgress[0]}/${uploadProgress[1]}` : <FaPlus />}
      </button>
    </AddImageContainer>
  </Container>
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
`

const LoadingScreen = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${props => props.isLoading ? 'grid' : 'none'};
  place-items: center;
  background-color: rgba(255, 255, 255, 0.75);
  & svg {
    transform: translateY(-100%);
    font-size: 3rem;
    animation: 2s linear infinite ${keyframes`
      to {transform: rotate(360deg)}
    `}; 
  }
`

const AddImageContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.hideInput ? 'none' : '#d54a4a'};
  color: white;
  
  & div {
    & input {
      opacity: 0;
    }
    & label {
      font-size: 0.75rem;
      padding: 0.2rem;
      background-color: #f5f2be;
      color: #d54a4a;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      display: block;
      width: 35vw;
      text-align: center;
      position: absolute;
      bottom: 0.75rem;
      left: 1rem;
      z-index: -1;
    }
    & button {
      padding: 0.2rem 0.5rem;
      border: none;
      border-radius: 10px;
    }
    & svg {
      transform: translateY(2px);
      margin-right: 0.25rem;
    }
  }
  
  & > * {
    display: ${props => props.hideInput ? 'none' : 'block'};
  }
  
  & #addImageButton {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    padding: 0.4rem;
    border: none;
    background-color: ${props => 
      props.hideInput
      ? '#fff'
      : props.validInput
      ? '#5ca153'
      : '#d54a4a'
    };
    color: ${props => props.hideInput ? '#d54a4a' : '#fff'};
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    & svg {
      font-size: 1.25rem;
    }
    &:hover {
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)
    }
  }
`

const ErrorsContainer = styled.div`
  display: ${props => props.valid ? 'block' : 'none'};
  padding: 0.2rem;
  background-color: #dd3333;
  color: #fff;
  border-radius: 5%;
  margin: 0.5rem 0;
  & p {
    font-size: 0.75rem;
  }
`