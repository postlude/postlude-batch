FROM node:20

RUN apt-get update \
    && apt-get install -y default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

ENV SERVER_HOME /usr/src/postlude-batch

RUN mkdir -p ${SERVER_HOME}

COPY .. ${SERVER_HOME}

WORKDIR ${SERVER_HOME}

RUN yarn \
	&& yarn build

# ECS task definition에서 command를 설정하여 덮어쓸 수 있음
CMD ["yarn", "start"]