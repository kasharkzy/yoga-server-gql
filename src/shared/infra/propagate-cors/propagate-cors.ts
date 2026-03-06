import helmet from '@fastify/helmet'
import { FastifyInstance } from 'fastify'

export function propagateCors(server: FastifyInstance) {
  server.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
}