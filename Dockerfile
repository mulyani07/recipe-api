# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
