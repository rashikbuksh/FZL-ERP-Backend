import { pgTrigger } from "drizzle-orm/pg-core";
import { sfg, sfg_production } from "../zipper/schema.js";

export const sfgProductionInsertTrigger = pgTrigger({
	table: sfg_production,
	when: "BEFORE",
	operation: "INSERT",
	function: "sfg_production_insert_trigger",
	level: "ROW",
});

export const sfgProductionUpdateTrigger = pgTrigger({
	table: sfg_production,
	when: "BEFORE",
	operation: "UPDATE",
	function: "sfg_production_update_trigger",
	level: "ROW",
});

export const sfgProductionDeleteTrigger = pgTrigger({
	table: sfg_production,
	when: "BEFORE",
	operation: "DELETE",
	function: "sfg_production_delete_trigger",
	level: "ROW",
});
