FROM node:16.13.1-alpine3.14
WORKDIR /home/node/ecart-seller-backend
COPY . .
RUN npm install
RUN npm install
RUN npm run build
RUN rm -rf node_modules/
RUN rm -rf src/
RUN npm install --production
CMD ["npm", "run", "start"]
