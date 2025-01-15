import { define, fields } from "@palmares/databases";

import { OrderManager } from "./managers";
import * as d from "../../drizzle/schema";

export const BaseOrder = define("Order", {
  fields: {
    id: fields.auto(),
    productId: fields.int(),
    quantity: fields.int(),
    userId: fields.int(),
  },
  options: {
    tableName: "orders",
    instance: d.Order,
  },
});

export const Order = BaseOrder.setManagers({
  order: new OrderManager(),
});
