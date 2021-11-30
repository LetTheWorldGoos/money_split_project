import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import Balance from "./Balance";
import Member from "./Member";
import History from "./History";
import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

axios.defaults.withCredentials = true;
function Group() {
  const { state } = useLocation();
  const uid = state ? state.uid : 1;
  const history = useHistory();
  const { id } = useParams();
  const BASE_URI = "http://localhost:8888";
  const [records, setRecords] = useState([]);
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    axios
      .get(
        BASE_URI + "/group/records",
        {
          params: { group_id: id },
        },
        { withCredentials: true }
      )
      .then((res1) => {
        console.log(res1);
        axios
          .get(
            BASE_URI + "/group/loans",
            {
              params: { group_id: id, user_id: uid },
            },
            { withCredentials: true }
          )
          .then((res2) => {
            axios
              .get(
                BASE_URI + "/group/members",
                {
                  params: { group_id: id, user_id: uid },
                },
                { withCredentials: true }
              )
              .then((res3) => {
                setRecords(res1.data.data);
                setLoans(res2.data.data);
                setMembers(res3.data.data);
              });
          });
      });
  }, []);

  const handleSettle = () => {
    axios.post(BASE_URI + "/group/settle_transaction", {
      user_id: uid,
      group_id: id,
      borrow_id: uid,
    });
  };

  return (
    <div style={{ marginLeft: "50px", marginRight: "50px" }}>
      <Heading mt="5" fontSize="5xl">
        Group ID {id}
      </Heading>
      <Flex mr="50" mb="5">
        <Heading fontSize="2xl">Current User ID {uid || 1}</Heading>
        <Spacer />
        <Box>
          <Button colorScheme="teal" mr="5" onClick={handleSettle}>
            Settle Your Debts
          </Button>
          <Button
            colorScheme="teal"
            onClick={() =>
              history.push({
                pathname: `/group/${id}/add`,
                state: { uid: uid },
              })
            }
          >
            Add New Bill
          </Button>
        </Box>
      </Flex>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} h="500">
        <History records={records} />
        <Balance loans={loans} />
        <Member members={members} />
      </Grid>
    </div>
  );
}

export default Group;
