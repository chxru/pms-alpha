import React from "react";
import { Button, ButtonGroup, Text, useDisclosure } from "@chakra-ui/react";
import NewRecord from "./new";

interface bedticketProps {
  bid: number;
}

const BedTicket: React.FC<bedticketProps> = ({ bid }) => {
  const {
    isOpen: nr_isOpen,
    onOpen: nr_onOpen,
    onClose: nr_onClose,
  } = useDisclosure();
  return (
    <>
      <Text>No records for {bid}</Text>
      <ButtonGroup mt={2}>
        <Button colorScheme="facebook" onClick={nr_onOpen}>
          Add New Record
        </Button>
        <Button colorScheme="orange">Discharge</Button>
      </ButtonGroup>

      <NewRecord isOpen={nr_isOpen} onClose={nr_onClose} bid={bid} />
    </>
  );
};

export default BedTicket;
