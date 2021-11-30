import { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Home from "../Home"
import User from "../User";
import Login from "../Login";
import Register from "../Register";
import Group from "../Group";
import AddNewBill from "../Group/addNewBill";
import Search from "../Search";
import Activity from "../Activity";
import NewActivity from "../Activity/NewActivity";
import EventSearch from "../Search/event_search";

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" children={<Home />} />
            <Route exact path="/login" children={<Login />}/>
            <Route exact path="/register" children={<Register />}/>
            <Route exact path="/group/:id" children={<Group />} />
            <Route exact path="/group/:id/add" children={<AddNewBill />} />
            <Route exact path="/user/:id" children={<User />} />
            <Route exact path="/search" children={<Search />} />
            <Route exact path="/search/event" children={<EventSearch />} />
            <Route exact path="/activity" children={<Activity />} />
            <Route exact path="/activity/new" children={<NewActivity />} />
            <Route exact path="/activity/:id" children={<Activity />} />
          </Switch>
        </Router>
      </div>
    );
  }
}
