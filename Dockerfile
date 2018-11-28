FROM node:8.4
MAINTAINER Jeff Dickey

# Create user and group
RUN addgroup --system register \
    && adduser --disabled-login --system \
        --shell /bin/bash \
        --home /srv/npm-register \
        --ingroup register \
        register \
    && mkdir -p /srv/npm-register/src /srv/npm-register/data \
    && chown -R register:register /srv/npm-register \
    && chmod -R g+w /srv/npm-register \
    && npm install --global nodemon

# Share storage volume
ENV NPM_REGISTER_FS_DIRECTORY /srv/npm-register/data
VOLUME /srv/npm-register/data

WORKDIR /srv/npm-register/src

ARG NPM_OPTIONS="--only=prod"

# Deploy application
COPY package.json /srv/npm-register/src/
RUN npm install $NVM_OPTIONS

COPY . /srv/npm-register/src
RUN chown -R register:register .

# Start application
EXPOSE 3000
USER register
ENV NODE_ENV production
CMD ["npm", "start"]

