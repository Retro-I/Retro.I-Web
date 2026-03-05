FROM oven/bun:1 AS build

ENV NODE_ENV=production

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build


FROM oven/bun:1

WORKDIR /app
RUN bun add -g serve

#COPY --from=build /src/dist /src/dist
COPY --from=build /app/.output /app/.output

EXPOSE 3000
#CMD ["serve", "-s", "dist", "-l", "3000"]
CMD [ "node", ".output/server/index.mjs" ]
