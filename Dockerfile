# Use Node.js 18 as base
FROM node:18 as build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the entire project
COPY . .

# Build Angular project (fix for missing dependencies)
RUN npm rebuild node-sass

# Expose port
EXPOSE 4200

# Run Angular App
CMD ["ng", "serve", "--host", "0.0.0.0"]

