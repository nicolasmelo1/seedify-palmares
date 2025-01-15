import * as p from "@palmares/schemas";

import { Order } from "./models";

export const orderSchema = p
  .modelSchema(Order, {
    fields: {
      id: p.number().optional(),
    },
  })
  .onSave(async (order) => {
    return Order.order.create({
      ...order,
      id: order.id ?? undefined,
    });
  });
