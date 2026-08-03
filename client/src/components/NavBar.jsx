import axios from "axios";
import { useFiles } from "../context/useFiles";
import { useNavigate } from "react-router-dom";
import { GrAddCircle } from "react-icons/gr";
import Logout from "../pages/logout";

const NavBar = () => {
  const { setFiles } = useFiles();
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete(`${api}/file/remove-all/`, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("All Files are Deleted");
      }

      setFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar outline-1 outline-[#ffffff] bg-blue-700 rounded">
      <div className="ps-4 flex items-center">
        <a className="text-lg font-bold">📁 My Files </a>
        <span className="ml-3">
          {" "}
          <GrAddCircle
            className="size-6"
            onClick={() => {
              navigate("/home");
            }}
          />{" "}
        </span>
      </div>
      <div className="flex grow justify-end px-2">
        <div className="flex items-stretch">
          <a className="btn btn-ghost rounded-field" onClick={handleDeleteAll}>
            Delete All
          </a>

         { /*if Inside the button or div as working as button btn like below then
          
           button or component inside that button wiil not work or functioning*/}
          <div className="btn btn-ghost rounded-field dropdown dropdown-end">
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
