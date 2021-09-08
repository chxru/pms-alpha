import React, { useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
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
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import AuthContext from "../../contexts/auth-context";
import NotifyContext from "../../contexts/notify-context";

import { ApiRequest } from "../../util/request";

import type { API } from "../../../types/api";

const AddPatient: React.FC = ({}) => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);
  const router = useRouter();

  const { register, handleSubmit } = useForm<API.Patient.BasicDetails>();

  const onSubmit = async (values: API.Patient.BasicDetails) => {
    // remove empty fields from the values object
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        if (!values[key]) {
          delete values[key];
        }
      }
    }

    const { success, data, err } = await ApiRequest<{ id: number }>({
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
      router.push(`/patient/${data.id}`);
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
              {/* First Name */}
              <GridItem>
                <FormControl id="firstname" isRequired>
                  <FormLabel htmlFor="firstname">First Name</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("firstname")}
                  />
                </FormControl>
              </GridItem>

              {/* Last Name */}
              <GridItem>
                <FormControl id="lastname" isRequired>
                  <FormLabel htmlFor="lastname">Last Name</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("lastname")}
                  />
                </FormControl>
              </GridItem>

              {/* Gender */}
              <GridItem>
                <FormControl as="fieldset" isRequired id="gender">
                  <FormLabel as="legend"> Gender </FormLabel>
                  <RadioGroup name="gender">
                    <HStack spacing="50px">
                      <Radio value="male" {...register("gender")}>
                        Male
                      </Radio>
                      <Radio value="female" {...register("gender")}>
                        Female
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </GridItem>

              {/* Date of Birth */}
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

              {/* Marital status */}
              <GridItem>
                <FormControl as="fieldset" isRequired id="marital">
                  <FormLabel as="legend"> Marital Status </FormLabel>
                  <RadioGroup name="marital">
                    <HStack spacing="50px">
                      <Radio value="married" {...register("marital")}>
                        Married
                      </Radio>
                      <Radio value="unmarried" {...register("marital")}>
                        Unmarried
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
            </Grid>

            {/* Contact Informations  */}
            <Heading fontWeight="semibold" size="md" mt="50px">
              Contact Details
              <Divider mt={2} shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
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
                    {...register("address")}
                  />
                </FormControl>
              </GridItem>

              {/* Grama Niladari Sector */}
              <GridItem>
                <FormControl id="grama_niladhari">
                  <FormLabel htmlFor="grama_niladhari">
                    Grama Niladari Sector
                  </FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("grama_niladhari")}
                  />
                </FormControl>
              </GridItem>

              {/* Divisional Sector */}
              <GridItem>
                <FormControl id="divisional_sector">
                  <FormLabel htmlFor="divisional_sector">
                    Divisional Seceratory
                  </FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("divisional_sector")}
                  />
                </FormControl>
              </GridItem>

              {/* Contact Number */}
              <GridItem>
                <FormControl id="contact_number" isRequired>
                  <FormLabel htmlFor="contact_number">Contact Number</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("contact_number")}
                  />
                </FormControl>
              </GridItem>

              {/* PHI Contact Number */}
              <GridItem>
                <FormControl id="phi_tp">
                  <FormLabel htmlFor="phi_tp">PHI Contact Number</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("phi_tp")}
                  />
                </FormControl>
              </GridItem>

              {/* MOH Contact Number */}
              <GridItem>
                <FormControl id="moh_tp">
                  <FormLabel htmlFor="moh_tp">MOH Contact Number</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("moh_tp")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            {/* Living With */}
            <Heading fontWeight="semibold" size="md" mt="50px">
              Relatives Details
              <Divider mt={2} shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              {/* Living with */}
              <GridItem>
                <FormControl isRequired id="living_with">
                  <FormLabel htmlFor="living_with"> Living With </FormLabel>
                  <Select
                    {...register("living_with")}
                    placeholder="Select who patient live with"
                    focusBorderColor="gray.300"
                  >
                    <option value="alone">Alone</option>
                    <option value="spouse"> With Spouse</option>
                    <option value="sibilings">With Sibilings</option>
                    <option value="children">With Children</option>
                    <option value="relations">With Relations</option>
                  </Select>
                </FormControl>
              </GridItem>

              {/* Other Person's Name */}
              <GridItem>
                <FormControl id="lw_name">
                  <FormLabel htmlFor="lw_name">Name of Other person </FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("lw_name")}
                  />
                </FormControl>
              </GridItem>

              {/* Other Person Address */}
              <GridItem>
                <FormControl id="lw_address">
                  <FormLabel htmlFor="lw_address">Address</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("lw_address")}
                  />
                </FormControl>
              </GridItem>

              {/* Other Person Number */}
              <GridItem>
                <FormControl id="lw_tp">
                  <FormLabel htmlFor="lw_tp">Contact Number</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("lw_tp")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            {/*  Other Details */}
            <Heading fontWeight="semibold" size="md" mt="50px">
              Other Details
              <Divider mt={2} shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              {/* Edu Status */}
              <GridItem>
                <FormControl id="lw_tp">
                  <FormLabel htmlFor="lw_tp">
                    Educational Qualification
                  </FormLabel>
                  <CheckboxGroup>
                    <HStack spacing="50px">
                      <Checkbox value="1-5" {...register("edu_status")}>
                        1-5
                      </Checkbox>
                      <Checkbox value="6-OL" {...register("edu_status")}>
                        6-OL
                      </Checkbox>
                      <Checkbox value="AL" {...register("edu_status")}>
                        AL
                      </Checkbox>
                    </HStack>
                  </CheckboxGroup>
                </FormControl>
              </GridItem>

              {/* Has job? */}
              <GridItem>
                <FormControl as="fieldset" isRequired id="has_job">
                  <FormLabel as="legend"> Is Patient has a job </FormLabel>
                  <RadioGroup name="has_job">
                    <HStack spacing="50px">
                      <Radio value="true" {...register("has_job")}>
                        Yes
                      </Radio>
                      <Radio value="false" {...register("has_job")}>
                        No
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </GridItem>

              {/* Job */}
              <GridItem>
                <FormControl id="job">
                  <FormLabel htmlFor="job">Job</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("job")}
                  />
                </FormControl>
              </GridItem>

              {/* Sahanadara from Gov */}
              <GridItem colStart={1}>
                <FormControl id="gov_facilities">
                  <FormLabel htmlFor="gov_facilities">
                    Sahanadara Received From Government
                  </FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("gov_facilities")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            {/* Medical Details */}
            <Heading fontWeight="semibold" size="md" mt="50px">
              Medical Details
              <Divider mt={2} shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              {/* Disease */}
              <GridItem>
                <FormControl id="disease" isRequired>
                  <FormLabel htmlFor="disease">Diseases</FormLabel>
                  <Input
                    placeholder="Use comma to separate diseases"
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("diseases")}
                  />
                </FormControl>
              </GridItem>

              {/* Treatment History */}
              <GridItem>
                <FormControl id="treatment_his">
                  <FormLabel htmlFor="treatment_his">
                    Treatment History
                  </FormLabel>
                  <CheckboxGroup>
                    <HStack spacing="50px">
                      <Checkbox
                        value="Clogapine"
                        {...register("treatment_his")}
                      >
                        Clogapine
                      </Checkbox>
                      <Checkbox
                        value="Depo injection"
                        {...register("treatment_his")}
                      >
                        Depo injection
                      </Checkbox>
                      <Checkbox value="ECT" {...register("treatment_his")}>
                        ECT
                      </Checkbox>
                    </HStack>
                  </CheckboxGroup>
                </FormControl>
              </GridItem>

              {/* Last Clinic Visit */}
              <GridItem>
                <FormControl id="last_clinic_visit">
                  <FormLabel htmlFor="last_clinic_visit">
                    Last Clinic Visit
                  </FormLabel>
                  <Input
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="date"
                    focusBorderColor="gray.300"
                    {...register("last_clinic_visit")}
                  />
                </FormControl>
              </GridItem>

              {/* Date of informed Over phone */}
              <GridItem>
                <FormControl id="informed_over_phone">
                  <FormLabel htmlFor="informed_over_phone">
                    Informed Over Phone
                  </FormLabel>
                  <Input
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="date"
                    focusBorderColor="gray.300"
                    {...register("informed_over_phone")}
                  />
                </FormControl>
              </GridItem>

              {/* Home Visit Date */}
              <GridItem>
                <FormControl id="home_visit">
                  <FormLabel htmlFor="home_visit">Home Visit</FormLabel>
                  <Input
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="date"
                    focusBorderColor="gray.300"
                    {...register("home_visit")}
                  />
                </FormControl>
              </GridItem>

              {/* Next Clinc Date */}
              <GridItem>
                <FormControl id="next_clinic_date">
                  <FormLabel htmlFor="next_clinic_date">
                    Next Clinc Date
                  </FormLabel>
                  <Input
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="date"
                    focusBorderColor="gray.300"
                    {...register("next_clinic_date")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            {/* Hospital Admission */}
            <GridItem>
              <FormControl id="hospital_admission" isRequired>
                <FormLabel htmlFor="hospital_admission">
                  Hospital Admission
                </FormLabel>
                <Input
                  focusBorderColor="gray.300"
                  borderRadius="10px"
                  background="white"
                  fontWeight="semibold"
                  type="text"
                  {...register("hospital_admission")}
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
