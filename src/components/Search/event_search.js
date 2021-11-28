import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function EventSearch() {
  let { query } = useLocation();
  let [key, setkey] = useState(null);
  console.log(key);
  const uid = 1001;
  let [{ res, loaded }, setRes] = useState(0, false);
  let [joinedEvents, setJoinedEvents] = useState([]);
  let [createdEvents, setCreatedEvents] = useState([]);
  const urlPrefix = "http://127.0.0.1:8888/";

  useEffect(() => {
    getEvent(key ? key : query).then((groups) => {
      axios
        .get(`${urlPrefix}user/search_join_event`, {
          params: { user_id: uid },
        })
        .then((jEvents) => {
          axios
            .get(`${urlPrefix}user/search_create_event`, {
              params: { user_id: uid },
            })
            .then((cEvents) => {
              let joinedEventIds = [];
              let createdEventIds = [];
              jEvents.data.data.forEach((e) => {
                joinedEventIds.push(e.EventId);
              });
              cEvents.data.data.forEach((e) => {
                createdEventIds.push(e.EventId);
              });
              setRes({ res: groups, loaded: true });
              setJoinedEvents(joinedEventIds);
              setCreatedEvents(createdEventIds);
            });
        });
    });
  }, [key, query]);

  let handleChange = (event) => {
    setkey(event.target.value);
  };

  let handleSubmit = () => {
    console.log(key);
    getEvent(key ? key : query).then((groups) => {
      setRes({ res: groups, loaded: true });
    }, []);
  };

  async function getEvent(key) {
    let fetched_events = await axios.get(
      "http://localhost:8888/pa/search_all",
      {
        params: {
          keyword: String(key),
        },
      }
    );
    //   console.log(grps);
    let events = [];
    for (var i in fetched_events.data.data) {
      events.push(fetched_events.data.data[i]);
    }
    console.log(events);
    return events;
  }

  function displayEvents(data) {
    return data.map((event, index) => {
      if (
        createdEvents.some((e) => e === event.EventId) ||
        joinedEvents.some((e) => e === event.EventId)
      ) {
        return (
          <div key={index} className="Group">
            <li>Event Name: {event.EventName}</li>
          </div>
        );
      }
      return (
        <div key={index} className="Group">
          <li>
            Event Name: {event.EventName}
            <button id={event.EventId} onClick={handleJoin}>
              Join
            </button>
          </li>
        </div>
      );
    });
  }

  const handleJoin = (e) => {
    axios
      .post(urlPrefix + "/pa/join", {
        user_id: uid,
        event_id: e.target.id,
      })
      .then((res) => {
        if (res.data.code == 200) {
          let oldJoinedEvents = [...joinedEvents];
          oldJoinedEvents.push(e.target.id);
          setJoinedEvents(oldJoinedEvents);
        } else {
          alert(res.data.status);
        }
      });
  };

  return (
    <>
      <div className="Search">
        <h1>Search Event</h1>
        <label>Search Event: </label>
        <input type="text" placeholder="Event Name" onChange={handleChange} />
        <button onClick={handleSubmit}>Search</button>
        <div className="Results">
          {loaded ? displayEvents(res) : "loading..."}
        </div>
      </div>
    </>
  );
}
