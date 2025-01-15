import { Manager, InferModel } from "@palmares/databases";

import type { BaseOrder, Order } from "./models";

export class OrderManager extends Manager<typeof BaseOrder> {
  async findById(id: number) {
    return (await this.get((qs) => qs.where({ id })))?.[0];
  }

  async create(order: InferModel<typeof Order, "create">) {
    return (await this.set((qs) => qs.data(order)))?.[0];
  }
}
