import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  Button,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// ---------------- Apollo Client Setup ----------------
const httpLink = createHttpLink({
  uri: 'http://192.168.1.78:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// ---------------- GraphQL Queries ----------------
const GET_ALL_WORKSPACES = gql`
  query GetAllWorkSpaces {
    getAllWorkSpaces {
      id
      name
    }
  }
`;

const ADD_USER_TO_WORKSPACE = gql`
  mutation AddUserToWorkspace($input: AddUserToWorkspaceInput!) {
    addUserToWorkspace(input: $input) {
      id
    }
  }
`;

const AddUser = ({ onClose, onAdd }) => {
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const labelColor = useColorModeValue('secondaryGray.600', 'gray.400');
  const inputBg = useColorModeValue('secondaryGray.100', 'navy.900');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialState = useMemo(
    () => ({
      workspaceId: '',
      fullName: '',
      email: '',
      role: '', // Employee by default
      designation: '',
    }),
    [],
  );

  const [formData, setFormData] = useState(initialState);

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await client.query({
          query: GET_ALL_WORKSPACES,
          fetchPolicy: 'no-cache',
        });
        setWorkspaces(data.getAllWorkSpaces || []);
        if (data.getAllWorkSpaces.length > 0) {
          setFormData((prev) => ({
            ...prev,
            workspaceId: data.getAllWorkSpaces[0].id,
          }));
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workspaces.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.workspaceId ||
      !formData.fullName ||
      !formData.email ||
      !formData.role
    ) {
      toast({
        title: 'Error',
        description: 'Workspace, Full Name, Email, and Role are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      const input = {
        workspaceId: Number(formData.workspaceId),
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        designation: formData.designation,
      };

      await client.mutate({
        mutation: ADD_USER_TO_WORKSPACE,
        variables: { input },
      });

      toast({
        title: 'User Added',
        description: `${formData.fullName} has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      setFormData((prev) => ({
        ...initialState,
        workspaceId: workspaces[0]?.id,
        role: '0',
      }));

      if (onAdd) onAdd();
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const inputProps = {
    bg: inputBg,
    border: 'none',
    borderRadius: 'md',
    _hover: { borderColor: 'blue.400' },
    _focus: { borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' },
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Card
        boxShadow={cardShadow}
        p={{ base: '20px', md: '30px' }}
        borderRadius="xl"
        maxW="600px"
        mx="auto"
      >
        <Text
          fontSize="2xl"
          fontWeight="700"
          mb="25px"
          textAlign="center"
          color={textColor}
        >
          Add New User
        </Text>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="20px">
            {/* Workspace Dropdown */}
            <FormControl isRequired>
              <FormLabel color={labelColor} fontSize="sm">
                Select Workspace
              </FormLabel>
              <Select
                name="workspaceId"
                value={formData.workspaceId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workspaceId: Number(e.target.value),
                  }))
                }
                {...inputProps}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Full Name */}
            <FormControl isRequired>
              <FormLabel color={labelColor} fontSize="sm">
                Full Name
              </FormLabel>
              <Input
                placeholder="Enter full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                {...inputProps}
              />
            </FormControl>

            {/* Email */}
            <FormControl isRequired>
              <FormLabel color={labelColor} fontSize="sm">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                {...inputProps}
              />
            </FormControl>

            {/* Role */}
            <FormControl isRequired>
              <FormLabel color={labelColor} fontSize="sm">
                Role
              </FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                {...inputProps}
              >
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
                <option value="PM">PM</option>
                <option value="EMPLOYEE">Employee</option>
              </Select>
            </FormControl>

            {/* Designation */}
            <FormControl>
              <FormLabel color={labelColor} fontSize="sm">
                Designation
              </FormLabel>
              <Input
                placeholder="Enter designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                {...inputProps}
              />
            </FormControl>

            <Button
              type="submit"
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              fontWeight="600"
              alignSelf="flex-end"
              px="24px"
            >
              Add User
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};

export default AddUser;
