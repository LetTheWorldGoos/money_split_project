import axios from "axios";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";

function AddNewBill(props) {
  const { state } = useLocation();
  const { uid } = state;
  const { id } = useParams();
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const BASE_URI = "http://localhost:8888/";
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("submit?");
    axios.post(BASE_URI + "group/add_transaction", {
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
          <Heading>Current Group Id {id}</Heading>
          <Heading>Current User Id {uid}</Heading>
          <form action="/action_page.php" onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel for="amount">Amount: </FormLabel>
              <Input
                type="text"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel for="category">Category</FormLabel>
              <Input
                type="text"
                id="category"
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel for="description">Description</FormLabel>
              <Input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FormControl>
            <br />
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

export default AddNewBill;
