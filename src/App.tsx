import { useState } from 'react'
import VisitorGatepass from './components/visitorGatepass/VisitorGatepassColorful'
import ToDo from "./components/todo/ToDO"
import SchoolGallery from "./components/schoolGallery/SchoolGallery"
import './App.css'
import SchoolLibrary from "./components/school library/SchoolLibrary"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SchoolLibrary
       />
    </>
  )
}

export default App
