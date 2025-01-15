/** Automatically generated by @palmares/drizzle-engine on 2025-01-15T02:22:02.431Z */ 

import * as d from '@palmares/drizzle-engine/sqlite-core';

export const Order = d.sqliteTable('orders', {
  id: d.integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }).unique(),
  productId: d.integer('product_id', { mode: 'number' }).notNull(),
  quantity: d.integer('quantity', { mode: 'number' }).notNull(),
  userId: d.integer('user_id', { mode: 'number' }).notNull()
}, (table) => ({
  idIdx: d.uniqueIndex('orders_id_idx').on(table.id)
}));
