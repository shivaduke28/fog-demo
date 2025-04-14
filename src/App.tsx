import { Dispatch, SetStateAction, useState } from 'react';
import './App.css'
import WebGLCanvas from './components/WebGLCanvas'

const resolustions = [
  256, 512, 720, 1080, 1440, 2160, 3840
]

const updateResolution = (id: string, value: number, dispatch: Dispatch<SetStateAction<number>>) => {
  return (
    <div>
      <label htmlFor={id}>{id}: </label>
      <select id={id} value={value} onChange={(e) => {
        const value = parseInt(e.target.value);
        dispatch(value);
      }}>
        {resolustions.map((resolution) => (
          <option value={resolution} key={resolution}>
            {resolution}
          </option>
        ))}
      </select>
    </div>
  )
}

function App() {
  const [width, updateWidth] = useState(1080);
  const [height, updateHeight] = useState(720);

  return (
    <>
      <h1>Fog Demo</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        {updateResolution("width", width, updateWidth)}
        {updateResolution("height", height, updateHeight)}
      </div>
      <WebGLCanvas width={width} height={height} />
    </>
  )
}

export default App
