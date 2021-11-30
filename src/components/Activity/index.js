import { Button } from "@chakra-ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.withCredentials = true;
function Activity() {
  const uid = 1;
  const [joinedPA, setJoinedPA] = useState(null);
  const [createdPA, setCreatedPA] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const urlPrefix = "http://localhost:8888/";
  useEffect(() => {
    axios
      .get(`${urlPrefix}user/search_join_event`, {
        params: { user_id: uid },
      })
      .then((res1) => {
        console.log(res1);
        axios
          .get(`${urlPrefix}user/search_create_event`, {
            params: { user_id: uid },
          })
          .then((res2) => {
            console.log(res2);
            setJoinedPA(res1.data.data);
            setCreatedPA(res2.data.data);
            setLoaded(true);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLeave = (e) => {
    axios.post(urlPrefix + "/pa/delete_join", {
      event_id: e.target.id,
      user_id: uid,
    });
  };

  const handleCancel = (e) => {
    axios.post(urlPrefix + "/pa/delete_create", {
      event_id: e.target.id,
      user_id: uid,
    });
  };

  return (
    <>
      <h1>User: {uid}</h1>
      <div>
        You have joined:
        <ul>
          {joinedPA
            ? joinedPA.map((pa) => {
                return (
                  <>
                    <li>
                      {pa.EventName}{" "}
                      <button id={pa.EventId} onClick={handleLeave}>
                        Leave
                      </button>
                    </li>
                  </>
                );
              })
            : "loading..."}
        </ul>
      </div>
      <div>
        You have created:
        <ul>
          {createdPA
            ? createdPA.map((pa) => {
                return (
                  <>
                    <li>
                      {pa.EventName}{" "}
                      <Button id={pa.EventId} onClick={handleCancel} colorScheme="red">
                        Cancel
                      </Button>
                    </li>
                  </>
                );
              })
            : "loading..."}
        </ul>
      </div>
    </>
  );
}

export default Activity;
