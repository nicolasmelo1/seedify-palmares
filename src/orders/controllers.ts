import { pathNested, Response, status } from "@palmares/server";

import { orderSchema } from "./schemas";
import { Order } from "./models";

import type { orderPath, basePath } from "./routes";

export const createOrderController = pathNested<typeof basePath>()().post(
  async (request) => {
    const body = await request.json();
    const validation = await orderSchema.validate(body, {});
    if (validation.isValid) return Response.json(await validation.save());

    return Response.json(validation.errors, {
      status: status.HTTP_400_BAD_REQUEST,
    });
  },
);

export const getOrderController = pathNested<typeof orderPath>()().get(
  async (request) => {
    const id = request.params.id;
    return Response.json(await Order.order.findById(id));
  },
);
