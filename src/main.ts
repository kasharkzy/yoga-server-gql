import fastify from 'fastify'
import { createYoga, createSchema } from 'graphql-yoga'
import { helloschema } from '@infrastructure/graphql/list-hello'
import { propagateCors } from '@shared/infra/propagate-cors/propagate-cors'

const server = fastify({
  logger: true,

})

propagateCors(server)

const yoga = createYoga({
  schema: createSchema({
    typeDefs: helloschema
  }),
  graphqlEndpoint: '/graphql',
  logging: true,
})

server.route({
  url: '/graphql',
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    const response = await yoga.fetch(
      new Request(`http://localhost:4000${req.url}`, {
        method: req.method,
        headers: req.headers as any,
        body: req.body ? JSON.stringify(req.body) : undefined,
      }),
    )

    reply.status(response.status)

    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.send(await response.text())
  },
})

server.listen({ port: 4000 }, () => {
  console.log('Server running at http://localhost:4000/graphql')
})