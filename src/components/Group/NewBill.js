import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";

function NewBill() {
  return (
    <div>
      <form>
        <FormControl>
          <FormLabel for="bill">Bill:</FormLabel>
          <Input type="text" id="bill" name="bill" />
        </FormControl>
        <br />
        <label for="lname">Last name:</label>
        <br />
        <input type="text" id="lname" name="lname" />
      </form>
      <input type="submit" value="Submit"></input>
    </div>
  );
}

export default NewBill;
