import React, { useContext } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiBell, FiLogOut, FiMenu, FiSearch } from "react-icons/fi";

import AuthContext from "contexts/auth-context";

interface sidebarProps {
  name: string;
  route: string;
}

const NavItem: React.FC<sidebarProps> = ({ name, route }) => {
  const router = useRouter();

  return (
    <Flex
      align="center"
      px="4"
      pl="4"
      py="3"
      cursor="pointer"
      color="black"
      _hover={{
        bg: "gray.200",
        color: "gray.800",
      }}
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      onClick={() => {
        router.push(route);
      }}
    >
      {name}
    </Flex>
  );
};

const SidebarContent = (props: {
  display?: { [key: string]: string };
  w?: string;
  borderRight?: string;
}) => {
  return (
    <Flex
      as="nav"
      direction="column"
      justify="space-between"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="4"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      borderColor="gray.200"
      borderRightWidth="1px"
      w="60"
      shadow="sm"
      {...props}
    >
      <Box>
        <Flex px="4" py="5" align="center">
          <Text fontSize="2xl" ml="2" color="black" fontWeight="semibold">
            PMS
          </Text>
        </Flex>

        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          <NavItem name="Dashboard" route="/" />
          <NavItem name="Add Patient" route="/patient/new" />
          <NavItem name="Search" route="/search" />
          <NavItem name="Calender" route="/dashboard" />
        </Flex>
      </Box>
      <Box textAlign="center">
        <Text>pms-alpha-0.1.0</Text>
      </Box>
    </Flex>
  );
};

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const sidebar = useDisclosure();
  const authContext = useContext(AuthContext);

  return (
    <Box as="section" bg="gray.50" minH="100vh" backgroundColor="#f8f8f8">
      <SidebarContent display={{ base: "none", md: "flex" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>

      <Flex
        direction="column"
        minH="100vh"
        ml={{ base: 0, md: 60 }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify={{ base: "space-between", md: "right" }}
          w="full"
          p="4"
          bg="white"
        >
          <Flex
            direction="row"
            align="center"
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              aria-label="Menu"
              onClick={sidebar.onOpen}
              icon={<Icon color="gray.500" as={FiMenu} cursor="pointer" />}
              size="lg"
              mr={5}
            />
            <Text fontSize="2xl" ml="2" color="black" fontWeight="semibold">
              PMS
            </Text>
          </Flex>

          <Flex align="center">
            <InputGroup w={{ base: "56", md: "96" }} mr={4}>
              <InputLeftElement color="gray.500">
                <FiSearch />
              </InputLeftElement>
              <Input placeholder="Search for patient..." />
            </InputGroup>

            <Icon color="gray.500" as={FiBell} cursor="pointer" mr={5} />

            <Icon
              color="gray.500"
              as={FiLogOut}
              cursor="pointer"
              mr={5}
              fontSize="lg"
              onClick={() => {
                authContext.onSignOut();
                router.push("/login");
              }}
            />
          </Flex>
        </Flex>

        <Flex
          direction="column"
          grow={1}
          shrink={1}
          as="main"
          pb="8"
          overflowX="hidden"
          backgroundColor="#f8f8f8"
        >
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};
export default Sidebar;
