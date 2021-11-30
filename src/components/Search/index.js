import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";

axios.defaults.withCredentials = true

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
    key = event.target.value;
  };
  let handleSubmit = () => {
    console.log(key);
    getRes(key ? key : query).then((groups) => {
      setRes({ res: groups, loaded: true });
    }, []);
  };
  return (
    <>
      <Box className="Search" width="full">
      <Flex justifyContent="space-between">
      <Heading>Search Group</Heading>
      <Box>
      <Link to={{ pathname: "/"}}>
          <Button>HomePage</Button>
      </Link>
      </Box>
      </Flex>
      <Flex justifyContent="space-around" width="500px">
        <input type="text" placeholder="Group Name" onChange={handleChange}/>
        <Button onClick={handleSubmit}>Search</Button>
      </Flex>
      <Spacer />
        <Flex justifyContent="space-around" flexDirection="column">
          {loaded ? displayGrps(res) : "loading..."}
        </Flex>
      </Box>
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
      <Box width="50%">
      <Link key={group.GroupId} to={"/group/" + group.GroupId}>
        <Flex p={5} shadow="xs" borderWidth="1" justifyContent="space-between" align="center">
        <Avatar name={group.GroupName} src="https://bit.ly/broken-link" />
            <Spacer />
            <Box>
            <Heading fontSize="xl">{group.GroupName}</Heading>
            </Box>
        </Flex>
      </Link>
      </Box>
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
