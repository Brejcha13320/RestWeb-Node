import { envs } from "../src/config/envs";
import { AppRoutes } from "../src/presentation/routes";
import { Server } from "../src/presentation/server";

export const testServer = new Server({
  port: envs.PORT,
  publicPath: envs.PUBLIC_PATH,
  routes: AppRoutes.routes,
});
