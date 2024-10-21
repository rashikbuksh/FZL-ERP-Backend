import { asc, desc, eq, like, or, sql } from 'drizzle-orm';
import {
	decimal,
	integer,
	pgSchema,
	serial,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

export const defaultUUID = (column = 'uuid') =>
	text(column, {
		length: 15,
	});

export const uuid_primary = defaultUUID().primaryKey();

export const DateTime = (column) =>
	timestamp(column, {
		mode: 'string',
		withTimezone: false,
	});

export const PG_DECIMAL = (column) =>
	decimal(column, {
		precision: 20,
		scale: 4,
	}).notNull();

export const decimalToNumber = (column) => {
	return sql`${column}::float8`;
};

export function constructSelectAllQuery(
	baseQuery,
	params,
	defaultSortField = 'created_at'
) {
	let { q, page, limit, sort, orderby } = params;

	// get search fields from table
	const searchFields = Object.keys(baseQuery.config.table).filter(
		(field) => field !== 'uuid' && field !== 'id'
	);

	console.log(searchFields);

	// Apply search filter
	if (q) {
		const searchConditions = searchFields.map((field) =>
			like(
				baseQuery.config.table[Symbol.for('drizzle:Columns')][field],
				`%${q}%`
			)
		);
		baseQuery = baseQuery.where(or(...searchConditions));
	}

	// Apply sorting
	if (sort) {
		const order = orderby == 'asc' ? asc : desc;
		baseQuery = baseQuery.orderBy(order(baseQuery.config.table[sort]));
	} else {
		baseQuery = baseQuery.orderBy(
			desc(baseQuery.config.table[defaultSortField])
		); // Default sorting
	}

	// Apply pagination
	if (page) {
		const offset = (page - 1) * limit;
		baseQuery = baseQuery.limit(limit).offset(offset);
	}

	return baseQuery;
}
