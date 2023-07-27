import { Routes, Route, Navigate } from "react-router-dom";
import MemberStack from "./pages/MemberStack";
import Lndhub from "./pages/Lndhub";
import ListQuizzes from "./pages/ListQuizzes";
import CreateQuiz from "./pages/CreateQuiz";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reward from "./pages/Reward";
import Quiz from './pages/Quiz'
import './App.css'

import { isLoggedIn } from './services/credentials';

const ProtectedRoute = ({ children }) => {
  if (isLoggedIn() === false) {
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
};

function App() {
  return (
    <Routes>
      <Route path=":id" exact element={<Quiz />} />
      <Route path="/" exact element={
        <ProtectedRoute> 
          <ListQuizzes /> 
        </ProtectedRoute>} 
      />
      <Route path="/create" exact element={
        <ProtectedRoute>
         <CreateQuiz /> 
        </ProtectedRoute>
      }/>
      <Route path="/setup/lndhub" exact element={
        <ProtectedRoute>
          <Lndhub />
        </ProtectedRoute>
      } />
      <Route path="/setup/memberstack" exact element={
        <ProtectedRoute>
          <MemberStack />
        </ProtectedRoute>
      } />
      <Route path="/:id/reward" exact element={<Reward />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Signup />} />
    </Routes>
  )
}

export default App
