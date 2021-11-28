import { useState } from "react";
import axios from "axios";

function NewActivity() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fee, setFee] = useState(0);
  const [location, setLocation] = useState("");
  const [zipcode, setZipcode] = useState("");
  const uid = 1;

  const handleSelect = (current_select) => {
    setEventType(current_select.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("submit?");
    axios.post("http://127.0.0.1:8888/pa/create", {
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
      <form onSubmit={handleSubmit}>
        <label for="eventName">Event name:</label>
        <br />
        <input
          type="text"
          id="eventName"
          name="eventName"
          value={eventName}
          onChange={(e) => {
            setEventName(e.target.value);
          }}
        />
        <br />
        <label for="eventType">Event type:</label>
        <br />
        <select
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
        </select>
        <br />
        <label for="startDate">Start date:</label>
        <br />
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        />
        <br />
        <label for="endDate">End date:</label>
        <br />
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />
        <br />
        <label for="fee">Fee:</label>
        <br />
        <input
          type="text"
          id="fee"
          name="fee"
          value={fee}
          onChange={(e) => {
            setFee(e.target.value);
          }}
        />
        <br />
        <label for="location">Location:</label>
        <br />
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />
        <br />
        <label for="zipcode">Zipcode:</label>
        <br />
        <input
          type="text"
          id="zipcode"
          name="zipcode"
          value={zipcode}
          onChange={(e) => {
            setZipcode(e.target.value);
          }}
        />
        <br />
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default NewActivity;
