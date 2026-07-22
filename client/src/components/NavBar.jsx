import { Link } from "react-router-dom";
import axios from "axios";
import { useFiles } from "../context/useFiles";
const NavBar = () => {
  const { setFiles }  = useFiles();
 
  const handleDeleteAll = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.delete("/api/file/remove-all/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(response.data.success) {
       console.log("All Files are Deleted")
    }

    setFiles([])
  };

  return (
    <div className="navbar bg-base-200 outline-1 outline-[#ffffff]">
      <div className="ps-4">
        <a className="text-lg font-bold">📁 My Files</a>
      </div>
      <div className="flex grow justify-end px-2">
        <div className="flex items-stretch">
          <a className="btn btn-ghost rounded-field" onClick={handleDeleteAll}>Delete All</a>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-field"
            >
              <Link
                to="/logout"
                className=" font-semibold text-right text-red-300"
              >
                LogOut
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
