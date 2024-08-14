FROM node:20

#APP_DIRECTORY
WORKDIR /app

#copy dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json

#install dependencies
RUN npm install

#copy source code
COPY . .

EXPOSE 8080

#run command
CMD [ "npm", "start" ]
