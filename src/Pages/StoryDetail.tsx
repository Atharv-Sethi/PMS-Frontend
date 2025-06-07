import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  replies: Comment[];
  parent_id: number | null;
}

interface Props {
  storyId: number;
}

const StoryDetail: React.FC<Props> = ({ storyId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/stories/${storyId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const postComment = async (parentId: number | null) => {
    if (
      (parentId === null && newComment.trim() === "") ||
      (parentId !== null && (!replyInputs[parentId] || replyInputs[parentId].trim() === ""))
    ) {
      alert("Content is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const content = parentId === null ? newComment : replyInputs[parentId];
      await axios.post(
        `http://localhost:8000/api/stories/${storyId}/comments`,
        {
          content,
          parent_id: parentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Clear inputs
      if (parentId === null) setNewComment("");
      else setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
      fetchComments();
      if (parentId !== null) {
        setOpenReplies((prev) => ({ ...prev, [parentId]: true }));
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const toggleReplies = (commentId: number) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Render a single comment with nested replies recursively
  const renderComment = (comment: Comment, level = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isOpen = openReplies[comment.id] || false;

    return (
      <div
        key={comment.id}
        style={{
          marginLeft: level * 20,
          borderLeft: "2px solid #ddd",
          paddingLeft: 15,
          marginTop: 15,
          backgroundColor: "#fafafa",
          borderRadius: 6,
          paddingBottom: 10,
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 14 }}>
          {comment.user.name} &nbsp;
          <span style={{ fontWeight: "normal", fontSize: 12, color: "#666" }}>
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <div style={{ margin: "8px 0", fontSize: 15 }}>{comment.content}</div>

        {/* Reply input and button aligned right */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyInputs[comment.id] || ""}
            onChange={(e) =>
              setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))
            }
            style={{
              flexGrow: 1,
              maxWidth: 400,
              padding: "6px 10px",
              fontSize: 14,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => postComment(comment.id)}
            style={{
              padding: "6px 12px",
              fontSize: 14,
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Reply
          </button>
        </div>

        {/* Show replies toggle */}
        {hasReplies && (
          <button
            onClick={() => toggleReplies(comment.id)}
            style={{
              fontSize: 13,
              color: "#007bff",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 8,
              paddingLeft: 0,
            }}
          >
            {isOpen
              ? `Hide Replies (${comment.replies.length})`
              : `Show Replies (${comment.replies.length})`}
          </button>
        )}

        {/* Render replies recursively */}
        {isOpen &&
          comment.replies.map((reply) => renderComment(reply, level + 1))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 720, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>Story Comments</h2>

      {/* New top-level comment input */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 25,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "8px 12px",
            fontSize: 15,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={() => postComment(null)}
          style={{
            padding: "8px 20px",
            fontSize: 15,
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#777" }}>No comments yet</p>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}
    </div>
  );
};

export default StoryDetail;
