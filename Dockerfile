FROM node:22-alpine AS frontend-builder

WORKDIR /app/TODO/todo_frontend

COPY TODO/todo_frontend/package*.json ./
RUN npm ci

COPY TODO/todo_frontend/ ./
RUN npm run build

FROM node:22-alpine AS backend-deps

WORKDIR /app/TODO/todo_backend

COPY TODO/todo_backend/package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine

WORKDIR /app/TODO/todo_backend

ENV NODE_ENV=production
ENV PORT=5000

COPY TODO/todo_backend/ ./
COPY --from=backend-deps /app/TODO/todo_backend/node_modules ./node_modules
COPY --from=frontend-builder /app/TODO/todo_frontend/build ./static/build

EXPOSE 5000

CMD ["node", "server.js"]
