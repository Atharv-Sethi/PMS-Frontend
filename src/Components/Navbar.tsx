// Navbar.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Plus,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           className = "",
                                           ...props
                                       }) => (
    <button className={`px-4 py-2 rounded ${className}`} {...props}>
        {children}
    </button>
);

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => (
    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
        {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl font-bold">
                {fallback}
            </div>
        )}
    </div>
);

interface NavItem {
    icon: LucideIcon;
    label: string;
    link: string;
}



const Navbar: React.FC = () => {
    const [userData, setUserData] = useState<string | null>(null);



    useEffect(() => {
        // Fetch user data
        axios
                .get("http://localhost:8000/api/user", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then((response) => {
                  console.log(response);
                  setUserData(response.data.name);
                  console.log(response.data.name);
                })
                .catch((error) => {
                  console.error("Error fetching user data:", error);
                });
    }, []);

    function Logout() {
        console.log(`Bearer ${localStorage.getItem("token")}`);
        axios
            .post(
                "http://localhost:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            });
    }
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const navigate = useNavigate();
    const navItems: NavItem[] = [
        { icon: Home, label: "Project Selector", link:"/projectSelector" },
        { icon: Plus, label: "Create", link:"/create" },
        { icon: Users, label: "Team", link:"" },
        { icon: Settings, label: "Settings", link:"" },
        { icon: HelpCircle, label: "Help", link:"" },
    ];
    function handleNavbar(link:string){
        switch(link){
            case "/projectSelector":
                localStorage.removeItem("project")
                console.log("Project removed")
                navigate(link,{replace:true})
                break;
            case "/create":
                navigate(link,{replace:true})
                break;
        }


    }
    return (
        <>
            <aside
                className={`flex flex-col bg-gray-800 text-white transition-all duration-300 h-dvh ${
                    collapsed ? "w-16 lg:w-20" : "w-64 lg:w-72"
                }`}
            >
                <div className="flex items-center justify-between p-4">
                    {!collapsed && <h2 className="text-xl font-bold">PMS</h2>}
                    <Button
                        className="text-white hover:bg-gray-700 p-2"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-6 w-6"/>
                        ) : (
                            <ChevronLeft className="h-6 w-6"/>
                        )}
                    </Button>
                </div>
                <div className="flex items-center p-4 border-b border-gray-700">
                    <Avatar src="/placeholder.svg" alt="User Avatar" fallback="JD"/>
                    {!collapsed && (
                        <div className="ml-3">
                            <h3 className="font-semibold">
                                {userData ? `Hello, ${userData}` : "Loading..."}
                            </h3>
                        </div>
                    )}
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Button
                                    className={`w-full text-left hover:bg-gray-700 transition-colors ${
                                        collapsed ? "px-2 py-3" : "px-4 py-2"
                                    }`}
                                   onClick={()=>{handleNavbar(item.link)}}
                                >
                                    <div className="flex items-center">
                                        <item.icon
                                            className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`}
                                        />
                                        {!collapsed && (
                                            <span className="text-sm">{item.label}</span>
                                        )}
                                    </div>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <Button
                        onClick={Logout}
                        className={`w-full text-left hover:bg-gray-700 transition-colors ${
                            collapsed ? "px-2 py-3" : "px-4 py-2"
                        }`}
                    >
                        <div className="flex items-center">
                            <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`}/>
                            {!collapsed && <span className="text-sm">Logout</span>}
                        </div>
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
