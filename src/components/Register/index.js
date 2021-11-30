import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
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
  Link,
  useParams,
  Redirect,
} from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Register() {
  let [username, setusername] = useState(null);
  let [password, setpassword] = useState(null);
  let [email, setemail] = useState(null);
  let [userhomepage, setpage] = useState(null);
  let RegisterAction = async () => {
    console.log(username, password, email);
    let userpage = await RequestRegister(username, password);
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
  let handleEmail = (event) => {
    setemail(event.target.value);
  }
  let sleep = function(time){
    setTimeout(()=>{
    },time);
  }
  async function RequestRegister(){
    let request = {
      username: username,
      email: email,
      password: password,
    };
    console.log(request);
    let res = await axios.post("http://localhost:8888/register", request);
    console.log(res.data);
    if (res.data.code == 200) {
      console.log("/user/" + res.data.user_id);
      let userhomepage = "/user/" + res.data.user_id;
      return userhomepage;
    }
    alert(res.data.status)
    return null
  }
  if(userhomepage){
    console.log("go to homepage")
    console.log(userhomepage)
    sleep(1000)
    return <Redirect to={userhomepage} />
  }

  return (
    <Flex
      minH={'70vh'}
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up with a new account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="userName" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input type="text" name="username" placeholder=" Username" onChange={handleUserName} />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" placeholder=" example@example.com" onChange={handleEmail} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type="password" name="password" placeholder=" ********" onChange={handlePassWord} />
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Button
                onClick={RegisterAction}
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link to={{pathname:"/login"}} color="blue">Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
