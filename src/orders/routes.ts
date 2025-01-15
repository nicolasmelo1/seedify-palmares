import { path, pathNested } from "@palmares/server";

import { getOrderController, createOrderController } from "./controllers";

export const basePath = path("/order");
export const orderPath = pathNested<typeof basePath>()("/<id: number>");

export const route = basePath.nested([
  createOrderController,
  orderPath.nested([getOrderController]),
]);
