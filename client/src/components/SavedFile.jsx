import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FcImageFile } from "react-icons/fc";
import { Link } from "react-router-dom";
import OptionButton from "./buttons/OptionButton";
import { useFiles } from "../context/useFiles.jsx";
import NavBar from "../components/NavBar"

const SavedFile = () => {
  const { files, setFiles }  = useFiles();
  
  const count = files.length

  const location = useLocation();
  const refreshKey = location.state?.refreshKey;
  //const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    console.log("refreshkey received", refreshKey);

    const loadFiles = async () => {
      try {
        setLoading(true);
        setError("");

        
        const response = await axios.get(`${api}/file/list`, {
          withCredentials: true,
        }); 

        if (response.data.success) {
          setFiles(response.data.files);
          
        }

        
       // setCount(counted)
      } catch (error) {
        console.error("Error fetching files", error);
        setError("Failed to load files");
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, [refreshKey, setFiles]);

  const removeFile = (filePath) => {
    setFiles((prev) => 
      prev.filter((file) => file.filePath !== filePath ));
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (

    <div>
      <NavBar />
      {loading && (
          <div className="flex justify-center items-center h-screen w-screen">
            <ClipLoader
              color="blue"
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      <div className="flex justify-center items-center mt-3 mb-3">
        <span className="ml-2 mr-2 text-2xl text-[rgb(13,236,240)] font-bold ">
          Files : ({count}) 
        </span>
        
      </div>
      {files.length === 0 ? (
        <div className="flex items-center h-screen justify-center flex-col" >
        <p className="text-gray-500 text-5xl">No file found </p>
        <Link to="/home" className="mt-5 text-1xl font-bold text-[#dbddd4] border p-1 rounded-md border-blue-600 bg-[#2a2acb] ">Upload Now</Link>
        </div>
      ) : (
        <div className="space-y-2 flex flex-col items-center">
          {files.map((file) => ( 
            <div
              key={file.name}
              className="flex items-center gap-5 p-3 bg-white border rounded-lg shadow-sm w-90 h-16 md:w-150 lg:w-250"
            >
              <span className="text-2xl ">
                <FcImageFile /> 
              </span>
              <div className="flex-1 min-w-0 text-[#0808ff]">
                <p className="font-medium truncate">{file.originalname}</p>
              </div>
              <span className="mr-3"><OptionButton  key={file.id} file={file} onDelete={removeFile} 
              /></span>

             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedFile;
