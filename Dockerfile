# Use an official Node.js runtime as a base image
FROM node:20.9.0-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your Express app listens on
EXPOSE 4000

# Define the command to start your Express app
CMD [ "node", "cors_proxy.js" ]