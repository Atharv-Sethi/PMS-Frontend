import {useEffect} from "react";
import {useNavigate} from "react-router";
import Navbar from "./Navbar.tsx"
import "../CSS/dashboard.css"


export function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem("token")){
            navigate("/login");
        }
        else {
            if (!localStorage.getItem("project")) {
                navigate("/projectSelector", {replace: true});
            } else {
                console.log("Got the project");
                console.log(JSON.parse(localStorage.getItem("project")));
                const project:object = JSON.parse(localStorage.getItem("project"));
                console.log(localStorage.getItem("token"));
            }
        }

    }, []);
    return (
        <>
            <Navbar />
        </>
    );
}