import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Backlog = () => {
  const [backlog, setBacklog] = useState<{ stories: any[]; sprints: any[] } | null>(null);
  const [draggedStory, setDraggedStory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSprint, setNewSprint] = useState({ name: "", start_date: "", end_date: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const projectId = JSON.parse(localStorage.getItem("project")).id;
    axios
      .get(`http://localhost:8000/api/projects/${projectId}/backlog`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setBacklog(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching backlog:", error);
      });
  }, []);

  const handleDragStart = (storyId: number) => {
    setDraggedStory(storyId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (sprintId: number) => {
    if (draggedStory === null || backlog === null) return;

    const updatedStories = backlog.stories.map((story) =>
      story.id === draggedStory ? { ...story, sprint_id: sprintId } : story
    );
    setBacklog({ ...backlog, stories: updatedStories });

    try {
      await axios.put(
        `http://localhost:8000/api/stories/${draggedStory}/move`,
        { sprint_id: sprintId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (error) {
      console.error("❌ Error moving story:", error);
    }

    setDraggedStory(null);
  };

  const handleViewDetails = (story: any) => {
    sessionStorage.setItem("story", JSON.stringify(story));
    window.open(`/story/${story.id}`, "_blank");
  };

  const handleAddSprint = async () => {
    if (!newSprint.name || !newSprint.start_date || !newSprint.end_date) {
      alert("All fields are required!");
      return;
    }

    try {
      const projectId = JSON.parse(localStorage.getItem("project")).id;
      const response = await axios.post(
        `http://localhost:8000/api/projects/${projectId}/sprints`,
        newSprint,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setBacklog((prev) => (prev ? { ...prev, sprints: [...prev.sprints, response.data] } : prev));
      setIsModalOpen(false);
      setNewSprint({ name: "", start_date: "", end_date: "" });
    } catch (error) {
      console.error("❌ Error creating sprint:", error);
    }
  };

  if (!backlog) return <p>Loading...</p>;

  const StoryCard = ({ story }: { story: any }) => (
    <div
      key={story.id}
      draggable
      onDragStart={() => handleDragStart(story.id)}
      className="p-2 m-2 bg-white border rounded shadow cursor-pointer flex justify-between items-start"
    >
      <div>
        <div className="font-medium">{story.name}</div>
        <div className="text-sm text-gray-500">{story.phase}</div>
      </div>
      <button
        onClick={() => handleViewDetails(story)}
        className="text-gray-500 hover:text-black px-2"
        title="View Story Details"
      >
        ⋮
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Backlog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New Sprint
        </button>
      </div>

      {/* Unassigned Stories */}
      <div
        className="p-2 border rounded bg-gray-50 min-h-[100px]"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(0)}
      >
        <h3 className="font-bold">Unassigned Stories</h3>
        {backlog.stories.filter((story) => story.sprint_id === 0).map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Sprints */}
      <div className="col-span-2 grid grid-cols-2 gap-4">
        {backlog.sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="p-2 border rounded bg-gray-50 min-h-[100px]"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(sprint.id)}
          >
            <h3 className="font-bold">{sprint.name}</h3>
            {backlog.stories
              .filter((story) => story.sprint_id === sprint.id)
              .map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold">Create New Sprint</h2>
            <input
              type="text"
              placeholder="Sprint Name"
              className="w-full p-2 border rounded mt-2"
              value={newSprint.name}
              onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
            />
            <input
              type="date"
              className="w-full p-2 border rounded mt-2"
              value={newSprint.start_date}
              onChange={(e) => setNewSprint({ ...newSprint, start_date: e.target.value })}
            />
            <input
              type="date"
              className="w-full p-2 border rounded mt-2"
              value={newSprint.end_date}
              onChange={(e) => setNewSprint({ ...newSprint, end_date: e.target.value })}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSprint}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backlog;
