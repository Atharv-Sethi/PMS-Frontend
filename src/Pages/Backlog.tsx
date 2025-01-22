import axios from "axios"
import { useEffect, useState } from "react"
useState

function Backlog() {
    const backlogItems = []
    const project = JSON.parse(localStorage.getItem('project') || '{}');
    const projectId = project.id;
    const token = localStorage.getItem("token")
   
    const fetchThemes = async () => {
        
        try {
            const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/themes`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
            backlogItems.push(response.data)
        } catch (err) {
           console.log("err")
        }
        
    };

//TODO: make a fnc in backend to combine everything and fetch form one api instead of doing this 
//Progress til now is just a theme function is amde fetching all themes of project but this is not a good idea
    useEffect(()=>{

    },[]     
    )

  return (
    <div>Backlog</div>
  )
}

export default Backlog