# Use official Node.js LTS image
FROM node:18

# Create app directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ .

# Expose port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]
