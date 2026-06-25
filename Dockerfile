# Stage 1: Build the Angular frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Backend, serving the built frontend
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/dist/market-cart/browser /app/dist/market-cart/browser
EXPOSE 3000
CMD ["node", "server.js"]