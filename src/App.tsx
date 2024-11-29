import Login from "./Components/Login"
import ProjectSelector from "./Components/ProjectSelector.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Dashboard} from "./Components/Dashboard.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/projectSelector" element={localStorage.getItem("token")? <ProjectSelector/> : <Login/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
