import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading, Spacer } from "@chakra-ui/layout";
function Member(props) {
  const { members } = props;
  return (
    <Box
      borderWidth="1px"
      borderRadius="8"
      overflow="scroll"
      boxShadow="md"
      bg="white"
    >
      <Heading textAlign="center" size="lg" p="2">
        Members
      </Heading>
      {members
        ? members.map((item) => {
            return (
              <Flex p={5} shadow="xs" borderWidth="1">
                <Avatar name={item.UserName} src="https://bit.ly/broken-link" />
                <Spacer />
                <Box>
                  <Heading fontSize="xl">{item.UserName}</Heading>
                </Box>
              </Flex>
            );
          })
        : "loading..."}
    </Box>
  );
}

export default Member;
