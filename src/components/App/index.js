import { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import User from "../User";
import Group from "../Group";
import Search from "../Search"

export default class App extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
        <div className="App">
        <Router>
          <Switch>
            <Route exact path="/group/:id"  children={<Group />}/>
            <Route exact path="/user/:id" children={<User />}/>
            <Route exact path="/search" children={<Search />}/>
          </Switch>
        </Router>
        </div>
        )
    }
}