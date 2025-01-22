'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Settings, User, BarChart2, ListTodo, SmartphoneIcon as Sprint } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    
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
    function addNew(){
        navigate("/create")   
    }
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">PMS</div>
          <Input 
            className="w-64 bg-gray-700 border-gray-600 text-white" 
            placeholder="Project Name" 
            defaultValue={ JSON.parse(localStorage.getItem("project")).name}
            disabled
          />
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-gray-600 text-white hover:bg-gray-700"
            onClick={addNew}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white">
          <ScrollArea className="h-full">
            <div className="py-4">
              <nav className="space-y-2 px-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:text-gray-800 hover:bg-gray-200"
                >
                  <Sprint className="mr-2 h-4 w-4" />
                  Sprint
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:text-gray-800 hover:bg-gray-200"
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  Backlog
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:text-gray-800 hover:bg-gray-200"
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Report
                </Button>
              </nav>
            </div>
          </ScrollArea>
        </aside>
        
      </div>
    </div>
  )
}

