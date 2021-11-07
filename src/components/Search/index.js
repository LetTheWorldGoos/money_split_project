import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
  } from "react-router-dom";
import axios from 'axios';

export default function Search(){
    let {query}=useLocation();
    let [key,setkey]=useState(null);
    console.log(key);
    let [{res,loaded},setRes]=useState(0,false);
    useEffect(()=>{
        getRes(key?key:query).then((groups)=>{
            setRes({res:groups,loaded:true});
        })
    },[])
    let handleChange=(event)=>{
        setkey(event.target.value);
        getRes(key?key:query).then((groups)=>{
            setRes({res:groups,loaded:true});
        })
    }
    return(
        <div className="Search">
            <h1>Search Group</h1>
            <input type="text" placeholder="Group Name" onChange={handleChange}/>
            <div className="Results">
                {loaded?displayGrps(res):"loading..."}
            </div>
        </div>
    )
}

async function getRes(key){
    let grps=await axios.get("http://localhost:8888/user/search?group_name=sample"+String(key));
    console.log(grps);
    let groups = [];
    for(var i in grps.data.data){
        groups.push(grps.data.data[i]);
    }
    console.log(groups);
    return groups;
}

function displayGrps(data){
    return(
    data.map((group,index)=>{
        return(
            <Link key={group.GroupId} to={"/group/"+group.GroupId}>
            <div key={index} className="Group">
                <li>Group Name: {group.GroupName}</li>
            </div>
            </Link>
        );
    }))
}