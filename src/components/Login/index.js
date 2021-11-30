import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect,
} from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
  
  export default function Login() {
    let [username, setusername] = useState(null);
    let [password, setpassword] = useState(null);
    let [userhomepage, setpage] = useState(null);
    let LoginAction = async () => {
      console.log(username, password);
      let userpage = await RequestLogin(username, password);
      if (userpage) {
        setpage(userpage);
      }
    };
    let handleUserName = (event) => {
      setusername(event.target.value);
    };
    let handlePassWord = (event) => {
      setpassword(event.target.value);
    };
    if (userhomepage) {
      console.log("go to homepage");
      console.log(userhomepage);
      return <Redirect to={userhomepage} />;
    }
    return (
      <Flex
        minH={'70vh'}
        align={'center'}
        justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Username</FormLabel>
                <Input type="text" name="username" placeholder=" Username" onChange={handleUserName}/>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" placeholder=" ********" onChange={handlePassWord} />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Remember me</Checkbox>
                  <Link color={'blue.400'}>Forgot password?</Link>
                </Stack>
                <Button onClick={LoginAction}
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }

  async function RequestLogin(username, password) {
    let request = {
      username: username,
      password: password,
    };
    console.log(request);
    let res = await axios.post("http://localhost:8888/login", request);
    console.log(res.data);
    if (res.data.code == 200) {
      console.log("/user/" + res.data.user_id);
      let userhomepage = "/user/" + res.data.user_id;
      return userhomepage;
    }
    alert(res.data.status)
    return null;
  }