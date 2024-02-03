FROM balenalib/raspberrypi3-node:latest
WORKDIR /app
COPY . .
RUN install_packages npm
RUN npm install
RUN npm install -g electron-packager
RUN electron-packager . BtID --arch=armv7l --output=dist
CMD ["npm", "start"]
