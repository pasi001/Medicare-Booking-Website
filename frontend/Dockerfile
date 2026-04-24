# ── Stage 1: Build the React app ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Accept the backend URL as a build argument (injected by Jenkins)
ARG VITE_BACKEND_BASEURL=http://localhost:5000
ENV VITE_BACKEND_BASEURL=$VITE_BACKEND_BASEURL

RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:alpine

# Copy the built React files into Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]