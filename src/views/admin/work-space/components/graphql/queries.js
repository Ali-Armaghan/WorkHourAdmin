// src/views/admin/work-space/components/graphql/queries.js
import { gql } from "@apollo/client";

// Fetch all workspaces
export const GET_ALL_WORKSPACES = gql`
  query GetAllWorkSpaces {
    getAllWorkSpaces {
      id
      name
      description
      icon
      createdAt
      updatedAt
      isDeleted
      members {
        id
        fullName
        email
        role
      }
      projects {
        id
        name
      }
    }
  }
`;

// Add new workspace
export const ADD_WORKSPACE = gql`
  mutation AddWorkSpace($name: String!, $description: String) {
    addWorkSpace(name: $name, description: $description) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
