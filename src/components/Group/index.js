import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";
import Balance from "./Balance";
import Member from "./Member";
import History from "./History";

function Group() {
  const history = useHistory();
  const { id } = useParams();
  const BASE_URI = "http://127.0.0.1:8888";
  const uid = 59;
  const [records, setRecords] = useState([]);
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8888/group/records", {
        params: { group_id: id },
      })
      .then((res1) => {
        axios
          .get("http://127.0.0.1:8888/group/loans", {
            params: { group_id: id, user_id: uid },
          })
          .then((res2) => {
            axios
              .get("http://127.0.0.1:8888/group/members", {
                params: { group_id: id, user_id: uid },
              })
              .then((res3) => {
                setRecords(res1.data.data);
                setLoans(res2.data.data);
                setMembers(res3.data.data);
              });
          });
      });
  }, []);

  const handleSettle = () => {
    axios.post("http://127.0.0.1:8888/group/settle_transaction", {
      user_id: uid,
      group_id: id,
      borrow_id: uid,
    });
  };

  return (
    <div style={{ marginLeft: "50px", marginRight: "50px" }}>
      <h1>Group ID {id}</h1>
      <h1>Current User ID {uid}</h1>
      <div style={{ marginLeft: "90%" }}>
        <button style={{ marginRight: "5px" }} onClick={handleSettle}>
          Settle
        </button>
        <button
          onClick={() =>
            history.push({
              pathname: `/group/${id}/add`,
              state: { uid: uid },
            })
          }
        >
          Add
        </button>
      </div>
      <div style={{ display: "flex", "justify-content": "space-between" }}>
        <History records={records} />
        <Balance loans={loans} />
        <Member members={members} />
      </div>
    </div>
  );
}

export default Group;
