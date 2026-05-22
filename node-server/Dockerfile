FROM node:22-alpine

# Create app directory inside container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]