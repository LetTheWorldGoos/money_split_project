import { Box, Heading, Text } from "@chakra-ui/layout";

function History(props) {
  const { records } = props;
  return (
    <>
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="8"
        overflow="scroll"
        boxShadow="md"
        bg="white"
      >
        <Heading textAlign="center" size="lg" p="2">
          History
        </Heading>
        {records
          ? records.map((item) => {
              return (
                <Box p={5} shadow="xs" borderWidth="1px">
                  <Heading fontSize="xl">
                    {item.UserName} 💰{item.Amount}
                  </Heading>
                  <Text mt={4}>{item.Date}</Text>
                </Box>
              );
            })
          : "loading..."}
      </Box>
    </>
  );
}

export default History;
