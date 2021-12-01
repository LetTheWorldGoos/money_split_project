import axios from "axios";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { getQueriesForElement } from "@testing-library/dom";

axios.defaults.withCredentials = true;
function JoinGroup(props) {
  const { state } = useLocation();
  console.log(state);
  const { uid } = state;
  const [groupID, setGroupID] = useState("");
  const [password, setPassword] = useState("");
  const BASE_URI = "http://localhost:8888/";
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("submit?");
    console.log(groupID);
    axios
      .post(BASE_URI + "/user/join_group", {
        group_id: parseInt(groupID),
        user_id: uid,
        password: password,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          textAlign="center"
          bg="white"
        >
          <Heading>Current User Id {uid}</Heading>
          <form action="/action_page.php" onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel for="groupID">Group ID </FormLabel>
              <Input
                type="text"
                id="groupID"
                name="groupID"
                value={groupID}
                onChange={(e) => {
                  setGroupID(e.target.value);
                }}
              />
            </FormControl>
            <br />
            <br />
            <FormControl>
              <FormLabel for="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </FormControl>
            <br />
            <Button type="submit" colorScheme="teal">
              Submit
            </Button>
          </form>
          <br />
        </Box>
      </Flex>
    </>
  );
}

export default JoinGroup;
