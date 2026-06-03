import axios from "axios";
import { useEffect, useState } from "react";
const App = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("api/home/message")
      .then((res) => setMessage(res.data))
      .catch((err) => {
        console.log(err);
      console.log("something went wrong") });
  });

  return <div>{message}</div>;
};

export default App;
