import { Router } from "express";

import { auth } from "@/main/middlewares";
import { adaptExpressRoute } from "@/main/adapters";
import { makeSaveProfilePictureController } from "@/main/factories/application/controllers";

export default (router: Router): void => {
  router.put("/users/picture", auth);
  router.delete("/users/picture", auth, adaptExpressRoute(makeSaveProfilePictureController()));
};
