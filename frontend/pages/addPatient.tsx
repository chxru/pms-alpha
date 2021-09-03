import React from "react";
import Head from "next/head";
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

interface patient_registerProps {
  firstname: string;
  lastname: string;
  dob: Date;
  gender: "male" | "female" | "other";
  marital: "married" | "unmarried";
  address: string;
  grama_niladhari: string;
  divisional_sector: string;
  contact_number: number;
  phi_tp: number;
  moh_tp: number;
  living_with: string;
  lw_name: string;
  lw_address: string;
  lw_tp: number;
  edu_status: string;
  has_job: "yes" | "no";
  job: string;
  gov_facilities: string;
  disease: string;
  treatment_his: string;
  last_clinic_visit: Date;
  informed_over_phone: Date;
  home_visit: Date;
  next_clinic_date: Date;
  hospital_admission: string;
}

const AddPatient: React.FC = ({}) => {
  const { register, handleSubmit } = useForm<patient_registerProps>();

  const onSubmit = (values: patient_registerProps) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <>
      <Head>
        <title>Add Patient</title>
        <meta name="description" content="Add Patient Form" />
      </Head>

      <Container
        overflowY="auto"
        maxW="6xl"
        minH="100vh"
        mt={10}
        borderWidth="2px"
        borderColor="white"
        borderRadius="10px"
        bg="whitesmoke"
      >
        <Heading
          mt={{ base: "0", md: "35px" }}
          size="md"
          fontWeight="semibold"
          overflowX="auto"
          overflowY="hidden"
          zIndex="sticky"
        >
          Add New Patient
        </Heading>

        <Container
          overflowY="auto"
          maxW="6xl"
          mt="35px"
          mb={10}
          px="35px"
          py="21px"
          shadow="md"
          borderWidth="2px"
          borderColor="white"
          borderRadius="10px"
          bg="white"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Patient Details */}
            <Heading fontWeight="semibold" size="md">
              Patient Details
              <Divider w="80%" shadow="dark-lg" />
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
                      <Radio value="other" {...register("gender")}>
                        Other
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </GridItem>

              {/* Date of Birth */}
              <GridItem>
                <FormControl id="dob" isRequired>
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
              <Divider w="80%" shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              {/* Address */}
              <GridItem>
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
                <FormControl id="grama_niladhari" isRequired>
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
                <FormControl id="divisional_sector" isRequired>
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
                <FormControl id="phi_tp" isRequired>
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
                <FormControl id="moh_tp" isRequired>
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
              <Divider w="80%" shadow="dark-lg" />
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
                    <option value="Alone">Alone</option>
                    <option value="With Spouse"> With Spouse</option>
                    <option value="With Sibilings">With Sibilings</option>
                    <option value="With Children">With Children</option>
                    <option value="With Relation">With Relations</option>
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
              <Divider w="80%" shadow="dark-lg" />
            </Heading>

            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
            >
              {/* Edu Status */}
              <GridItem>
                <FormControl id="lw_tp" isRequired>
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
                      <Radio value="yes" {...register("has_job")}>
                        Yes
                      </Radio>
                      <Radio value="no" {...register("has_job")}>
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
              <GridItem>
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
              <Divider w="80%" shadow="dark-lg" />
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
                  <FormLabel htmlFor="disease">Disease</FormLabel>
                  <Input
                    focusBorderColor="gray.300"
                    borderRadius="10px"
                    background="white"
                    fontWeight="semibold"
                    type="text"
                    {...register("disease")}
                  />
                </FormControl>
              </GridItem>

              {/* Treatment History */}
              <GridItem>
                <FormControl id="treatment_his" isRequired>
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
                <FormControl id="last_clinic_visit" isRequired>
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
                <FormControl id="informed_over_phone" isRequired>
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
                <FormControl id="home_visit" isRequired>
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

              {/* Next Clinc Date */}
              <GridItem>
                <FormControl id="next_clinic_date" isRequired>
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

            {/* Submit Button Group */}
            <Center marginTop="14">
              <Button type="submit" colorScheme="facebook" marginX="3">
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
