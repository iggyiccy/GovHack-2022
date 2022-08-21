import * as React from "react";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { useStyletron } from "baseui";
import { Button } from "baseui/button";

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
export default function Verify() {
  const [pestTraps, setPestTraps] = React.useState([]);
  const [css] = useStyletron();
  const [uniqueID, setUniqueID] = React.useState("");
  const [profile, setProfile] = React.useState([]);
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/pestTrap/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPestTraps(data);
        setIsValid(true);
      });
  }, []);

  React.useEffect(() => {
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

  // filter out the ones that have the unique id and return the ones that don't have the unique id
  const filteredPestTraps =
    pestTraps
      .filter((pestTrap) => {
        return (
          pestTrap.users.filter((user) => {
            return user.unique_id === uniqueID;
          }).length === 0
        );
      })
      .map((pestTrap) => {
        return (
          <div>
            <div key={pestTrap.id}>
              <h3>{pestTrap.name}</h3>
              <p>{pestTrap.description}</p>
              <Button onClick={(e) => addMeToTrap(e, pestTrap)}>Add Me</Button>
            </div>
          </div>
        );
      }).length === 0 ? (
      <div>No Pest Traps Found</div>
    ) : (
      filteredPestTraps
    );

  return (
    <div className={css({ marginTop: "40px" })}>
      <div className={css({ display: "flex", justifyContent: "center" })}>
        <div className={css({ width: "50%" })}>
          <form>
            <FormControl label="Unique ID">
              <Input
                id="unique-input-id"
                value={uniqueID}
                onChange={(e) => setUniqueID(e.target.value)}
              />
            </FormControl>
            <Button type="submit">Submit Unique ID</Button>
          </form>
        </div>
      </div>
      <div className={css({ marginTop: "40px" })}>
        {isValid ? filteredPestTraps : "Loading..."}
      </div>
    </div>
  );
}
