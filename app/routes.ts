import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/game1", "routes/game1.tsx"),
  route("/game2", "routes/game2.tsx"),
  route("/game3", "routes/game3.tsx"),
  route("/story", "routes/story/_layout.tsx", [
    index("routes/story/_index.tsx"),
    route(":page", "routes/story/$page.tsx"),
  ]),
  route("/game", "routes/game/_layout.tsx", [
    index("routes/game/_index.tsx"),
    route(":game", "routes/game/$game.tsx"),
  ]),
] satisfies RouteConfig;
