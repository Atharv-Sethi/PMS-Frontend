// StoryDetailWrapper.tsx
import { useParams } from "react-router-dom";
import StoryDetail from "./StoryDetail";

const StoryDetailWrapper = () => {
  const { id } = useParams();
  return <StoryDetail storyId={parseInt(id)} />;
};

export default StoryDetailWrapper;