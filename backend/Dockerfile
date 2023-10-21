# Define the base image
FROM node:latest as base

# Set the working directory
WORKDIR /usr/src/app

# Expose the port
EXPOSE 3500

# Common instructions for all stages
COPY package*.json ./
RUN npm install

# Stage 1: Development
FROM base as dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

# Stage 2: Production
FROM base as prod
ENV NODE_ENV=production
COPY . .
CMD ["npm", "start"]

# Stage 3: Testing
FROM base as test
ENV NODE_ENV=test
COPY . .
CMD ["npm", "run", "dev"]
