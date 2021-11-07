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
    useEffect(()=>{
        getName(id).then(name => {
            setName(name);
            console.log(name);
        });
    });
    return(
        <div>this is the user page for {UserName}</div>
    );
}

async function getName(id){
    let {data}=await axios.get("https://pokeapi.co/api/v2/pokemon/"+String(id));
    return data.name;
}