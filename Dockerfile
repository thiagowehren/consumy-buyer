# Define base image using LTS version of Node.js on Alpine Linux
FROM registry.docker.com/library/node:21.6.2-alpine

# Update Alpine package manager and install necessary dependencies
RUN apk add --no-cache \
  build-base \
  git \
  vips-dev \
  curl

# Set the working directory for the application
WORKDIR /consumy-buyer

# Copy all application files to the image
COPY . .

# Copy both 'package.json' and 'package-lock.json' to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Expose port 5174 to be accessible externally
EXPOSE 5174

# Command to run HTTP server serving the built files
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
