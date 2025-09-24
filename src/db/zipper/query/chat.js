import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import { order_description, chat, order_info } from '../schema.js';
import * as threadSchema from '../../thread/schema.js';

import { alias } from 'drizzle-orm/pg-core';

import hr, * as hrSchema from '../../hr/schema.js';

import { getIO } from '../../../lib/socket.js';

const chat_user = alias(hrSchema.users, 'chat_user');
const threadOrderInfo = alias(threadSchema.order_info, 'threadOrderInfo');
const zipperOrderInfo = alias(order_info, 'zipperOrderInfo');

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const chatPromise = db.insert(chat).values(req.body).returning({
		uuid: chat.uuid,
		id: chat.id,
		order_description_uuid: chat.order_uuid,
		thread_order_info_uuid: chat.thread_order_info_uuid,
		message: chat.message,
		user_uuid: chat.user_uuid,
		created_at: chat.created_at,
	});

	try {
		const data = await chatPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].id} inserted`,
		};

		// Get the complete chat data with user info for socket emission
		try {
			// const users = hrSchema.users;
			const [completeData] = await db
				.select({
					uuid: chat.uuid,
					id: chat.id,
					chat_id: sql`CONCAT('CI', TO_CHAR(${chat.created_at}, 'YY'), '-', ${chat.id})`,
					order_description_uuid: chat.order_description_uuid,
					order_id: sql`CONCAT('ZO', TO_CHAR(${zipperOrderInfo.created_at}, 'YY'), '-', ${zipperOrderInfo.id})`,
					thread_order_info_uuid: chat.thread_order_info_uuid,
					thread_order_info_id: sql`CONCAT('TOI', TO_CHAR(${threadOrderInfo.created_at}, 'YY'), '-', ${threadOrderInfo.id})`,
					page: chat.page,
					user_uuid: chat.user_uuid,
					user_name: chat_user.name,
					user_phone: chat_user.phone,
					message: chat.message,
					created_by: chat.created_by,
					created_by_name: hrSchema.users.name,
					created_at: chat.created_at,
					updated_at: chat.updated_at,
					remarks: chat.remarks,
				})
				.from(chat)
				.leftJoin(
					hrSchema.users,
					eq(chat.created_by, hrSchema.users.uuid)
				)
				.leftJoin(
					order_description,
					eq(chat.order_uuid, order_description.uuid)
				)
				.leftJoin(
					zipperOrderInfo,
					eq(order_description.order_info_uuid, zipperOrderInfo.uuid)
				)
				.leftJoin(
					threadOrderInfo,
					eq(chat.thread_order_info_uuid, threadOrderInfo.uuid)
				)
				.leftJoin(chat_user, eq(chat.user_uuid, chat_user.uuid))
				.where(eq(chat.uuid, data[0].uuid));

			// Emit new message to all clients in the order room
			try {
				const io = getIO();
				io.to(
					`order_${data[0].order_description_uuid || data[0].thread_order_info_uuid}`
				).emit('new_message', completeData);
				console.log(
					'Socket.IO initialized and message emitted:',
					completeData
				);
			} catch (emitError) {
				console.log(
					'Socket.IO not initialized or error emitting:',
					emitError
				);
			}
		} catch (selectError) {
			console.log(
				'Error fetching complete chat for emission:',
				selectError
			);
		}

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const chatPromise = db
		.update(chat)
		.set(req.body)
		.where(eq(chat.uuid, req.params.uuid))
		.returning({ updatedId: chat.id });

	try {
		const data = await chatPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedId} updated`,
		};

		// fetch complete chat row (with joins) to emit over socket
		try {
			// const users = hrSchema.users;
			const [completeData] = await db
				.select({
					uuid: chat.uuid,
					id: chat.id,
					chat_id: sql`CONCAT('CI', TO_CHAR(${chat.created_at}, 'YY'), '-', ${chat.id})`,
					order_description_uuid: chat.order_description_uuid,
					order_id: sql`CONCAT('ZO', TO_CHAR(${zipperOrderInfo.created_at}, 'YY'), '-', ${zipperOrderInfo.id})`,
					thread_order_info_uuid: chat.thread_order_info_uuid,
					thread_order_info_id: sql`CONCAT('TOI', TO_CHAR(${threadOrderInfo.created_at}, 'YY'), '-', ${threadOrderInfo.id})`,
					page: chat.page,
					user_uuid: chat.user_uuid,
					user_name: chat_user.name,
					user_phone: chat_user.phone,
					message: chat.message,
					created_by: chat.created_by,
					created_by_name: hrSchema.users.name,
					created_at: chat.created_at,
					updated_at: chat.updated_at,
					remarks: chat.remarks,
				})
				.from(chat)
				.leftJoin(
					hrSchema.users,
					eq(chat.created_by, hrSchema.users.uuid)
				)
				.leftJoin(
					order_description,
					eq(chat.order_uuid, order_description.uuid)
				)
				.leftJoin(
					zipperOrderInfo,
					eq(order_description.order_info_uuid, zipperOrderInfo.uuid)
				)
				.leftJoin(
					threadOrderInfo,
					eq(chat.thread_order_info_uuid, threadOrderInfo.uuid)
				)
				.leftJoin(chat_user, eq(chat.user_uuid, chat_user.uuid))
				.where(eq(chat.uuid, data[0].updatedId));

			// Emit updated message to room
			try {
				const io = getIO();
				io.to(
					`order_${completeData.order_description_uuid || completeData.thread_order_info_uuid}`
				).emit('new_message', completeData);
				console.log(
					'Socket.IO initialized and update emitted:',
					completeData
				);
			} catch (emitError) {
				console.log(
					'Socket.IO not initialized or error emitting update:',
					emitError
				);
			}
		} catch (selectError) {
			console.log(
				'Error fetching complete chat for emission after update:',
				selectError
			);
		}

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const chatPromise = db
		.delete(chat)
		.where(eq(chat.uuid, req.params.uuid))
		.returning({ deletedId: chat.id });
	try {
		const data = await chatPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const chatPromise = db
		.select({
			uuid: chat.uuid,
			id: chat.id,
			chat_id: sql`CONCAT('CI', TO_CHAR(${chat.created_at}, 'YY'), '-', ${chat.id})`,
			order_description_uuid: chat.order_description_uuid,
			order_id: sql`CONCAT('ZO', TO_CHAR(${zipperOrderInfo.created_at}, 'YY'), '-', ${zipperOrderInfo.id})`,
			thread_order_info_uuid: chat.thread_order_info_uuid,
			thread_order_info_id: sql`CONCAT('TOI', TO_CHAR(${threadOrderInfo.created_at}, 'YY'), '-', ${threadOrderInfo.id})`,
			page: chat.page,
			user_uuid: chat.user_uuid,
			user_name: chat_user.name,
			user_phone: chat_user.phone,
			message: chat.message,
			created_by: chat.created_by,
			created_by_name: hrSchema.users.name,
			created_at: chat.created_at,
			updated_at: chat.updated_at,
			remarks: chat.remarks,
		})
		.from(chat)
		.leftJoin(hrSchema.users, eq(chat.created_by, hrSchema.users.uuid))
		.leftJoin(
			order_description,
			eq(chat.order_description_uuid, order_description.uuid)
		)
		.leftJoin(
			zipperOrderInfo,
			eq(order_description.order_info_uuid, zipperOrderInfo.uuid)
		)
		.leftJoin(
			threadOrderInfo,
			eq(chat.thread_order_info_uuid, threadOrderInfo.uuid)
		)
		.leftJoin(chat_user, eq(chat.user_uuid, chat_user.uuid))
		.orderBy(desc(chat.created_at));

	try {
		const data = await chatPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'chat',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const chatPromise = db
		.select({
			uuid: chat.uuid,
			id: chat.id,
			chat_id: sql`CONCAT('CI', TO_CHAR(${chat.created_at}, 'YY'), '-', ${chat.id})`,
			order_description_uuid: chat.order_description_uuid,
			order_id: sql`CONCAT('ZO', TO_CHAR(${zipperOrderInfo.created_at}, 'YY'), '-', ${zipperOrderInfo.id})`,
			thread_order_info_uuid: chat.thread_order_info_uuid,
			thread_order_info_id: sql`CONCAT('TOI', TO_CHAR(${threadOrderInfo.created_at}, 'YY'), '-', ${threadOrderInfo.id})`,
			page: chat.page,
			user_uuid: chat.user_uuid,
			user_name: chat_user.name,
			user_phone: chat_user.phone,
			message: chat.message,
			created_by: chat.created_by,
			created_by_name: users.name,
			created_at: chat.created_at,
			updated_at: chat.updated_at,
			remarks: chat.remarks,
		})
		.from(chat)
		.leftJoin(hrSchema.users, eq(chat.created_by, hrSchema.users.uuid))
		.leftJoin(
			order_description,
			eq(chat.order_description_uuid, order_description.uuid)
		)
		.leftJoin(
			zipperOrderInfo,
			eq(order_description.order_info_uuid, zipperOrderInfo.uuid)
		)
		.leftJoin(
			threadOrderInfo,
			eq(chat.thread_order_info_uuid, threadOrderInfo.uuid)
		)
		.leftJoin(chat_user, eq(chat.user_uuid, chat_user.uuid))
		.where(eq(chat.uuid, req.params.uuid));
	try {
		const data = await chatPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'chat',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
