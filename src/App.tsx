import './App.css'
import WebGLCanvas from './components/WebGLCanvas'
import { DisplayMath, InlineMath } from './components/ReactKatex'

function App() {
  return (
    <>
      <h1>Fog Demo</h1>
      <WebGLCanvas width={1080} height={720} />
      With the following parameters:
      <ul>
        <li><InlineMath formula='p=(p_x, p_y, p_z)' />: position</li>
        <li><InlineMath formula='h' />: base hight</li>
        <li><InlineMath formula='d' />: density</li>
        <li><InlineMath formula='f' />: fall off</li>
        <li><InlineMath formula='u' />: uniform density</li>
      </ul>
      Define the extinction cofficient by
      <DisplayMath formula="\kappa (p) = d \exp(- f(p_y - h)) + u." />
    </>
  )
}

export default App
