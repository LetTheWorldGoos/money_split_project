import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

export default function Home() {
  return(
  <Box>
    <Heading  width="full" height="full" align="center">Splitmunity</Heading>
    <Flex width="full" height="full" align="center" justifyContent="space-around">
      <Box>
      <Link to={{ pathname: "/login"}}>
          <Button>Log In</Button>
        </Link>
      </Box>
      <Box>
      <Link to={{ pathname: "/register"}}>
          <Button>Register</Button>
        </Link>
      </Box>
    </Flex>
  </Box>
  )
}
