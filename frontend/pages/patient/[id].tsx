import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
} from "@chakra-ui/react";

import BedTicket from "frontend/components/bedticket/view";

import { ApiRequest } from "frontend/util/request";
import AuthContext from "frontend/contexts/auth-context";
import NotifyContext from "frontend/contexts/notify-context";

import type { PGDB } from "types/pg";

const ProfileView: React.FC = ({}) => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  const [patient, setpatientData] = useState<PGDB.Patient.BasicDetails>();
  const [age, setage] = useState<string>();
  const [creatingBD, setcreatingBD] = useState<boolean>(false);

  /**
   * Capitalize first letter of each word
   *
   * @param {string} string
   * @return {*}  {string}
   */
  const FormatText = (string: string): string =>
    string
      .split(" ")
      .map((m) => m[0].toUpperCase() + m.substr(1))
      .join(" ");

  const FetchPatientInfo = async () => {
    const { id } = router.query;
    let { success, data, err } = await ApiRequest<PGDB.Patient.BasicDetails>({
      path: `patients/${id}/basic`,
      method: "GET",
      token: auth.token,
    });

    if (!success || err) {
      notify.NewAlert({
        msg: "Fetching patient info failed",
        description: err,
        status: "error",
      });

      // redirect back
      router.back();
      return;
    }

    if (!data) {
      notify.NewAlert({
        msg: "Request didn't came with expected response",
        status: "error",
      });

      // redirect back
      router.back();
      return;
    }

    // format the input
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if (typeof element === "string") {
          data[key] = FormatText(element);
        }

        if (key === "dob") {
          if (!element) return;

          // calculate age
          // dob is saved in yyyy-mm-dd
          const t = element
            .toString()
            .split("-")
            .map((e: string) => parseInt(e));
          const dob = new Date(t[0], t[1], t[2]);
          const today = new Date();

          const diff = Math.floor(today.getTime() - dob.getTime());
          const years = Math.floor(diff / (1000 * 3600 * 24 * 365.25));

          setage(`${years} years`);
        }
      }
    }

    setpatientData(data);
  };

  const CreateBedTicket = async () => {
    setcreatingBD(true);

    const { success, err } = await ApiRequest({
      path: `/bedtickets/new/${router.query.id}`,
      method: "POST",
      token: auth.token,
    });

    if (!success || err) {
      notify.NewAlert({
        msg: "Creating new bed ticket failed",
        description: typeof err === "string" ? err : "",
        status: "error",
      });

      return;
    }

    notify.NewAlert({
      msg: "Bed ticket successfully created",
      status: "success",
    });

    // re-fetch patient details
    await FetchPatientInfo();

    setcreatingBD(false);
  };

  // onMount
  useEffect(() => {
    (async () => {
      await FetchPatientInfo();
    })();
    // FIXME:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>
          {patient?.firstname} {patient?.lastname}
        </title>
        <meta name="description" content="Profile View" />
      </Head>

      <Container overflowY="auto" maxW="4xl" minH="100vh">
        <Flex align="center" pl={2} mt={5} flexDirection="column">
          <Container
            maxW="4xl"
            mt="28px"
            mb={10}
            px="35px"
            py="21px"
            shadow="md"
            bg="white"
          >
            <Heading my="20px" size="md" fontWeight="semibold">
              {patient?.firstname} {patient?.lastname}
            </Heading>

            <Accordion allowToggle allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Text>Personal details</Text>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel>
                  {/* Basic Details */}
                  <Heading
                    size="sm"
                    mx={3}
                    fontWeight="semibold"
                    my={2}
                    textColor="gray.700"
                  >
                    Basic Details
                  </Heading>

                  <Divider />

                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} pb={4}>
                    {/* Gender */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Gender</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.gender}
                      </Text>
                    </Flex>

                    {/* Birthday */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Birthday</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.dob}
                      </Text>
                    </Flex>

                    {/* Marital Status*/}
                    <Flex direction="column" ml={6} mt={4} pr={2}>
                      <Text>Marital Status</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.marital}
                      </Text>
                    </Flex>

                    {/* Age */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Age</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {age}
                      </Text>
                    </Flex>
                  </SimpleGrid>

                  {/* Contact Details */}
                  <Heading
                    size="sm"
                    mx={3}
                    fontWeight="semibold"
                    my={2}
                    textColor="gray.700"
                  >
                    Contact Details
                  </Heading>
                  <Divider />

                  <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }} pb={4}>
                    {/* Address */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Address</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.address}
                      </Text>
                    </Flex>

                    {/* Grama Niladari */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>GN Sector</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.grama_niladhari}
                      </Text>
                    </Flex>

                    {/* DS Sector */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>DS Sector</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.divisional_sector}
                      </Text>
                    </Flex>

                    {/* Contact Details */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Mobile</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.contact_number}
                      </Text>
                    </Flex>

                    {/* PHI */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>PHI</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.phi_tp}
                      </Text>
                    </Flex>

                    {/* MOH */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>MOH</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.moh_tp}
                      </Text>
                    </Flex>
                  </SimpleGrid>

                  {/* Living With */}
                  <Heading
                    size="sm"
                    mx={3}
                    fontWeight="semibold"
                    my={2}
                    textColor="gray.700"
                  >
                    Relatives Details
                    <Divider w="80%" />
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }} pb={4}>
                    {/* Living With */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Living With</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.living_with}
                      </Text>
                    </Flex>

                    {/* Other Person Name */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Name</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.lw_name}
                      </Text>
                    </Flex>

                    {/* Other Person Address */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Address</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.lw_address}
                      </Text>
                    </Flex>

                    {/* Other Person Mobile */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Mobile</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.lw_tp}
                      </Text>
                    </Flex>
                  </SimpleGrid>

                  {/* Other Details */}
                  <Heading
                    size="sm"
                    mx={3}
                    fontWeight="semibold"
                    my={2}
                    textColor="gray.700"
                  >
                    Other Details
                  </Heading>
                  <Divider />

                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} pb={4}>
                    {/* Edu Status */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Education</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.edu_status && patient?.edu_status.join(" ")}
                      </Text>
                    </Flex>

                    {/* Job*/}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>Job</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.has_job ? patient.job : "Unemployeed"}
                      </Text>
                    </Flex>

                    {/* Sahanadara */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text>GOV. Sahanadara</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.gov_facilities}
                      </Text>
                    </Flex>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Text>Medical Details</Text>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }}>
                    {/* Disease */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Disease</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.diseases}
                      </Text>
                    </Flex>

                    {/* Treatment */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Treatment History</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.treatment_his &&
                          patient?.treatment_his.join(" ")}
                      </Text>
                    </Flex>

                    {/* Last Clinc Visit*/}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Last Clinc</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.last_clinic_visit}
                      </Text>
                    </Flex>

                    {/* Date of informed Over phone */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text>Informed over Phone</Text>
                      <Text fontWeight="semibold" mb={2}>
                        {patient?.informed_over_phone}
                      </Text>
                    </Flex>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Container>

          <Container
            maxW="4xl"
            mt="28px"
            mb={10}
            px="35px"
            py="21px"
            shadow="md"
            bg="white"
          >
            <Heading my="20px" size="md" fontWeight="semibold">
              Bed Ticket
            </Heading>

            {patient?.current_bedticket ? (
              <BedTicket bid={patient.current_bedticket} />
            ) : (
              <>
                <Text>Patient has no active bed ticket record</Text>
                <Button
                  colorScheme="facebook"
                  mt={2}
                  onClick={CreateBedTicket}
                  disabled={creatingBD}
                >
                  Create Bed Ticket
                </Button>
              </>
            )}
          </Container>
        </Flex>
      </Container>
    </>
  );
};

export default ProfileView;
