import React, { useContext } from "react";
import { Button, Container, Flex, Heading, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import NotifyContext from "@pms-alpha/common/contexts/notify-context";
import AuthContext from "@pms-alpha/common/contexts/auth-context";

interface NewDiagnosis {
  name: string;
  category: string;
}

const NewDiagnosisForm: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<NewDiagnosis>();
  const notify = useContext(NotifyContext);
  const authContext = useContext(AuthContext);

  const onNewDiagnoseSubmit = async (values: NewDiagnosis) => {
    console.log(values);
  };

  return (
    <Container maxW="4xl" mt="28px" px="35px" py="21px" shadow="md" bg="white">
      <Heading my="20px" size="md" fontWeight="semibold">
        Add new diagnosis
      </Heading>

      <Flex>
        <form
          onSubmit={handleSubmit(onNewDiagnoseSubmit)}
          style={{ width: "100%" }}
        >
          <Flex flexDirection={{ base: "column", md: "row" }} w="100%">
            <Input
              {...register("name", { required: true })}
              placeholder="Name"
              width={{ base: "100%", md: "50%" }}
              mr={4}
              mb={4}
            />
            <Input
              {...register("category", { required: true })}
              placeholder="Category"
              width={{ base: "100%", md: "50%" }}
              mb={4}
            />
          </Flex>
          <Button type="submit" w={48} colorScheme="teal">
            Add
          </Button>
        </form>
      </Flex>
    </Container>
  );
};

export default NewDiagnosisForm;
