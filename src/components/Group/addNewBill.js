import axios from "axios";
import { useState } from "react";
import { useLocation, useParams } from "react-router";

function AddNewBill(props) {
  const { state } = useLocation();
  const { uid } = state;
  const { id } = useParams();
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("submit?");
    axios.post("http://127.0.0.1:8888/group/add_transaction", {
      user_id: uid,
      group_id: id,
      lend_id: uid,
      amount: amount,
      category: category,
      description: description,
    });
  };
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Current Group Id {id}</h1>
        <h1>Current User Id {uid}</h1>
        <form action="/action_page.php" onSubmit={handleSubmit}>
          <label for="amount">Amount: </label>
          <br />
          <input
            type="text"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <br />
          <label for="category">Category</label>
          <br />
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
          <br />
          <label for="description">Description</label>
          <br />
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
        <br />
      </div>
    </>
  );
}

export default AddNewBill;
