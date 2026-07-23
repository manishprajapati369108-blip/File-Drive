import { useState } from "react";
import DropBox from "../components/DropBox";
import { useNavigate } from "react-router-dom";

const HomeFile = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
     
      <DropBox onUploadSuccess={handleUploadSuccess} />

      <button className 
        onClick={() =>
          navigate("/saved-file", {
            state: {
              refreshKey,
            },
          })
        }
      >
        Show Uploaded files
      </button>
    </>
  );
};

export default HomeFile;
