# Step 1: Build 단계 (Node 기반)
FROM node:20 AS build
WORKDIR /app

# 의존성 파일만 먼저 복사하여 캐시 활용
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Step 2: Nginx로 정적 파일 서빙
FROM nginx:alpine

# Nginx 설정 덮어쓰기 (라우팅 대응)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일을 nginx html 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

