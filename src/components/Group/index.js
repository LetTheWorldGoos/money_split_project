import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

export default function Group(){
    let {id} = useParams();
    return(
        <div>this is the Group page for {id}</div>
    );
}