import React, { useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import AuthContext from "@pms-alpha/common/contexts/auth-context";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";

import { ApiRequest } from "@pms-alpha/common/util/request";

import type { API } from "@pms-alpha/types";

const AddPatient: React.FC = ({}) => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);
  const router = useRouter();

  const { register, handleSubmit } = useForm<API.Patient.RegistrationForm>();

  const onSubmit = async (values: API.Patient.RegistrationForm) => {
    // manually deleting empty tp fields
    // express-validator throw errors when field exists but is empty
    if ("tp" in values.guardian && !values.guardian.tp) {
      delete values.guardian.tp;
    }

    const { success, data, err } = await ApiRequest<{ uuid: string }>({
      path: "patients/add",
      method: "POST",
      obj: values,
      token: auth.token,
    });

    if (!success) {
      notify.NewAlert({
        msg: "Invalid form data",
        description: err,
        status: "error",
      });
      return;
    }

    notify.NewAlert({
      msg: "New patient record saved",
      status: "success",
    });

    if (!data) {
      notify.NewAlert({
        msg: "No patient id received",
        description:
          "Cannot redirect to patient profile due to lack of patient id in the database response",
        status: "info",
      });
    } else {
      router.push(`/patient/${data}`);
    }
  };

  return (
    <>
      <Head>
        <title>Add Patient</title>
        <meta name="description" content="Add Patient Form" />
      </Head>

      <Container overflowY="auto" maxW="4xl" minH="100vh">
        <Heading mt={{ base: "0", md: "35px" }} size="md" fontWeight="semibold">
          Add New Patient
        </Heading>

        <Container
          maxW="4xl"
          mt="28px"
          mb={10}
          px="35px"
          py="21px"
          shadow="md"
          bg="white"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Patient Details */}
            <Heading fontWeight="semibold" size="md">
              Patient Details
              <Divider mt={2} shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              <GridItem>
                <FormControl id="firstname" isRequired>
                  <FormLabel htmlFor="firstname">First Name</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("fname", { required: true })}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="lastname">
                  <FormLabel htmlFor="lastname">Last Name</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("lname")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl as="fieldset" isRequired id="gender">
                  <FormLabel as="legend" htmlFor="gender">
                    Gender
                  </FormLabel>
                  <RadioGroup name="gender">
                    <HStack spacing="50px">
                      <Radio value="male" {...register("gender")}>
                        Male
                      </Radio>
                      <Radio value="female" {...register("gender")}>
                        Female
                      </Radio>
                      <Radio value="other" {...register("gender")}>
                        Other
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="dob">
                  <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                  <Input
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="date"
                    focusBorderColor="gray.300"
                    {...register("dob")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Heading fontWeight="semibold" size="md" mt="50px">
              Guarding Details
              <Divider mt={2} shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              <GridItem>
                <FormControl id="guardian.fnamei" isRequired>
                  <FormLabel htmlFor="guardian.fname">First Name</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("guardian.fname", { required: true })}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="guardian.lname">
                  <FormLabel htmlFor="guardian.lname">Last Name</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("guardian.lname")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="guardian.nic">
                  <FormLabel htmlFor="guardian.nic">NIC</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("guardian.nic")}
                  />
                </FormControl>
              </GridItem>

              {/* Address */}
              <GridItem colSpan={2}>
                <FormControl id="address" isRequired>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("guardian.address", { required: true })}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="guardian.mobile" isRequired>
                  <FormLabel htmlFor="guardian.mobile">Mobile Number</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("guardian.mobile")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl id="guardian.tp">
                  <FormLabel htmlFor="guardian.tp">Land Number</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("guardian.tp")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <GridItem>
              <FormControl id="internal_id">
                <FormLabel htmlFor="internal_id">Internal ID</FormLabel>
                <Input
                  focusBorderColor="gray.300"
                  borderRadius="10px"
                  background="white"
                  fontWeight="semibold"
                  type="text"
                  {...register("internal_id")}
                />
              </FormControl>
            </GridItem>

            {/* Submit Button Group */}
            <Center marginTop="14">
              <Button type="submit" colorScheme="teal" marginX="3">
                Submit
              </Button>
              <Button type="reset" marginX="3">
                Reset
              </Button>
            </Center>
          </form>
        </Container>
      </Container>
    </>
  );
};

export default AddPatient;
