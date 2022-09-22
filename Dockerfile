ARG NODE_VERSION=16

# Setup the build container.
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /home/node

# Install dependencies.
COPY package.json .
COPY pnpm-lock.yaml .

# install pnpm
RUN yarn global add pnpm

# run pnpm
RUN pnpm i

# Copy the source files.
COPY src src
COPY tsconfig.json .

# Build the application.
RUN pnpm build

# Setup the runtime container.
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node

# Copy the built application.
COPY --from=build /home/node /home/node

# Expose the service's port.
EXPOSE 3000

# Run the service.
CMD ["cross-env PAYLOAD_CONFIG_PATH=dist/payload.config.js NODE_ENV=production node dist/server.js"]