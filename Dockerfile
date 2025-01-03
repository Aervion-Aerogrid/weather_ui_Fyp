# Use the Node.js 18 image as the base
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the entire project into the container
COPY . .

# Expose port 4200 for Angular CLI
EXPOSE 4200

# Run the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]
