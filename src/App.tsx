import { useState } from 'react'
import VisitorGatepass from './components/visitorGatepass/VisitorGatepassColorful'
import ToDo from "./components/todo/ToDO"
import SchoolGallery from "./components/schoolGallery/SchoolGallery"
import './App.css'
import SchoolLibrary from "./components/school library/SchoolLibrary"
import ClassMeet from "./components/classMeet/ClassMeet"
import CashlessCanteen from "./components/cashlessCanteen/CashlessCanteen"
import MarksheetResult from "./components/marksheeetResult/MarksheetResult"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        
      <ClassMeet
       />
    </>
  )
}

export default App
