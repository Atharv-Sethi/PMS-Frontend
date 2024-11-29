import axios from "axios";
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router";



function ProjectSelector() {

  const [projects,setProjects] = useState([]);
  const navigate = useNavigate();



  console.log(localStorage.getItem("token"));

  useEffect(() => {


    axios.get("http://localhost:8000/api/projects", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
        .then((response)=>{
          console.log(response);
          setProjects(response.data)

        })
        .catch((error)=>{
          console.log(error)
        })
  }, []);


    const projectSelect = (id: number) => {
        axios
            .get(`http://localhost:8000/api/projects/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                console.log(response);
                localStorage.setItem("project",JSON.stringify(response.data))
                console.log(JSON.parse(localStorage.getItem("project")));
                console.log("project selected")
                navigate('/dashboard', { replace: true });

            })
            .catch((error) => {
                console.error("Error selecting project:", error);
            });
    };

    return (
      <>
        <div className="flex h-screen">

          <main className="flex-1 p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
            Please Select a Project to work on:
              <br/>
              {projects.map((project:Array<string>|Array<number>) => (
                  <>

                      <button onClick={() => projectSelect(project.id)} data-id={project.id}>{project.name}</button>
                      <br/>

                  </>
              ))}

          </main>
        </div>
      </>
  );
}

export default ProjectSelector;
