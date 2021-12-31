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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import BedTicket from "components/bedticket/view";

import { ApiRequest } from "@pms-alpha/common/util/request";
import AuthContext from "@pms-alpha/common/contexts/auth-context";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";

import type { PGDB } from "@pms-alpha/types";

const ProfileView: React.FC = ({}) => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  // types are stupid here
  const id = parseInt(
    (Array.isArray(router.query.id) ? router.query.id[0] : router.query.id) ||
      "0"
  );

  const [patient, setpatientData] = useState<PGDB.Patient.BasicDetails>();
  const [creatingBD, setcreatingBD] = useState<boolean>(false);

  /**
   * Capitalize first letter of each word
   *
   * @param {string} string
   * @return {*}  {string}
   */
  const CapitalizeFL = (string?: string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : string;

  /**
   * Calculate age
   *
   * @param {string} dob_string
   * @return {*}  {number}
   */
  const AgeCal = (dob_string: string): number => {
    const dob = new Date(dob_string);
    const today = new Date();

    const diff = Math.floor(today.getTime() - dob.getTime());
    const years = Math.floor(diff / (1000 * 3600 * 24 * 365.25));
    return years;
  };

  /**
   * Fetch patient data from backend
   *
   * @return {*}
   */
  const FetchPatientInfo = async () => {
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

    setpatientData(data);
  };

  const CreateBedTicket = async () => {
    setcreatingBD(true);

    const { success, err } = await ApiRequest({
      path: `bedtickets/new/${router.query.id}`,
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
          {CapitalizeFL(patient?.fname)} {CapitalizeFL(patient?.lname)}
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
              {CapitalizeFL(patient?.fname)} {CapitalizeFL(patient?.lname)}
            </Heading>

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
                  {CapitalizeFL(patient?.gender)}
                </Text>
              </Flex>

              {/* Birthday */}
              <Flex direction="column" ml={6} mt={4}>
                <Text>Birthday</Text>
                <Text fontWeight="semibold" mb={2}>
                  {patient?.dob}
                </Text>
              </Flex>

              {/* Age */}
              <Flex direction="column" ml={6} mt={4}>
                <Text>Age</Text>
                <Text fontWeight="semibold" mb={2}>
                  {patient?.dob ? AgeCal(patient.dob) : "N/A"}
                </Text>
              </Flex>
            </SimpleGrid>

            {/* Guardian Details */}
            <Heading
              size="sm"
              mx={3}
              fontWeight="semibold"
              my={2}
              textColor="gray.700"
            >
              Guardian Details
            </Heading>
            <Divider />

            <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }} pb={4}>
              <Flex direction="column" mx={6} mt={4}>
                <Text>First Name</Text>
                <Text fontWeight="semibold" mb={2}>
                  {CapitalizeFL(patient?.guardian.fname)}
                </Text>
              </Flex>

              <Flex direction="column" mx={6} mt={4}>
                <Text>Last Name</Text>
                <Text fontWeight="semibold" mb={2}>
                  {CapitalizeFL(patient?.guardian?.lname)}
                </Text>
              </Flex>

              <Flex direction="column" mx={6} mt={4}>
                <Text>NIC</Text>
                <Text fontWeight="semibold" mb={2}>
                  {patient?.guardian.nic}
                </Text>
              </Flex>

              <Flex direction="column" mx={6} mt={4}>
                <Text>Address</Text>
                <Text fontWeight="semibold" mb={2}>
                  {CapitalizeFL(patient?.guardian.address)}
                </Text>
              </Flex>

              <Flex direction="column" mx={6} mt={4}>
                <Text>Mobile Number</Text>
                <Text fontWeight="semibold" mb={2}>
                  {patient?.guardian.mobile}
                </Text>
              </Flex>

              <Flex direction="column" mx={6} mt={4}>
                <Text>Land Number</Text>
                <Text fontWeight="semibold" mb={2}>
                  {patient?.guardian?.tp}
                </Text>
              </Flex>
            </SimpleGrid>
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

            <Tabs>
              <TabList>
                <Tab>Active</Tab>
                <Tab>History</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {patient?.current_bedticket ? (
                    <BedTicket
                      bid={patient.current_bedticket}
                      pid={id}
                      state={setpatientData}
                    />
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
                </TabPanel>
                <TabPanel>
                  <Accordion allowToggle allowMultiple>
                    {Array.isArray(patient?.bedtickets) &&
                      patient?.bedtickets
                        .filter((b) => b.id !== patient.current_bedticket)
                        .map((h) => {
                          return (
                            <AccordionItem key={"his" + h.id.toString()}>
                              {({ isExpanded }) => (
                                <>
                                  <AccordionButton>
                                    <Text>
                                      {new Date(
                                        h.admission_date
                                      ).toLocaleDateString()}{" "}
                                      -{" "}
                                      {h.discharge_date
                                        ? new Date(
                                            h.discharge_date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </Text>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel>
                                    {isExpanded ? (
                                      <BedTicket bid={h.id} pid={id} />
                                    ) : (
                                      <Text>Loading</Text>
                                    )}
                                  </AccordionPanel>
                                </>
                              )}
                            </AccordionItem>
                          );
                        })}
                  </Accordion>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Flex>
      </Container>
    </>
  );
};

export default ProfileView;
