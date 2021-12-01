import React, { ReactNode } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import { Button } from "@chakra-ui/button";
import axios from "axios";
import { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Grid, Heading, Spacer, Text } from "@chakra-ui/layout";

axios.defaults.withCredentials = true

export default function HisotryModal({ handleClose, isOpen, uid }) {
  let [{result,loaded}, setresult] = useState([],false);
  let [year, setyear] = useState(null);
  let requestHistory = ()=>{
    console.log(year)
    getRes(uid,year).then((history)=>{
      setresult({result:history,loaded:true});
    },[]);
  }
  let CloseAll = ()=>{
    setyear(null);
    setresult({result:[],loaded:false});
    handleClose();
  }
  return (
    <>
      <Modal onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent minW="50vw" minH="50vh">
          <ModalHeader>History Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
            <FormControl>
              <FormLabel for="groupName">Year </FormLabel>
              <Flex>
              <Input
                type="number"
                id="year"
                name="year"
                value={year}
                onChange={(e) => {
                  year = e.target.value;
                  console.log(year)
                }}
              />
              <Button colorScheme="teal" onClick={requestHistory}>Search</Button>
              </Flex>
            </FormControl>
            </Box>
            <Flex justifyContent="space-around" flexDirection="column" >
              {loaded ? displayhis(result) : "No Result"}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={CloseAll}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

async function getRes(uid, year){
  let res = await axios.get(
    "http://localhost:8888/tr_info?user_id="+String(uid)+"&year="+String(year) 
  );
  let history = []
  console.log(res.data.data);
  for (var h in res.data.data){
    history.push(res.data.data[h]);
  }
  console.log(history)
  return history;
}

function displayhis(data) {
  return data.map((his, index) => {
    return (
      <Box
      p={5}
      shadow="xs"
      borderWidth="1">
        <Flex
          justifyContent="space-between"
        >
          <Avatar name={his.Username} src="https://bit.ly/broken-link" />
          <Spacer />
          <Box>
            <Heading fontSize="xl">💰{his.SumAmount}</Heading>
          </Box>
        </Flex>
          <Heading fontSize="xl">
            {his.Username}
          </Heading>
      </Box>
    );
  });
}
