import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Heading,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiSlack,
  FiSearch,
  FiPlus,
  FiPower,
  FiMenu,
  FiUserPlus,
} from "react-icons/fi";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect,
  Link,
} from "react-router-dom";
import { useHistory } from "react-router";

export default function SimpleSidebar({ children, Name, uid }) {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(Name);
  console.log(uid)
  return (
    <Box minH="90vh" minW="20vw" >
      <SidebarContent
        onClose={() => onClose}
        history={history}
        Name={Name}
        uid={uid}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, history, Name, uid, ...rest }) => {
  let grouphandler = (event) => {
    event.preventDefault()
    history.push({
      pathname: `/search`,
    });
  };
  let eventhandler = (event) => {
    event.preventDefault()
    history.push({
      pathname: `/search/event`,
    });
  };
  let joingrouphandler = (event) => {
    event.preventDefault()
    console.log("handle")
    console.log(uid)
    history.push({
      pathname: "/group/new",
      state: { uid: uid }
    });
  };
  let joineventhandler = (event) => {
    event.preventDefault()
    history.push({
      pathname: `/activity/new`,
    });
  };
  let historyhandler = () => {};
  let outhandler = () => {};

  const LinkItems = [
    { name: "Group Search", icon: FiUsers, handler: grouphandler },
    { name: "Event Search", icon: FiSlack, handler: eventhandler },
    { name: "Join Group", icon: FiPlus, handler: joingrouphandler },
    { name: "Join Event", icon: FiUserPlus, handler:joineventhandler},
    { name: "History Search", icon: FiSearch, handler: historyhandler },
    { name: "Log Out", icon: FiPower, handler: outhandler },
  ];
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 380 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="170"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        flexDirection="column"
      >
        <Box marginTop="10px">
          <Heading>Splitmunity</Heading>
        </Box>
        <br />
        <Box>
          <Text fontSize="xl" fontFamily="monospace" fontWeight="bold">
            Login as: {Name}
          </Text>
          <Text fontSize="xl" fontFamily="monospace" fontWeight="bold">
            User ID: {uid}
          </Text>
        </Box>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} onClick={link.handler}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link href="#" style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
