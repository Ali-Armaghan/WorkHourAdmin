import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Input,
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

// ---------------- GraphQL Query ----------------
const GET_ALL_WORKSPACES = gql`
  query GetAllWorkSpaces {
    getAllWorkSpaces {
      id
      name
      members {
        id
      }
      projects {
        id
        name
        createdAt
      }
    }
  }
`;

const ProjectSearch = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const labelColor = useColorModeValue('secondaryGray.600', 'gray.400');
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  // Fetch workspaces and projects from GraphQL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.query({
          query: GET_ALL_WORKSPACES,
          fetchPolicy: 'no-cache',
        });
        setWorkspaces(data.getAllWorkSpaces);
        // Auto-select the first workspace if exists
        if (data.getAllWorkSpaces.length > 0) {
          setSelectedWorkspace(data.getAllWorkSpaces[0].id);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workspace data.',
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

  // Filter projects by selected workspace
  const workspaceProjects = useMemo(() => {
    if (!selectedWorkspace) return [];
    const ws = workspaces.find((w) => w.id === selectedWorkspace);
    if (!ws) return [];
    return ws.projects.map((p) => ({
      ...p,
      members: ws.members?.length || 0,
      startDate: new Date(p.createdAt).toLocaleDateString(),
      note: '-',
    }));
  }, [selectedWorkspace, workspaces]);

  // Filter by search term
  const filteredProjects = useMemo(() => {
    return workspaceProjects.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [workspaceProjects, searchTerm]);

  const handleEdit = (project) => alert(`Do You Want Edit ${project.name}`);
  const handleDelete = (project) =>
    alert(`Do You Want to Delete ${project.name}`);

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
        Project Search
      </Text>

      <Flex gap="20px" flexWrap="wrap" mb="20px">
        {/* Workspace Dropdown */}
        <FormControl flex="1">
          <FormLabel color={labelColor}>Workspace</FormLabel>
          <Select
            value={selectedWorkspace}
            onChange={(e) => {
              setSelectedWorkspace(e.target.value);
              setSearchTerm('');
            }}
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

        {/* Search Project */}
        <FormControl flex="1">
          <FormLabel color={labelColor}>Search Project</FormLabel>
          <Input
            placeholder="Type project name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            isDisabled={!selectedWorkspace}
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

      {/* Project Table */}
      {filteredProjects.length > 0 && (
        <Box mt="20px">
          <Text fontWeight="700" mb="10px" color={textColor}>
            Project Information
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Project Name</Th>
                <Th>Members</Th>
                <Th>Start Date</Th>
                <Th>Note</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProjects.map((project) => (
                <Tr key={project.id}>
                  <Td>{project.name}</Td>
                  <Td>{project.members}</Td>
                  <Td>{project.startDate}</Td>
                  <Td>{project.note}</Td>
                  <Td>
                    <Flex gap="10px">
                      <IconButton
                        size="sm"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        onClick={() => handleEdit(project)}
                        aria-label="Edit project"
                      />
                      <IconButton
                        size="sm"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDelete(project)}
                        aria-label="Delete project"
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Card>
  );
};

export default ProjectSearch;
