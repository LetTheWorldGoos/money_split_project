import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";

export default function Search() {
  let { query } = useLocation();
  let [key, setkey] = useState(null);
  console.log(key);
  let [{ res, loaded }, setRes] = useState(0, false);
  useEffect(() => {
    getRes(key ? key : query).then((groups) => {
      setRes({ res: groups, loaded: true });
    });
  }, [key, query]);
  let handleChange = (event) => {
    setkey(event.target.value);
  };
  let handleSubmit = () => {
    console.log(key);
    getRes(key ? key : query).then((groups) => {
      setRes({ res: groups, loaded: true });
    }, []);
  };
  return (
    <>
      <div className="Search">
        <h1>Search Group</h1>
        <label>Search Group: </label>
        <input type="text" placeholder="Group Name" onChange={handleChange} />
        <button onClick={handleSubmit}>Search</button>
        <div className="Results">
          {loaded ? displayGrps(res) : "loading..."}
        </div>
      </div>
    </>
  );
}

async function getRes(key) {
  let grps = await axios.get(
    "http://localhost:8888/user/search?group_name=" + String(key)
  );
  console.log(grps);
  let groups = [];
  for (var i in grps.data.data) {
    groups.push(grps.data.data[i]);
  }
  console.log(groups);
  return groups;
}

async function getEvent(key) {
  let fetched_events = await axios.get("http://localhost:8888/pa/search_all", {
    params: {
      keyword: String(key),
    },
  });
  //   console.log(grps);
  let events = [];
  for (var i in fetched_events.data.data) {
    events.push(fetched_events.data.data[i]);
  }
  console.log(events);
  return events;
}

function displayGrps(data) {
  return data.map((group, index) => {
    return (
      <Link key={group.GroupId} to={"/group/" + group.GroupId}>
        <div key={index} className="Group">
          <li>Group Name: {group.GroupName}</li>
        </div>
      </Link>
    );
  });
}

function displayEvents(data) {
  return data.map((event, index) => {
    return (
      <div key={index} className="Group">
        <li>Event Name: {event.EventName}</li>
      </div>
    );
  });
}
