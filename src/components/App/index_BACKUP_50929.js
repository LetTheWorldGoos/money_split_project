import { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import User from "../User";
import Group from "../Group";
<<<<<<< HEAD
import AddNewBill from "../Group/addNewBill";
=======
import Search from "../Search"
>>>>>>> 3e3b4baa3f9a503d4e9598242539df5f4c8138b2

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
<<<<<<< HEAD
            <Route exact path="/group/:id" children={<Group />} />
            <Route exact path="/group/:id/add" children={<AddNewBill />} />
            <Route exact path="/user/:id" children={<User />} />
=======
            <Route exact path="/group/:id"  children={<Group />}/>
            <Route exact path="/user/:id" children={<User />}/>
            <Route exact path="/search" children={<Search />}/>
>>>>>>> 3e3b4baa3f9a503d4e9598242539df5f4c8138b2
          </Switch>
        </Router>
      </div>
    );
  }
}
