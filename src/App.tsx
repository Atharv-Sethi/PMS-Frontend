import Login from "./Pages/Login.tsx"
import ProjectSelector from "./Pages/ProjectSelector.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Dashboard} from "./Pages/Dashboard.tsx";
import {Create} from "./Pages/Create.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/projectSelector" element={localStorage.getItem("token")? <ProjectSelector/> : <Login/>}/>
        <Route path="/create" element={localStorage.getItem("token") ? localStorage.getItem("project")? <Create/> : <ProjectSelector/> : <Login/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
