import { useState } from "react";
import { useLocation, useParams } from "react-router";
import axios from "axios";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Stack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Button } from "@chakra-ui/button";
axios.defaults.withCredentials = true;

function NewActivity() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fee, setFee] = useState(0);
  const [location, setLocation] = useState("");
  const [zipcode, setZipcode] = useState("");
  const { state } = useLocation();
  const { uid } = state;

  const handleSelect = (current_select) => {
    setEventType(current_select.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("submit?");
    axios.post("http://localhost:8888/pa/create", {
      event_name: eventName,
      event_type: eventType,
      start_date: startDate,
      end_date: endDate,
      creator_id: uid,
      fee: fee,
      location: location,
      zipcode: zipcode,
    });
  };
  return (
    <div>
      <Flex minH={"70vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Box rounded={"lg"} boxShadow={"lg"} p={8}>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel for="eventName">Event name:</FormLabel>
                <Input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel for="eventType">Event type:</FormLabel>
                <Select
                  name="eventType"
                  id="eventType"
                  value={eventType}
                  onChange={(e) => {
                    setEventType(e.target.value);
                  }}
                >
                  <option value=""></option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Career">Career</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel for="startDate">Start date:</FormLabel>

                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel for="endDate">End date:</FormLabel>

                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel for="fee">Fee:</FormLabel>

                <Input
                  type="text"
                  id="fee"
                  name="fee"
                  value={fee}
                  onChange={(e) => {
                    setFee(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel for="location">Location:</FormLabel>

                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel for="zipcode">Zipcode:</FormLabel>

                <Input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={zipcode}
                  onChange={(e) => {
                    setZipcode(e.target.value);
                  }}
                />
              </FormControl>
              <Button type="submit" value="Submit" colorScheme="teal">
                Submit
              </Button>
            </form>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
}

export default NewActivity;
