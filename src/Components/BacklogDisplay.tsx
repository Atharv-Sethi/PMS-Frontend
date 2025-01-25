import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Card from "./Card"

interface BacklogItem {
  id: number
  name: string
  type: string
}

const BacklogDisplay: React.FC = () => {
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login")
    } else {
      if (!localStorage.getItem("project")) {
        navigate("/projectSelector", { replace: true })
      } else {
        const projectId = JSON.parse(localStorage.getItem("project")).id
        axios
          .get(`http://localhost:8000/api/projects/${projectId}/backlog`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            console.log(response)
            const flattenedData = flattenBacklogData(response.data)
            setBacklogItems(flattenedData)
            setIsLoading(false)
          })
          .catch((error) => {
            console.log(error)
            setError("Failed to fetch backlog data")
            setIsLoading(false)
          })
      }
    }
  }, [navigate])

  const flattenBacklogData = (data: any): BacklogItem[] => {
    const flattened: BacklogItem[] = []

    const flatten = (item: any, type: string) => {
      if (item && typeof item === "object") {
        if ("id" in item && "name" in item) {
          flattened.push({ id: item.id, name: item.name, type })
        }
        for (const key in item) {
          if (Array.isArray(item[key])) {
            item[key].forEach((subItem: any) => flatten(subItem, key.slice(0, -1)))
          } else if (typeof item[key] === "object") {
            flatten(item[key], key)
          }
        }
      }
    }

    flatten(data, "root")
    return flattened
  }

  if (isLoading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Backlog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {backlogItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} title={item.type} name={item.name} />
        ))}
      </div>
    </div>
  )
}

export default BacklogDisplay

