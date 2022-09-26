FROM node:16.17.0

WORKDIR /src

RUN npm install npm@latest --location=global
# RUN npm install -g nodemon
RUN npm install express
RUN npm install express-session
RUN npm install ejs
RUN npm install mysql
RUN npm install crypto

COPY /src .

EXPOSE 3000/tcp

CMD ["node", "index.js"]
