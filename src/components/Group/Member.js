function Member(props) {
  const { members } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Members</h1>
      <ul>
        {members.map((item) => {
          return <li>{item.UserName}</li>;
        })}
      </ul>
    </div>
  );
}

export default Member;
