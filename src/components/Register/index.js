import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect
} from "react-router-dom";
import axios from "axios";
import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

axios.defaults.withCredentials = true


export default function Register() {
  let [username, setusername] = useState(null);
  let [password, setpassword] = useState(null);
  let [email, setemail] = useState(null);
  let [userhomepage, setpage] = useState(null);
  let RegisterAction = async () => {
    console.log(username,password, email);
    let userpage = await RequestRegister(username,password);
    if(userpage){
      setpage(userpage)
    }
  }
  let handleUserName = (event) => {
    setusername(event.target.value);
  }
  let handlePassWord = (event) => {
    setpassword(event.target.value);
  }
  let handleEmail = event => {
    setemail(event.target.value);
  }
  if(userhomepage){
    console.log("go to homepage")
    console.log(userhomepage)
    return <Redirect to={userhomepage} />
  }
  return(
    <Box className="Register">
      <Flex justifyContent="space-between">
      <Heading>Splitmunity</Heading>
      <Box>
      <Link to={{ pathname: "/"}}>
          <Button>HomePage</Button>
      </Link>
      </Box>
      </Flex>
        <Flex width="full" height="400px" align="center" justifyContent="space-around" flexDirection="column">
          <Heading>Register</Heading>
          <Flex>
          <Text>Username:</Text>
          <input type="text" name="username" placeholder=" Username" onChange={handleUserName}/><br/>
          </Flex>
          <Flex>
          <Text>E-mail:</Text>
          <input type="email" name="email" placeholder=" example@example.com" onChange={handleEmail}/><br/>
          </Flex>
          <Flex>
          <Text>Password: </Text>
          <input type="password" name="password" placeholder=" ********" onChange={handlePassWord}/><br/>
          </Flex>
          <Button><input type="submit" onClick={RegisterAction} value="Register"/></Button>
        </Flex>
    </Box>
  )
}

async function RequestRegister(username,password,email){
  let request = {
    "username":username,
    "email":email,
    "password":password
  }
  console.log(request)
  let res = await axios.post("http://localhost:8888/register",request);
  console.log(res.data);
  if(res.data.code == 200){
    console.log("/user/"+res.data.user_id)
    let userhomepage = "/user/"+res.data.user_id
    return userhomepage
  }
  return null
}
