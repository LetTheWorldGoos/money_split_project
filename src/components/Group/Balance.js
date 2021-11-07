function Balance(props) {
  const { loans } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Balance</h1>
      {loans.map((item) => {
        return <p>{item.UserName} {item.Amount} {item.Date}</p>;
      })}
    </div>
  );
}

export default Balance;
