//TODO: Right now only the sprints are fetched and rendered but no stories are bring fetched the table is just static and is not getting populated. b
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
  const [sprints, setSprints] = useState<Sprint[]>([]); // State to store sprints

  useEffect(() => {
    // Redirect to login if no token is found
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    // Redirect to project selector if no project is selected
    if (!localStorage.getItem("project")) {
      navigate("/projectSelector", { replace: true });
      return;
    }

    // Fetch sprints for the selected project
    const projectId = JSON.parse(localStorage.getItem("project")!).id;
    axios
      .get(`http://localhost:8000/api/projects/${projectId}/sprints/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setSprints(response.data); // Store the fetched sprints in state
      })
      .catch((error) => {
        console.error("Error fetching sprints:", error);
      });
  }, [navigate]);

  // Filter out sprints with status "Not Started"
  const filteredSprints = sprints.filter(
    (sprint) => sprint.status !== "Not Started"
  );

  return (
    <div>
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

            {/* Static Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Ready</th>
                  <th style={tableHeaderStyle}>In Progress</th>
                  <th style={tableHeaderStyle}>In QA Testing</th>
                  <th style={tableHeaderStyle}>PO Review</th>
                  <th style={tableHeaderStyle}>Complete/Done</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tableCellStyle}></td>
                  <td style={tableCellStyle}></td>
                  <td style={tableCellStyle}></td>
                  <td style={tableCellStyle}></td>
                  <td style={tableCellStyle}></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No sprints available.</p>
      )}
    </div>
  );
}

export default Sprint;