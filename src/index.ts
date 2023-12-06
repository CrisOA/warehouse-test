import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/schema';
import { resolvers } from './resolvers/resolvers';
import 'dotenv/config'


const PORT = parseInt(process.env.SERVER_PORT!) || 4000

const server = new ApolloServer({
    typeDefs,
    resolvers
})
 
export async function main(){
    const { url } = await startStandaloneServer(server, 
        {
            listen: { port: PORT }
        }
        );
     return {server, url};
}

main()



