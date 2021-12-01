import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import { Flex, Heading } from "@chakra-ui/layout";

export default function EventSearch() {
  let { query } = useLocation();
  let [key, setkey] = useState(null);
  console.log(key);
  const uid = 1001;
  let [{ res, loaded }, setRes] = useState(0, false);
  let [joinedEvents, setJoinedEvents] = useState([]);
  let [createdEvents, setCreatedEvents] = useState([]);
  const urlPrefix = "http://localhost:8888/";

  useEffect(() => {
    getEvent(key ? key : query).then((groups) => {
      axios
        .get(`${urlPrefix}user/search_join_event`, {
          params: { user_id: uid },
        })
        .then((jEvents) => {
          axios
            .get(`${urlPrefix}user/search_create_event`, {
              params: { user_id: uid },
            })
            .then((cEvents) => {
              let joinedEventIds = [];
              let createdEventIds = [];
              if (jEvents) {
                jEvents.data.data.forEach((e) => {
                  joinedEventIds.push(e.EventId);
                });
              }
              if (cEvents) {
                cEvents.data.data.forEach((e) => {
                  createdEventIds.push(e.EventId);
                });
              }
              setRes({ res: groups, loaded: true });
              setJoinedEvents(joinedEventIds);
              setCreatedEvents(createdEventIds);
            });
        });
    });
  }, [key, query]);

  let handleChange = (event) => {
    setkey(event.target.value);
  };

  let handleSubmit = () => {
    console.log(key);
    getEvent(key ? key : query).then((groups) => {
      setRes({ res: groups, loaded: true });
    }, []);
  };

  async function getEvent(key) {
    let fetched_events = await axios.get(
      "http://localhost:8888/pa/search_all",
      {
        params: {
          keyword: String(key),
        },
      }
    );
    //   console.log(grps);
    let events = [];
    for (var i in fetched_events.data.data) {
      events.push(fetched_events.data.data[i]);
    }
    console.log(events);
    return events;
  }

  function displayEvents(data) {
    return data.map((event, index) => {
      if (
        createdEvents.some((e) => e === event.EventId) ||
        joinedEvents.some((e) => e === event.EventId)
      ) {
        return (
          <Flex
            key={index}
            p={5}
            shadow="xs"
            borderWidth="1"
            justifyContent="space-between"
            align="center"
          >
            <li>Event Name: {event.EventName}</li>
          </Flex>
        );
      }
      return (
        <Flex
          key={index}
          p={5}
          shadow="xs"
          borderWidth="1"
          justifyContent="space-between"
          align="center"
        >
          <li>
            Event Name: {event.EventName}
            <Button
              id={event.EventId}
              onClick={handleJoin}
              colorScheme="teal"
              ml="2"
            >
              Join
            </Button>
          </li>
        </Flex>
      );
    });
  }

  const handleJoin = (e) => {
    axios
      .post(urlPrefix + "/pa/join", {
        user_id: uid,
        event_id: e.target.id,
      })
      .then((res) => {
        if (res.data.code == 200) {
          let oldJoinedEvents = [...joinedEvents];
          oldJoinedEvents.push(e.target.id);
          setJoinedEvents(oldJoinedEvents);
        } else {
          alert(res.data.status);
        }
      });
  };

  return (
    <>
      <div className="Search">
        <Heading>Search Event</Heading>
        <label>Search Event: </label>
        <input type="text" placeholder="Event Name" onChange={handleChange} />
        <Button onClick={handleSubmit} colorScheme="teal" ml="2">
          Search
        </Button>
        <div className="Results">
          {loaded ? displayEvents(res) : "loading..."}
        </div>
      </div>
    </>
  );
}
