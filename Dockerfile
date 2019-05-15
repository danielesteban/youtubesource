FROM node:dubnium

# Install forever
ENV NODE_ENV=production
RUN yarn global add forever

# Create working directory
RUN mkdir -p /usr/src/youtubesource
WORKDIR /usr/src/youtubesource

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Bundle worker source
COPY src/ src/

# De-escalate privileges
USER node

# Start worker
CMD ["forever", "--minUptime", "1000", "--spinSleepTime", "1000", "src/index.js"]
