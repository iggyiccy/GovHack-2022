import { useEffect, useState } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontpage from "./pages/frontpage";
import Navbar from "./pages/navbar";
import Edit from "./pages/edit";
import List from "./pages/list";
import Review from "./pages/review";
import Verify from "./pages/verify";

// Get the cookie for the csrf token, needed for API POST requests
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

function App() {
  const [pestTraps, setPestTraps] = useState([]);
  const [profile, setProfile] = useState([]);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    fetch("/api/pestTrap/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPestTraps(data);
      });
  }, []);

  useEffect(() => {
    fetch("/api/profile/")
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        console.log("profile", profile);
      });
  }, []);

  function addMeToTrap(e, pestTrap) {
    e.preventDefault();
    console.log("Pest trap body", pestTrap);
    fetch(`/api/pestTrap/${pestTrap.id}/`, {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        ...pestTrap,
        description: "edited",
        users: [...pestTrap.users, profile],
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  const _onSubmit = (event) => {
    setUniqueId(event.target.value);
  };
  console.log("uniqueId Entered: ", uniqueId);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route index element={<Frontpage />} />
          <Route path="create" element={<Verify />} />
          <Route path="edit" element={<Edit />} />
          <Route path="list" element={<List />} />
          <Route path="review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
