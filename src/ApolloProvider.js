import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider as Provider, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});
//const uploadLink = createUploadLink({ uri: 'http://localhost:4000/graphql' });
const uploadLink = createUploadLink({ uri: 'http://api.hjmbtest.online' });
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
const client = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache: new InMemoryCache()
});

export default function ApolloProvider(props){
    return <Provider client={client} {...props}/>
}