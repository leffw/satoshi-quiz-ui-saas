import { Routes, Route } from "react-router-dom";
import Quiz from './pages/Quiz'
import Reward from "./pages/Reward";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path=":classroom" element={<Quiz />} />
      <Route path="/reward" exact element={<Reward />} />
    </Routes>
  )
}

export default App
