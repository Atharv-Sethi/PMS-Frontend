import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Story {
  id: number;
  name: string;
  phase: string;
  sprint_id: number;
}

interface Sprint {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface BacklogData {
  stories: Story[];
  sprints: Sprint[];
}

const Backlog: React.FC = () => {
  const [backlog, setBacklog] = useState<BacklogData | null>(null);
  const [expandedSprints, setExpandedSprints] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const project = localStorage.getItem("project");
  const projectId = JSON.parse(project).id;
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  
    const project = localStorage.getItem("project");
    if (!project) {
      navigate("/projectSelector", { replace: true });
      return;
    }
    const projectId = JSON.parse(project).id;


    axios
      .get(`http://localhost:8000/api/projects/${projectId}/backlog`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBacklog(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch backlog data");
        setIsLoading(false);
      });
  }, [navigate]);

  const toggleSprint = (id: number) => {
    setExpandedSprints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const { draggableId, destination } = result;
    const storyId = parseInt(draggableId);
    const newSprintId = parseInt(destination.droppableId);

    if (!backlog) return;

    const updatedStories = backlog.stories.map((story) =>
      story.id === storyId ? { ...story, sprint_id: newSprintId } : story
    );

    setBacklog({ ...backlog, stories: updatedStories });

    try {
      await axios.put(
        `http://localhost:8000/api/projects/${projectId}/stories/${storyId}/move`,
        { sprint_id: newSprintId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error moving story:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const unassignedStories = backlog?.stories.filter((story) => story.sprint_id === 0) || [];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4">
        <h2 className="text-lg font-bold">Backlog</h2>

        {/* Unassigned Stories */}
        <Droppable droppableId="0">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="p-2 border rounded">
              <h3 className="font-bold">Unassigned Stories</h3>
              {unassignedStories.map((story, index) => (
                <Draggable key={story.id} draggableId={story.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 m-2 bg-gray-100 border rounded"
                    >
                      {story.name} - {story.phase}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Sprints */}
        {backlog?.sprints.map((sprint) => {
          const sprintStories = backlog.stories.filter((story) => story.sprint_id === sprint.id);

          return (
            <div key={sprint.id} className="mt-4 p-2 border rounded">
              <button onClick={() => toggleSprint(sprint.id)} className="font-bold w-full text-left">
                {sprint.name} ({sprint.status})
              </button>
              {expandedSprints[sprint.id] && (
                <Droppable droppableId={sprint.id.toString()}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="mt-2">
                      {sprintStories.map((story, index) => (
                        <Draggable key={story.id} draggableId={story.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-2 m-2 bg-gray-100 border rounded"
                            >
                              {story.name} - {story.phase}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Backlog;
