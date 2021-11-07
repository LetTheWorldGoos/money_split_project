import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import axios from 'axios';

export default async function User(){
    let {id} = useParams();
    const name = await axios.get("https://pokeapi.co/api/v2/pokemon/"+{id});
    return(
        <div>this is the user page for {id} {name}</div>
    );
}