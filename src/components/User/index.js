import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

export default function User(){
    let {id} = useParams();
    return(
        <div>this is the user page for {id}</div>
    );
}