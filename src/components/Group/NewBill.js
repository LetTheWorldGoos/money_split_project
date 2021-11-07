function NewBill() {
  return (
    <div>
      <form>
        <label for="bill">Bill:</label>
        <br />
        <input type="text" id="bill" name="bill" />
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
