FROM node:20-slim AS base-building
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable 
COPY . /app/

FROM base-building AS build-staging
ENV PNPM_HOME="/pnpm"
WORKDIR /tmp
COPY ["./package.json", "./"]
RUN npm install
COPY ["./src", "."]
RUN npm run build

FROM public.ecr.aws/docker/library/node:lts-alpine3.17 AS production
WORKDIR /app
COPY --from=build-staging /tmp/dist ./dist
COPY --from=build-staging /tmp/package.json ./
COPY --from=build-staging /tmp/node_modules ./node_modules
CMD ["node", "dist/main"]