import { pgTrigger } from "drizzle-orm/pg-core";
import e from "express";
import { pi_entry } from "../commercial/schema.js";
import { stock, trx, used } from "../material/schema.js";
import {
	order_entry,
	sfg,
	sfg_production,
	sfg_transaction,
} from "../zipper/schema.js";

import { entry } from "../purchase/schema.js";

export const sfgProductionInsertTrigger = pgTrigger({
	table: sfg_production,
	when: "AFTER",
	operation: "INSERT",
	function: "sfg_after_sfg_production_insert_trigger",
	level: "ROW",
});

export const sfgProductionUpdateTrigger = pgTrigger({
	table: sfg_production,
	when: "AFTER",
	operation: "UPDATE",
	function: "sfg_after_sfg_production_update_trigger",
	level: "ROW",
});

export const sfgProductionDeleteTrigger = pgTrigger({
	table: sfg_production,
	when: "AFTER",
	operation: "DELETE",
	function: "sfg_after_sfg_production_delete_trigger",
	level: "ROW",
});

export const sfgTransactionInsertTrigger = pgTrigger({
	table: sfg_transaction,
	when: "AFTER",
	operation: "INSERT",
	function: "sfg_after_sfg_transaction_insert_trigger",
	level: "ROW",
});

export const sfgTransactionUpdateTrigger = pgTrigger({
	table: sfg_transaction,
	when: "AFTER",
	operation: "UPDATE",
	function: "sfg_after_sfg_transaction_update_trigger",
	level: "ROW",
});

export const sfgTransactionDeleteTrigger = pgTrigger({
	table: sfg_transaction,
	when: "AFTER",
	operation: "DELETE",
	function: "sfg_after_sfg_transaction_delete_trigger",
	level: "ROW",
});

export const piEntryInsertTrigger = pgTrigger({
	table: pi_entry,
	when: "AFTER",
	operation: "INSERT",
	function: "sfg_after_commercial_pi_entry_insert_trigger",
	level: "ROW",
});

export const piEntryUpdateTrigger = pgTrigger({
	table: pi_entry,
	when: "AFTER",
	operation: "UPDATE",
	function: "sfg_after_commercial_pi_entry_update_trigger",
	level: "ROW",
});

export const piEntryDeleteTrigger = pgTrigger({
	table: pi_entry,
	when: "AFTER",
	operation: "DELETE",
	function: "sfg_after_commercial_pi_entry_delete_trigger",
	level: "ROW",
});

export const orderEntryInsertTrigger = pgTrigger({
	table: order_entry,
	when: "AFTER",
	operation: "INSERT",
	function: "sfg_after_zipper_order_entry_insert_trigger",
	level: "ROW",
});

export const orderEntryDeleteTrigger = pgTrigger({
	table: order_entry,
	when: "AFTER",
	operation: "DELETE",
	function: "sfg_after_zipper_order_entry_delete_trigger",
	level: "ROW",
});

export const purchaseEntryInsertTrigger = pgTrigger({
	table: entry,
	when: "AFTER",
	operation: "INSERT",
	function: "material_stock_after_purchase_entry_insert_trigger",
	level: "ROW",
});

export const purchaseEntryUpdateTrigger = pgTrigger({
	table: entry,
	when: "AFTER",
	operation: "UPDATE",
	function: "material_stock_after_purchase_entry_update_trigger",
	level: "ROW",
});

export const purchaseEntryDeleteTrigger = pgTrigger({
	table: entry,
	when: "AFTER",
	operation: "DELETE",
	function: "material_stock_after_purchase_entry_delete_trigger",
	level: "ROW",
});

export const materialUsedInsertTrigger = pgTrigger({
	table: used,
	when: "AFTER",
	operation: "INSERT",
	function: "material_stock_after_material_used_insert_trigger",
	level: "ROW",
});

export const materialUsedUpdateTrigger = pgTrigger({
	table: used,
	when: "AFTER",
	operation: "UPDATE",
	function: "material_stock_after_material_used_update_trigger",
	level: "ROW",
});

export const materialUsedDeleteTrigger = pgTrigger({
	table: used,
	when: "AFTER",
	operation: "DELETE",
	function: "material_stock_after_material_used_delete_trigger",
	level: "ROW",
});

export const materialTrxInsertTrigger = pgTrigger({
	table: trx,
	when: "AFTER",
	operation: "INSERT",
	function: "material_stock_after_material_trx_insert_trigger",
	level: "ROW",
});

export const materialTrxUpdateTrigger = pgTrigger({
	table: trx,
	when: "AFTER",
	operation: "UPDATE",
	function: "material_stock_after_material_trx_update_trigger",
	level: "ROW",
});

export const materialTrxDeleteTrigger = pgTrigger({
	table: trx,
	when: "AFTER",
	operation: "DELETE",
	function: "material_stock_after_material_trx_delete_trigger",
	level: "ROW",
});

export const materialStockSfgInsertTrigger = pgTrigger({
	table: stock,
	sfg,
	when: "AFTER",
	operation: "INSERT",
	function: "material_stock_sfg_after_stock_to_sfg_insert_trigger",
	level: "ROW",
});

export const materialStockSfgUpdateTrigger = pgTrigger({
	table: stock,
	sfg,
	when: "AFTER",
	operation: "UPDATE",
	function: "material_stock_sfg_after_stock_to_sfg_update_trigger",
	level: "ROW",
});

export const materialStockSfgDeleteTrigger = pgTrigger({
	table: stock,
	sfg,
	when: "AFTER",
	operation: "DELETE",
	function: "material_stock_sfg_after_stock_to_sfg_delete_trigger",
	level: "ROW",
});

export const materialStockInsertTrigger = pgTrigger({
	table: stock,
	when: "AFTER",
	operation: "INSERT",
	function: "material_stock_after_material_info_insert_trigger",
	level: "ROW",
});

export const materialStockDeleteTrigger = pgTrigger({
	table: stock,
	when: "AFTER",
	operation: "DELETE",
	function: "material_stock_after_material_info_delete_trigger",
	level: "ROW",
});
