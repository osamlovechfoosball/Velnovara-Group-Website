FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# The live address goes into canonical links, language alternates and the sitemap.
ARG SITE_URL=https://velnovaragroup.eu
RUN SITE_URL=$SITE_URL npm run build
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.mjs"]
