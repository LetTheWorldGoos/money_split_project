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

export default function User() {
  let { id } = useParams();
  let [key, setkey] = useState();
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

  function displayGrps(data,id) {
    return data.map((group, index) => {
      return (
          <div key={index} className="Group">
            <Link
                key={group.GroupId}
                to={{ pathname: "/group/" + group.GroupId, state: { uid: id } }}
                >
            <li>Group Name: {group.GroupName}</li>
            </Link>
            <button userid={id} groupid={group.GroupId} onClick={UserLeave}>Leave the Group</button>
          </div>
      );
    });
  }

  let handleChange = (event) => {
    console.log(event.target.value);
    setkey(event.target.value);
  };
  return (
    <div className="User">
      <h1 className="header">
        {loaded ? UserName.toUpperCase() : "loading..."}
      </h1>
      <form className="Search Bar">
        <label>Search Group: </label>
        <input type="text" placeholder="Group Name" onChange={handleChange} />
        <Link to={{ pathname: "/search", query: key }}>
          <button>Search</button>
        </Link>
      </form>
      <div className="multicolumn">
        <div className="Loans column">
          <h3 className="Title">Loans in Categories</h3>
          {loaded ? displayLons(loans) : "loading..."}
        </div>
        <div className="Activities column">
          <h3 className="Title">Recent Activities</h3>
          <ol>{loaded ? displayActs(activities) : "loading..."}</ol>
        </div>
        <div className="Groups column">
          <h3 className="Title">Groups</h3>
          {loaded ? displayGrps(groups,id) : "loading..."}
        </div>
      </div>
    </div>
  );
}

async function UserLeave(event){
    console.log(event.target.attributes.userid.value)
    console.log(event.target.attributes.groupid.value)
    let userid = event.target.attributes.userid.value
    let groupid = event.target.attributes.groupid.value
    let body = {
      group_id: groupid,
      user_id:userid
    }
    let res = await axios.post("http://localhost:8888/user/delete",body)
    console.log(res)
    alert(res.data.status)
}

async function getStates(id) {
  let info = await axios.get(
    "http://localhost:8888/get_info?user_id=" + String(id)
  );
  let acts = await axios.get(
    "http://localhost:8888/user/ra?user_id=" + String(id)
  );
  let grps = await axios.get(
    "http://localhost:8888/user/select_group?user_id=" + String(id)
  );
  let lons = await axios.get(
    "http://localhost:8888/user/status_category?user_id=" + String(id)
  );
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
      <li key={index} className="Activity">
        <div>Category: {activity.Category}</div>
        <div>Amount: {activity.Amount}</div>
        <div>Name: {activity.Name}</div>
        <div>Date: {activity.Date}</div>
      </li>
    );
  });
}

function displayLons(data) {
  return data.map((loan, index) => {
    return (
      <div key={index} className="Loan">
        <li>Category: {loan.Category}</li>
        <li>Amount: {loan.Amount}</li>
      </div>
    );
  });
}
