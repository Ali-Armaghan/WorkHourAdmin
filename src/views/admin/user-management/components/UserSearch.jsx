import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
  useColorModeValue,
  useToast,
  Spinner,
  Select,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
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
  uri: 'http://192.168.1.78:3000/graphql', // same backend endpoint
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

// ---------------- GraphQL Query ----------------
const GET_ALL_WORKSPACES = gql`
  query GetAllWorkSpaces {
    getAllWorkSpaces {
      id
      name
      members {
        id
        fullName
        email
        role
        designation
      }
    }
  }
`;

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Chakra colors
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const labelColor = useColorModeValue('secondaryGray.600', 'gray.400');
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  // Fetch workspaces and their members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.query({
          query: GET_ALL_WORKSPACES,
          fetchPolicy: 'no-cache',
        });
        setWorkspaces(data.getAllWorkSpaces);
        // Auto-select first workspace if available
        if (data.getAllWorkSpaces.length > 0) {
          setSelectedWorkspace(data.getAllWorkSpaces[0].id);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load user data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine all users across all workspaces
  const allUsers = useMemo(() => {
    return workspaces.flatMap((ws) =>
      ws.members.map((m) => ({
        workspaceId: ws.id,
        workspaceName: ws.name,
        ...m,
      })),
    );
  }, [workspaces]);

  // Filter users by search term & workspace
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchesSearch =
        !searchTerm ||
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.workspaceName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWorkspace =
        !selectedWorkspace || u.workspaceId === selectedWorkspace;

      return matchesSearch && matchesWorkspace;
    });
  }, [searchTerm, allUsers, selectedWorkspace]);

  const handleEdit = (user) => alert(`Do you want to edit ${user.fullName}?`);
  const handleDelete = (user) =>
    alert(`Do you want to delete ${user.fullName}?`);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Card
      p="25px"
      borderRadius="xl"
      boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)"
    >
      <Text fontSize="2xl" fontWeight="700" mb="20px" color={textColor}>
        User Management
      </Text>

      <Flex gap="20px" flexWrap="wrap" mb="20px">
        <FormControl width="250px">
          <FormLabel color={labelColor}>Select Workspace</FormLabel>
          <Select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            borderRadius="lg"
            borderColor={borderColor}
            bg={inputBg}
            _hover={{ borderColor: 'blue.400' }}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px blue.400',
            }}
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl flex="1">
          <FormLabel color={labelColor}>Search Users</FormLabel>
          <Input
            placeholder="Search by name, email, role, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="lg"
            borderColor={borderColor}
            bg={inputBg}
            _hover={{ borderColor: 'blue.400' }}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px blue.400',
            }}
          />
        </FormControl>
      </Flex>

      <Box mt="20px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Workspace</Th>
              <Th>Full Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Designation</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user.id}>
                <Td>{user.workspaceName}</Td>
                <Td>{user.fullName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
                <Td>{user.designation}</Td>
                <Td>
                  <Flex gap="10px">
                    <IconButton
                      size="sm"
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => handleEdit(user)}
                      aria-label="Edit user"
                    />
                    <IconButton
                      size="sm"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(user)}
                      aria-label="Delete user"
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export default UserSearch;
