import './App.css'
import WebGLCanvas from './components/WebGLCanvas'

function App() {
  return (
    <>
      <h1>Fog Demo</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <WebGLCanvas width={800} height={600} />
    </>
  )
}

export default App
