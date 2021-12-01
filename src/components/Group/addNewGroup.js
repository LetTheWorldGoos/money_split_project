import axios from "axios";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { getQueriesForElement } from "@testing-library/dom";

axios.defaults.withCredentials = true;
function NewGroup(props) {
  const { state } = useLocation();
  console.log(state);
  const { uid } = state;
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");
  const [password, setPassword] = useState("");
  const BASE_URI = "http://localhost:8888/";
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("submit?");
    let groupID;
    axios
      .post(BASE_URI + "/user/create_group", {
        group_name: groupName,
        password: password,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.code);
        if (res.data.code === 200) {
          groupID = res.data.data[0].GroupId;
          axios.post(BASE_URI + "/user/join_group", {
            group_id: groupID,
            user_id: uid,
            password: password,
          });
        }
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
              <FormLabel for="groupName">Group Name </FormLabel>
              <Input
                type="text"
                id="groupName"
                name="groupName"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
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

export default NewGroup;
