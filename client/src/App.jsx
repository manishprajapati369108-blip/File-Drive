import axios from 'axios';
import { useState, useEffect} from "react";

const App = () => {
  const [message, setMessage] = useState("Loading....")

  useEffect(() => {
    axios.get("/api/users")
    .then((res) => { setMessage(res.data)})
    .catch((error) => { console.log(error);
      setMessage("failed")
     })
  })
  return (
    <div>{message}</div>
  )
}

export default App