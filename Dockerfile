FROM node:12.10-alpine
RUN mkdir /app
WORKDIR /app
RUN npm install -g @nestjs/cli
COPY package*.json* ./
RUN npm install
COPY . .
ENV DATABASE_ADAPTAR_TYPE="mongodb"
ENV DATABASE_ADAPTAR_URI="mongodb+srv://baten:<password>@cluster0-vqjwy.mongodb.net/test?retryWrites=true&w=majority"
ENV DATABASE_ADAPTAR_PASSWORD="baten@CAT2018"
EXPOSE 3000
CMD ["npm", "start"]

