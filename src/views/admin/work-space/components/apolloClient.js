// src/views/admin/work-space/components/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";


const httpLink = createHttpLink({
  uri: `http://192.168.1.78:3000/graphql`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
