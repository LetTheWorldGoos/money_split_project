import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/layout";
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.withCredentials = true;
function Activity(props) {
  const uid = props.uid || 1;
  const [joinedPA, setJoinedPA] = useState(null);
  const [createdPA, setCreatedPA] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const urlPrefix = "http://localhost:8888/";
  useEffect(() => {
    axios
      .get(`${urlPrefix}user/search_join_event`, {
        params: { user_id: uid },
      })
      .then((res1) => {
        console.log(res1);
        axios
          .get(`${urlPrefix}user/search_create_event`, {
            params: { user_id: uid },
          })
          .then((res2) => {
            console.log(res2);
            setJoinedPA(res1.data.data);
            setCreatedPA(res2.data.data);
            setLoaded(true);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLeave = (e) => {
    axios.post(urlPrefix + "/pa/delete_join", {
      event_id: e.target.id,
      user_id: uid,
    });
  };

  const handleCancel = (e) => {
    axios.post(urlPrefix + "/pa/delete_create", {
      event_id: e.target.id,
      user_id: uid,
    });
  };

  return (
    <>
      <Heading size="sm">User: {uid}</Heading>
      <div>
        <Heading size="sm">You have joined:</Heading>
        {joinedPA
          ? joinedPA.map((pa) => {
              return (
                <>
                  <Flex
                    p={5}
                    shadow="xs"
                    borderWidth="1"
                    justifyContent="space-between"
                    align="center"
                  >
                    <Box>{pa.EventName} </Box>
                    <Spacer />
                    <Button
                      id={pa.EventId}
                      onClick={handleLeave}
                      colorScheme="red"
                    >
                      Leave
                    </Button>
                  </Flex>
                </>
              );
            })
          : "loading..."}
      </div>
      <div>
        <Heading size="sm">You have created:</Heading>
        {createdPA
          ? createdPA.map((pa) => {
              return (
                <>
                  <Flex
                    p={5}
                    shadow="xs"
                    borderWidth="1"
                    justifyContent="space-between"
                    align="center"
                  >
                    {pa.EventName}{" "}
                    <Button
                      id={pa.EventId}
                      onClick={handleCancel}
                      colorScheme="red"
                    >
                      Cancel
                    </Button>
                  </Flex>
                </>
              );
            })
          : "loading..."}
      </div>
    </>
  );
}

export default Activity;
