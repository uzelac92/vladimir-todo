# Use current LTS; Alpine is small. You can also try node:20-slim if your scanner prefers Debian.
FROM node:20-alpine
WORKDIR /app

# 1) Install dependencies using the lockfile for reproducibility
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2) Copy the application source (now schema.prisma is present)
COPY . .

# 3) Generate the Prisma Client now that schema exists
RUN npx prisma generate

# 4) Expose app port (EB will map its own port to this)
EXPOSE 3000

# 5) At container start, apply DB migrations safely, then start server
CMD ["sh","-c","npx prisma migrate deploy && node src/server.js"]