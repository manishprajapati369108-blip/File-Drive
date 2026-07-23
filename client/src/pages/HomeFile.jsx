import { useState } from "react";
import DropBox from "../components/DropBox";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"

const HomeFile = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
    <NavBar />
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-100 px-4">

      
      
      <DropBox onUploadSuccess={handleUploadSuccess} />

      <button
        onClick={() =>
          navigate("/saved-file", {
            state: { refreshKey },
          })
        }
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-200"
      >
        Show Uploaded Files
      </button>
    </div>
    </>
  );
};


export default HomeFile;