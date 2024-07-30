import { pgTrigger } from "drizzle-orm/pg-core";
import e from "express";
import { pi_entry } from "../commercial/schema.js";
import {
	order_entry,
	sfg,
	sfg_production,
	sfg_transaction,
} from "../zipper/schema.js";

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
