# Base image: lightweight Linux + Node 18
FROM node:18-alpine

# Set working directory inside the image
WORKDIR /app

# 1) Install dependencies using cached layers
COPY package*.json ./
RUN npm ci --omit=dev

# 2) Copy the source and generate Prisma client
COPY . .
RUN npx prisma generate

# Expose the local port the app will use (EB maps it internally)
EXPOSE 3000

# 3) At container start:
#    - Apply any pending migrations safely (prod style)
#    - Start the server
CMD ["sh","-c","npx prisma migrate deploy && node src/server.js"]