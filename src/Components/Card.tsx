import type React from "react"

interface CardProps {
  title: string
  name: string
}

const Card: React.FC<CardProps> = ({ title, name }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2 capitalize">{title}</h2>
      <p>{name}</p>
    </div>
  )
}

export default Card

