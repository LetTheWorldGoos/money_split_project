function History(props) {
  const { records } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>History</h1>
      {records.map((item) => {
        return <p>{item.UserName} {item.Amount} {item.Date}</p>;
      })}
    </div>
  );
}

export default History;
