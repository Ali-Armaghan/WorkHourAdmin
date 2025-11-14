import React from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { gql, useQuery } from '@apollo/client';

// GraphQL query matching your backend
const GET_WORKSPACES = gql`
  query GetAllWorkSpaces {
    getAllWorkSpaces {
      id
      name
      description
      icon
      createdAt
      members {
        id
        fullName
      }
      projects {
        id
        name
      }
    }
  }
`;

const Cards = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  const token = localStorage.getItem('token');

  const { data, loading, error } = useQuery(GET_WORKSPACES, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (loading) return <Text>Loading workspaces...</Text>;
  if (error) return <Text>Error fetching workspaces: {error.message}</Text>;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        {data.getAllWorkSpaces.map((work) => (
          <Card
            key={work.id}
            boxShadow={cardShadow}
            p="20px"
            borderRadius="xl"
            _hover={{ transform: 'translateY(-4px)', transition: '0.2s' }}
          >
            <Flex justify="space-between" align="center">
              <Flex direction="column" gap="8px">
                <Text color={textColor} fontSize="xl" fontWeight="700">
                  {work.name}
                </Text>
                <Text color="secondaryGray.600" fontSize="md">
                  Total Members: <b>{work.members.length}</b>
                </Text>
                <Text color="secondaryGray.600" fontSize="md">
                  Total Projects: <b>{work.projects.length}</b>
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Created at: {new Date(work.createdAt).toLocaleDateString()}
                </Text>
              </Flex>

              <Image
                src={
                  work.icon ||
                  'https://cdn-icons-png.flaticon.com/512/2503/2503747.png'
                }
                alt={work.name}
                boxSize="120px"
                borderRadius="md"
                objectFit="cover"
                ml="15px"
              />
            </Flex>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Cards;
