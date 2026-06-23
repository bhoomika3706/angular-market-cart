FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "backend/server.js"]