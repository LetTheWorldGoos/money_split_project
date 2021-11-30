import { Box, Heading } from "@chakra-ui/layout";

function Balance(props) {
  const { loans } = props;
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="scroll"
      boxShadow="md"
      bg="white"
    >
      <Heading textAlign="center" size="lg" p="2">Balance</Heading>
      {loans ? loans.map((item) => {
        return (
          <Box p={5} borderWidth="1px">
            {item.UserName} {item.Amount} {item.Date}
          </Box>
        );
      }) : "loading..."}
    </Box>
  );
}

export default Balance;
