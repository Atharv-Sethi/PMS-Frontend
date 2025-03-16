import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the type for a Sprint
type Sprint = {
  id: number;
  name: string;
  project_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  status: string;
};

// Define the type for a Story
type Story = {
  id: number;
  name: string;
  phase: string;
  sprint_id: number;
  epic_id: number; // Add epic_id to the Story type
  initiative_id: number; // Add initiative_id to the Story type
  theme_id: number; // Add theme_id to the Story type
};

// Inline styles for the table
const tableHeaderStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f4f4f4",
  textAlign: "left",
};

const tableCellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

// Inline styles for the card
const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "16px",
  margin: "16px 0",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

function Sprint() {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [stories, setStories] = useState<{ [key: number]: Story[] }>({});

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!localStorage.getItem("project")) {
      navigate("/projectSelector", { replace: true });
      return;
    }

    const projectId = JSON.parse(localStorage.getItem("project")!).id;
    axios
      .get(`http://localhost:8000/api/projects/${projectId}/sprints/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Fetched sprints:", response.data);
        setSprints(response.data);
        response.data.forEach((sprint: Sprint) => fetchStories(sprint.id));
      })
      .catch((error) => {
        console.error("Error fetching sprints:", error);
      });
  }, [navigate]);

  // Fetch stories for a specific sprint
  function fetchStories(sprintId: number) {
    if (!localStorage.getItem("project")) {
      navigate("/projectSelector", { replace: true });
      return;
    }

    const projectId = JSON.parse(localStorage.getItem("project")!).id;
    axios
      .get(`http://localhost:8000/api/projects/${projectId}/sprints/${sprintId}/stories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Fetched stories for sprint", sprintId, ":", response.data);
        setStories((prevStories) => ({
          ...prevStories,
          [sprintId]: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching stories:", error);
      });
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, storyId: number) => {
    e.dataTransfer.setData("storyId", storyId.toString());
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent, sprintId: number, newPhase: string) => {
    e.preventDefault();
    const storyId = parseInt(e.dataTransfer.getData("storyId"));

    // Find the story being dragged
    const story = stories[sprintId].find((s) => s.id === storyId);
    if (!story) return;

    // Extract theme_id, initiative_id, and epic_id from the story
    const { theme_id, initiative_id, epic_id } = story;

    // Update the story phase using the correct nested route
    try {
      const projectId = JSON.parse(localStorage.getItem("project")!).id;
      await axios.put(
        `http://localhost:8000/api/projects/${projectId}/themes/${theme_id}/initiatives/${initiative_id}/epics/${epic_id}/stories/${storyId}`,
        { phase: newPhase },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the local state
      setStories((prevStories) => ({
        ...prevStories,
        [sprintId]: prevStories[sprintId].map((s) =>
          s.id === storyId ? { ...s, phase: newPhase } : s
        ),
      }));
    } catch (error) {
      console.error("Error updating story phase:", error);
    }
  };

  // Filter out sprints with status "Not Started"
  const filteredSprints = sprints.filter(
    (sprint) => sprint.status !== "Not Started"
  );

  return (
    <>
      <h1>Sprints</h1>
      {filteredSprints.length > 0 ? (
        filteredSprints.map((sprint) => (
          <div key={sprint.id} className="card" style={cardStyle}>
            <h3>{sprint.name}</h3>
            <p>
              <strong>Start Date:</strong> {sprint.start_date}
            </p>
            <p>
              <strong>End Date:</strong> {sprint.end_date}
            </p>
            <p>
              <strong>Status:</strong> {sprint.status}
            </p>

            {/* Dynamic Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "16px",
              }}
            >
              <thead>
                <tr>
                  {["Todo", "Ready", "In Progress", "In QA Testing", "PO Review", "Complete/Done"].map((phase) => (
                    <th key={phase} style={tableHeaderStyle}>
                      {phase}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {["Todo", "Ready", "In Progress", "In QA Testing", "PO Review", "Complete/Done"].map((phase) => (
                    <td
                      key={phase}
                      style={tableCellStyle}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, sprint.id, phase)}
                    >
                      {stories[sprint.id] ? (
                        stories[sprint.id]
                          .filter((story) => story.phase === phase)
                          .map((story) => (
                            <div
                              key={story.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, story.id)}
                              style={{
                                padding: "8px",
                                margin: "4px 0",
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                cursor: "move",
                              }}
                            >
                              {story.name}
                            </div>
                          ))
                      ) : (
                        <div>No stories found for this phase.</div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No sprints available.</p>
      )}
    </>
  );
}

export default Sprint;