import React from "react";
import Head from "next/head";
import {
  Box,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { Icon } from "@chakra-ui/icon";

const ProfileView: React.FC = ({}) => {
  return (
    <>
      <Head>
        <title>Profile View</title>
        <meta name="description" content="Profile View" />
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
        <Flex align="center" pl={2} mt={5}>
          <Box
            w="100%"
            h="max-content"
            mr={3}
            mb={{ base: "10px", md: "none" }}
            borderRadius="15px"
            borderWidth="2px"
            shadow="lg"
            bg="white"
          >
            {/* Patient Name */}
            <Center>
              <HStack>
                <Heading size="md" fontWeight="semibold" my={2}>
                  David Miller
                </Heading>
                <Flex
                  align="center"
                  py="20px"
                  cursor="pointer"
                  //Add onClick for edit option
                >
                  <Icon
                    color="gray.500"
                    as={FiEdit}
                    cursor="pointer"
                    ml={5}
                    fontSize="2xl"
                  />
                </Flex>
              </HStack>
            </Center>

            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab _focus={{ _focus: "none" }}>Personal Details</Tab>
                <Tab _focus={{ _focus: "none" }}>Medical Details</Tab>
              </TabList>
              <TabPanels>
                {/* Personal Details Tab*/}
                <TabPanel>
                  {/* Basic Details */}
                  <Heading
                    size="sm"
                    mx={3}
                    fontWeight="semibold"
                    my={2}
                    textColor="gray.700"
                  >
                    Basic Details
                    <Divider w="80%" />
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }}>
                    {/* Gender */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Gender
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Male
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Birthday */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Birthday
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        1997-08-11
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Marital Status*/}
                    <Flex direction="column" ml={6} mt={4} pr={2}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Marital Status
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Married
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Age */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Age
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        24 years
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
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
                    <Divider w="80%" />
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }}>
                    {/* Address */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Address
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        No,152/2 Galle Rd, Rathnapura
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Grama Niladari */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        GN Sector
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Rathnapura
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* DS Sector */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        DS Sector
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Kaluthara
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Contact Details */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Mobile
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        0772258635
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* PHI */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        PHI
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        0772258635
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* MOH */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        MOH
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        0772258635
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
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
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }}>
                    {/* Living With */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Living With
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Alone
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Other Person Name */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Name
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      ></Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Other Person Address */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Address
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      ></Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Other Person Mobile */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Mobile
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      ></Text>
                      <Divider width="80px" mb={5}></Divider>
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
                    <Divider w="80%" />
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }}>
                    {/* Edu Status */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Education
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        1-5 , OL
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Job*/}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Job
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Engineer
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Sahanadara */}
                    <Flex direction="column" mx={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        GOV. Sahanadara
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      ></Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>
                  </SimpleGrid>
                </TabPanel>

                {/* Medical Details Tab */}
                <TabPanel>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }}>
                    {/* Disease */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Disease
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Depression
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Treatment */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Treatment History
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        Clogapine , ECT
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Last Clinc Visit*/}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Last Clinc
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        06/05/2021
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>

                    {/* Date of informed Over phone */}
                    <Flex direction="column" ml={6} mt={4}>
                      <Text
                        fontWeight="bold"
                        textColor="gray.500"
                        fontSize="sm"
                      >
                        Informed over Phone
                      </Text>
                      <Text
                        fontWeight="semibold"
                        textColor="gray.400"
                        mb={2}
                        fontSize="sm"
                      >
                        06/05/2021
                      </Text>
                      <Divider width="80px" mb={5}></Divider>
                    </Flex>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default ProfileView;
