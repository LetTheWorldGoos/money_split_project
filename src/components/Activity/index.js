import axios from "axios";
import { useEffect, useState } from "react";

function Activity() {
  const uid = 1001;
  const [joinedPA, setJoinedPA] = useState([]);
  const [createdPA, setCreatedPA] = useState([]);
  const urlPrefix = "http://127.0.0.1:8888/";
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
          {joinedPA.map((pa) => {
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
          })}
        </ul>
      </div>
      <div>
        You have created:
        <ul>
          {createdPA.map((pa) => {
            return (
              <>
                <li>
                  {pa.EventName}{" "}
                  <button id={pa.EventId} onClick={handleCancel}>
                    Cancel
                  </button>
                </li>
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Activity;
