import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import type { PGDB } from "types/pg";

interface newProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewRecord: React.FC<newProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<PGDB.Patient.BedTicketEntry, "created_at">>();

  const OnSubmit = async (value: PGDB.Patient.BedTicketEntry) => {
    console.log(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Add New Entry</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(OnSubmit)}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Entry type</FormLabel>
              <Select
                placeholder="Select record type"
                {...register("type", { required: true })}
              >
                <option>Diagnosis</option>
                <option>Report</option>
                <option>Other</option>
              </Select>
              {errors.type && (
                <FormHelperText>This field is required</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea {...register("note")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="facebook" mr={3}>
              Submit
            </Button>
            <Button
              type="reset"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewRecord;
