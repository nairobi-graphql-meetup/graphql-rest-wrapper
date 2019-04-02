//todo list

/*
 1. Build a graphql server using ApolloServer
 2. Analylize the shape of the response from our SWAPI REST API (https://swapi.co/)
 3. Define our schema
 4. Define our resolvers
 5. Pass our shema/typeDefs and resolvers to our ApolloServer instance
 6. Test out our API
*/

const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const typeDefs = gql`
  type Query {
    characters: [Person]
    person(id: Int!): Person
  }

  type Person {
    name: String
    mass: String
    films: [String]
    species: [String]
    vehicles: [String]
    starships: [String]
  }
`;

const BASEURL = `https://swapi.co/api`;

const getPeople = () => {
  return axios.get(`${BASEURL}/people`);
};
// const { name, mass, films, species, vehicles, starships } = results
// return { name, mass, films, species, vehicles, starships };

const resolvers = {
  Query: {
    characters: () => {
      return axios.get(`${BASEURL}/people`).then(({ data }) => {
        try {
          return data.results.map(({ name, mass, films, species, vehicles, starships }) => {
            return {
              name,
              mass,
              films,
              species,
              vehicles,
              starships
            };
          });
        } catch (error) {
          console.log(`something went wrong`, error);
        }
      });
    },
    person: (_, { id }) => {
      return axios.get(`${BASEURL}/people/${id}`).then(({ data }) => {
        const { name, mass, films, species, vehicles, starships } = data;
        return {
          name,
          mass,
          films,
          species,
          vehicles,
          starships
        };
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Sever running at ${url}`));
