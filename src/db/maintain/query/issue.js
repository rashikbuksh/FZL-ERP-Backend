import { desc, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { issue, section_machine } from '../schema.js';
import webPush from 'web-push';
import * as publicSchema from '../../public/schema.js';

import { alias } from 'drizzle-orm/pg-core';

const maintain_by_user = alias(hrSchema.users, 'maintain_by_user');
const verification_by_user = alias(hrSchema.users, 'verification_by_user');

import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from '../../../lib/secret.js';

webPush.setVapidDetails(
	'mailto:rafsan@fortunezip.com',
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const issueEntryPromise = db
		.insert(issue)
		.values(req.body)
		.returning({ insertedUuid: issue.uuid });

	try {
		const data = await issueEntryPromise;

		// // Get the Socket.IO instance and broadcast the new issue event
		// //const io = getIO();
		// // io.emit('new-issue', {
		// // 	message: 'A new issue has been created',
		// // 	issueData: {
		// // 		uuid: data[0].insertedUuid,
		// // 		...newIssue,
		// // 	},
		// // });
		// //io.emit('new-issue', 'A new issue has been arrived');

		// // Debug getIO function
		// console.log('🔴 Calling getIO()...');
		// const { io, broadcastToAll } = getIO();
		// console.log('🔴 getIO() returned:', typeof io);

		// if (!io) {
		// 	console.log('🔴 ERROR: io is null or undefined');
		// 	return;
		// }

		// console.log('🔴 IO engine exists:', !!io.engine);
		// console.log('🔴 Connected clients:', io.engine?.clientsCount || 0);
		// console.log('🔴 About to emit new-issue event...');

		// // Use the destructured io instance
		// io.emit('new-issue', {
		// 	message: 'A new issue has been created',
		// 	issueData: {
		// 		uuid: data[0].insertedUuid,
		// 		timestamp: new Date().toISOString(),
		// 	},
		// });

		// // Or use the helper function
		// // broadcastToAll('new-issue', {
		// // 	message: 'A new issue has been created',
		// // 	issueData: {
		// // 		uuid: data[0].insertedUuid,
		// // 		timestamp: new Date().toISOString()
		// // 	}
		// // });

		// console.log('🔴 ✅ Socket.IO emit completed successfully');

		// send push notification to every subscribe user using web-push

		const payload = JSON.stringify({
			title: 'New Issue Created',
			body: `A new issue has been created with ID: ${data[0].insertedUuid}`,
		});

		const sendPushNotifications = async () => {
			const subscriptionData = await db
				.select()
				.from(publicSchema.subscription);
			let successCount = 0;
			let errorCount = 0;

			for (const subscription of subscriptionData) {
				try {
					// Parse the subscription object from the endpoint field
					const pushSubscription = JSON.parse(subscription.endpoint);

					// Validate subscription object
					if (!pushSubscription.endpoint || !pushSubscription.keys) {
						console.warn(
							`Invalid subscription format: ${subscription.endpoint}`
						);
						errorCount++;
						continue;
					}

					// Fix the endpoint URL format for FCM
					if (pushSubscription.endpoint.includes('/fcm/send/')) {
						pushSubscription.endpoint =
							pushSubscription.endpoint.replace(
								'/fcm/send/',
								'/wp/'
							);
					}

					console.log(
						`Sending notification to: --->>> ${pushSubscription.endpoint}`
					);

					await webPush.sendNotification(pushSubscription, payload);
					successCount++;
					console.log(`✅ Notification sent successfully`);
				} catch (error) {
					errorCount++;
					console.error(
						`Failed to send notification to --->>> ${subscription.endpoint}`,
						error.message || error
					);
				}
			}

			console.log(
				`📊 Push notification summary: ${successCount} sent, ${errorCount} failed`
			);
		};

		await sendPushNotifications();

		const toast = {
			status: 201,
			type: 'insert',
			message: `${data.length} inserted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const issueEntryPromise = db
		.update(issue)
		.set(req.body)
		.where(eq(issue.uuid, req.params.uuid))
		.returning({ updatedUuid: issue.uuid });

	try {
		const data = await issueEntryPromise;

		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedUuid} updated`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	const issueEntryPromise = db
		.delete(issue)
		.where(eq(issue.uuid, req.params.uuid))
		.returning({ deletedUuid: issue.uuid });

	try {
		const data = await issueEntryPromise;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedUuid} deleted`,
		};

		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	const issueEntryPromise = db
		.select({
			id: issue.id,
			uuid: issue.uuid,
			issue_id: sql`concat('MT', to_char(issue.created_at, 'YY'), '-', issue.id::text)`,
			section_machine_uuid: issue.section_machine_uuid,
			section_machine_name: section_machine.name,
			section: issue.section,
			problem_type: issue.problem_type,
			description: issue.description,
			emergence: issue.emergence,
			parts_problem: issue.parts_problem,
			maintain_condition: issue.maintain_condition,
			maintain_description: issue.maintain_description,
			maintain_date: issue.maintain_date,
			maintain_by: issue.maintain_by,
			maintain_by_name: maintain_by_user.name,
			maintain_remarks: issue.maintain_remarks,
			verification_approved: issue.verification_approved,
			verification_date: issue.verification_date,
			verification_by: issue.verification_by,
			verification_by_name: verification_by_user.name,
			verification_remarks: issue.verification_remarks,
			created_by: issue.created_by,
			created_by_name: hrSchema.users.name,
			created_at: issue.created_at,
			updated_at: issue.updated_at,
			remarks: issue.remarks,
		})
		.from(issue)
		.leftJoin(
			section_machine,
			eq(issue.section_machine_uuid, section_machine.uuid)
		)
		.leftJoin(hrSchema.users, eq(issue.created_by, hrSchema.users.uuid))
		.leftJoin(
			maintain_by_user,
			eq(issue.maintain_by, maintain_by_user.uuid)
		)
		.leftJoin(
			verification_by_user,
			eq(issue.verification_by, verification_by_user.uuid)
		)
		.where(eq(issue.uuid, req.params.uuid));

	try {
		const data = await issueEntryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'issue selected',
		};

		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const issueEntryPromise = db
		.select({
			id: issue.id,
			uuid: issue.uuid,
			issue_id: sql`concat('MT', to_char(issue.created_at, 'YY'), '-', issue.id::text)`,
			section_machine_uuid: issue.section_machine_uuid,
			section_machine_name: section_machine.name,
			section: issue.section,
			problem_type: issue.problem_type,
			description: issue.description,
			emergence: issue.emergence,
			parts_problem: issue.parts_problem,
			maintain_condition: issue.maintain_condition,
			maintain_description: issue.maintain_description,
			maintain_date: issue.maintain_date,
			maintain_by: issue.maintain_by,
			maintain_by_name: maintain_by_user.name,
			maintain_remarks: issue.maintain_remarks,
			verification_approved: issue.verification_approved,
			verification_date: issue.verification_date,
			verification_by: issue.verification_by,
			verification_by_name: verification_by_user.name,
			verification_remarks: issue.verification_remarks,
			created_by: issue.created_by,
			created_by_name: hrSchema.users.name,
			created_at: issue.created_at,
			updated_at: issue.updated_at,
			remarks: issue.remarks,
		})
		.from(issue)
		.leftJoin(
			section_machine,
			eq(issue.section_machine_uuid, section_machine.uuid)
		)
		.leftJoin(hrSchema.users, eq(issue.created_by, hrSchema.users.uuid))
		.leftJoin(
			maintain_by_user,
			eq(issue.maintain_by, maintain_by_user.uuid)
		)
		.leftJoin(
			verification_by_user,
			eq(issue.verification_by, verification_by_user.uuid)
		)
		.orderBy(desc(issue.created_at));

	try {
		const data = await issueEntryPromise;
		const toast = {
			status: 200,
			type: 'select all',
			message: 'issue selectAll',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
