import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import axios from "axios";
import "./user.css";
import Chart from "../Chart"
import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";

axios.defaults.withCredentials = true
export default function User() {
  let { id } = useParams();
  let [key, setkey] = useState();
  let [eKey, setEKey] = useState("");
  let [{ UserName, activities, groups, loaded, loans }, setStates] = useState(
    1,
    2,
    false
  );
  useEffect(() => {
    getStates(id).then((result) => {
      setStates({
        UserName: result[0],
        activities: result[1],
        groups: result[2],
        loans: result[3],
        loaded: true,
      });
    });
  }, [id]);

  function displayGrps(data, id) {
    return data.map((group, index) => {
      return (
        <Flex p={5} shadow="xs" borderWidth="1" justifyContent="space-between" align="center">
          <Link
            key={group.GroupId}
            to={{ pathname: "/group/" + group.GroupId, state: { uid: id } }}
          >
            <Avatar name={group.GroupName} src="https://bit.ly/broken-link" />
            <Spacer />
            <Box>
            <Heading fontSize="xl">{group.GroupName}</Heading>
            </Box>
          </Link>
          <Button
            userid={id}
            groupid={group.GroupId}
            ind={index}
            onClick={UserLeave}
          >
            Leave the Group
          </Button>
        </Flex>
      );
    });
  }

  async function UserLeave(event) {
    console.log(event.target.attributes.userid.value);
    console.log(event.target.attributes.groupid.value);
    let userid = event.target.attributes.userid.value;
    let groupid = event.target.attributes.groupid.value;
    let body = {
      group_id: groupid,
      user_id: userid,
    };
    let res = await axios.post("http://localhost:8888/user/delete", body);
    console.log(res);
    alert(res.data.status);
    if (res.data.status === "success") {
      let index = Number(event.target.attributes.ind.value);
      let GroupsBefore = groups;
      GroupsBefore.splice(index, 1);
      setStates({
        UserName: UserName,
        activities: activities,
        groups: GroupsBefore,
        loans: loans,
        loaded: true,
      });
    }
  }

  let handleChange = (event) => {
    console.log(event.target.value);
    setkey(event.target.value);
  };

  let handleEventSearch = (event) => {
    console.log(event.target.value);
    setEKey(event.target.value);
  };

  return (
    <Box className="User">
      <Heading mt="5" fontSize="5xl">
        {loaded ? UserName.toUpperCase() : "loading..."}
      </Heading>
        <label>Search Group: </label>
        <input type="text" placeholder="Group Name" onChange={handleChange} />
        <Link to={{ pathname: "/search", query: key }}>
          <Button>Search</Button>
        </Link>

        <label>Search Event: </label>
        <input
          type="text"
          placeholder="Event Name"
          onChange={handleEventSearch}
        />
        <Link to={{ pathname: "/search/event", query: eKey }}>
          <Button>Search</Button>
        </Link>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} h="full">
        <Box borderWidth="1px" borderRadius="8"  boxShadow="md" bg="white">
        <Heading textAlign="center" size="lg" p="2">Loans in Categories</Heading>
          {loaded ? displayLons(loans) : "loading..."}
          {loaded? <Chart data={loans}/> : "loading..." }
        </Box>
        <Box borderWidth="1px" borderRadius="8"  boxShadow="md" bg="white">
        <Heading textAlign="center" size="lg" p="2">Recent Activities</Heading>
          {loaded ? displayActs(activities) : "loading..."}
        </Box>
        <Box borderWidth="1px" borderRadius="8"  boxShadow="md" bg="white">
        <Heading textAlign="center" size="lg" p="2">Groups</Heading>
          {loaded ? displayGrps(groups, id) : "loading..."}
        </Box>
      </Grid>
    </Box>
  );
}

async function getStates(id) {
  let info = await axios.get(
    "http://localhost:8888/get_info?user_id=" + String(id),{withCredentials: true}
  );
  let acts = await axios.get(
    "http://localhost:8888/user/ra?user_id=" + String(id),{withCredentials: true}
  );
  let grps = await axios.get(
    "http://localhost:8888/user/select_group?user_id=" + String(id),{withCredentials: true}
  );
  let lons = await axios.get(
    "http://localhost:8888/user/status_category?user_id=" + String(id),{withCredentials: true}
  );
  console.log(info)
  let UserName = info.data.data.UserName;
  let activities = [];
  let groups = [];
  let loans = [];
  for (var i in lons.data.data) {
    loans.push(lons.data.data[i]);
  }
  for (var j in grps.data.data) {
    groups.push(grps.data.data[j]);
  }
  for (var k in acts.data.data) {
    activities.push(acts.data.data[k]);
  }
  return [UserName, activities, groups, loans];
}

function displayActs(data) {
  return data.map((activity, index) => {
    return (
      <Flex p={5} shadow="xs" borderWidth="1px" justifyContent="space-between">
        <Box>
        <Heading fontSize="xl">
        {activity.Name} 💰{activity.Amount}
        </Heading>
        <Box>{activity.Category}</Box>
        </Box>
        <Box>{activity.Date}</Box>
      </Flex>
    );
  });
}

function displayLons(data) {
  return data.map((loan, index) => {
    return (
      <Box p={5} borderWidth="1px">
        {loan.Category}: {loan.Amount}
      </Box>
    );
  });
}
