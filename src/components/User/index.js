import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import axios from 'axios';

export default function User(){
    let {id} = useParams();
    let [UserName,setName] = useState();
    let [activities, setActivities] = useState();
    useEffect(()=>{
        getName(id).then(name => {
            setName(name);
            console.log(name);
        });
        getAct(id).then(act =>{
            setActivities(act);
            console.log(act);
        });
    });
    return(
        <div className="User">
            <div className="header">this is the user page for {UserName}</div>
            <div className="Activities">
                {displayActs(activities)}
            </div>
        </div>
    );
}

async function getName(id){
    let {data}=await axios.get("https://pokeapi.co/api/v2/pokemon/"+String(id));
    return data.name;
}

async function getAct(id){
    let {data}=await axios.get("https://pokeapi.co/api/v2/pokemon/"+String(id));
    return data.name;
}

function displayActs(data){
    data.map((activity,index)=>{
        return(
            <div key={index} className="Activity">
                <li>Lend or Borrow: {activity.lend_or_borrow}</li>
                <li>Category: {activity.category}</li>
                <li>Amount: {activity.amount}</li>
                <li>Date: {activity.date}</li>
            </div>
        );
    });
}