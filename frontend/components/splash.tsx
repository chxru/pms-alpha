import React from "react";
import { Box, Flex, Heading, Progress } from "@chakra-ui/react";

const Spash: React.FC = ({}) => {
  return (
    <Flex
      width="100vw"
      height="100vh"
      justify="center"
      align="center"
      flexDirection="column"
    >
      <Box>
        <Heading>PMS - Alpha</Heading>
        <Progress
          mt="5px"
          size="xs"
          colorScheme="teal"
          isIndeterminate
          isAnimated
        />
      </Box>
    </Flex>
  );
};

export default Spash;
