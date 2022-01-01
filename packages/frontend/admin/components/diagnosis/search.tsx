import React, { useContext, useEffect, useState } from "react";
import { Container, Heading } from "@chakra-ui/react";
import DataGrid from "react-data-grid";

import AuthContext from "@pms-alpha/common/contexts/auth-context";

import { ApiRequest } from "@pms-alpha/common/util/request";

import { API } from "@pms-alpha/types";

const SearchDiagnosis: React.FC = () => {
  const auth = useContext(AuthContext);
  const [data, setdata] = useState<API.Diagnosis.Data[]>([]);

  const columns = [
    { key: "id", name: "ID" },
    { key: "name", name: "Name" },
    { key: "category", name: "Category" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const {
          success,
          data: results,
          err,
        } = await ApiRequest<API.Diagnosis.Data[]>({
          path: "diagnosis",
          method: "GET",
          token: auth.token,
        });

        if (!success) throw err;

        if (!results) throw new Error("Data is undefined");

        setdata(results);
      } catch (error) {
        console.error(error);
        setdata([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxW="4xl" mt="28px" px="35px" py="21px" shadow="md" bg="white">
      <Heading my="20px" size="md" fontWeight="semibold">
        Diagnosis List
      </Heading>

      <DataGrid columns={columns} rows={data} rowKeyGetter={(row) => row.id} />
    </Container>
  );
};

export default SearchDiagnosis;
