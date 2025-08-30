import { useState } from 'react'
import VisitorGatepass from './components/visitorGatepass/VisitorGatepassColorful'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <VisitorGatepass />
    </>
  )
}

export default App
