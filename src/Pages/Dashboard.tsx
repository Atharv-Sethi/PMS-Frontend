import {useEffect} from "react";
import {useNavigate} from "react-router";
import Navbar from "../Components/Navbar.tsx"
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

                const project:object = JSON.parse(localStorage.getItem("project"));

            }
        }

    }, []);
    return (
        <>
            <div>
            <Navbar />
            </div>
            <div>

            Hello Dashboard
            </div>
        </>
    );
}