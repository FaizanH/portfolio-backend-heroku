# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim AS development

# Create app directory
WORKDIR /usr/src/app

# Run the application as a non-root user.
USER node

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci

COPY --chown=node:node . /usr/src/app

# Expose the port that the application listens on.
EXPOSE 5001

# Run the application.
CMD [ "npm", "start" ]
