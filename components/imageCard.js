import styled from 'styled-components'
import { MdDelete } from 'react-icons/md'

export default function ImageCard({ src }) {
  return (
    <Card>
      <img src={src}/>
      <div>
        <MdDelete />
      </div>
    </Card>
  )
}

const Card = styled.div`
  margin: 0.5rem;
  position: relative;
  max-width: 100%;
  & img {
    border-radius: 0.5rem;
    max-width: 100%;
  }
  & div {
    opacity: 0;
    display: grid;
    position: absolute;
    top:0;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    place-items: center;
    & svg {
      font-size: 2rem;
    }
  }
  .activeBin {
    opacity: 1;
  }
  .redBin {
    opacity: 1;
    color: #f22;
  }
`