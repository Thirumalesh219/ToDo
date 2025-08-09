import { BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import Todo from './components/Todo'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/todo' element={<Todo></Todo>} />
        <Route></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
