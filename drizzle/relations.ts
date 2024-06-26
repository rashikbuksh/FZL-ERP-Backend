import { relations } from "drizzle-orm/relations";
import { users, auth_otp } from "./schema";

export const auth_otpRelations = relations(auth_otp, ({one}) => ({
	user: one(users, {
		fields: [auth_otp.user_id],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	auth_otps: many(auth_otp),
}));