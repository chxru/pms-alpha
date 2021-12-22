import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Heading,
  Flex,
  Input,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ButtonGroup,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { Column, usePagination, useTable } from "react-table";

import { ApiRequest } from "@pms-alpha/common/util/request";
import AuthContext from "@pms-alpha/common/contexts/auth-context";

import { API } from "@pms-alpha/types";

type ColumnStruct = API.Diagnosis.Data;

const SearchDiagnosis: React.FC = () => {
  const auth = useContext(AuthContext);
  const [data, setdata] = useState<API.Diagnosis.Data[]>([]);

  const columns = useMemo<Column<ColumnStruct>[]>(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      {
        Header: "Actions",
        id: "actions",
        Cell: function ActionButtons() {
          return (
            <ButtonGroup>
              <Button>Edit</Button>
              <Button>Delete</Button>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<ColumnStruct>(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    usePagination
  );

  return (
    <Container maxW="4xl" mt="28px" px="35px" py="21px" shadow="md" bg="white">
      <Heading my="20px" size="md" fontWeight="semibold">
        Search diagnosis
      </Heading>

      <Flex>
        <Input placeholder="Enter name..." />
        <Button w={48} ml={4}>
          Search
        </Button>
      </Flex>

      <Table {...getTableProps()} variant="simple" mt={7}>
        <Thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <Tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps();
                  return (
                    <Th key={key} {...restColumn}>
                      {column.render("Header")}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
        </Thead>

        <Tbody {...getTableBodyProps}>
          {page.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <Tr key={key} {...restRowProps}>
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <Td key={key} {...restCellProps}>
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              aria-label="First Page"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<FiChevronsLeft />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Previous Page"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<FiChevronLeft />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink={0} mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
          <Text flexShrink={0}>Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value) => {
              const page = value ? parseInt(value) - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label="Next Page"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<FiChevronRight />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label="Last Page"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<FiChevronsRight />}
              ml={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Container>
  );
};

export default SearchDiagnosis;
