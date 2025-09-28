# Use Node 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build React app
RUN npm run build

# Serve the build folder using 'serve'
RUN npm install -g serve

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
