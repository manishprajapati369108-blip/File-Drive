import { createContext, useState } from "react";


//this goes to that palce where we want get the things to use it (in this function we saved the state)
const FileContext = createContext();

//The provider uses the value to make data available to all of its children.
 const FileProvider = ({ children }) => {
    

  const [files, setFiles] = useState([]);

  return (
    //children is like main child where all component are attached means starting of root and value is what to pass like files and setfiles .Also children is depends on filecontext.provider which component is under this becomes children

    //first bracket is js expresssion normal js second is like sending object {
    //files: files,
    //setFiles: setFiles

    <FileContext.Provider value={{ files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};


export {FileContext, FileProvider}