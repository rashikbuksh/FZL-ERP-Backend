import { Router } from 'express';
import { validateUuidParam } from '../../lib/validator.js';
import * as departmentOperations from './query/department.js';
import * as designationOperations from './query/designation.js';
import * as policyAndNoticeOperations from './query/policy_and_notice.js';
import * as userOperations from './query/users.js';

const hrRouter = Router();

// user routes

hrRouter.post('/user/login', userOperations.loginUser);
hrRouter.get('/user/can-access/:uuid', userOperations.selectUsersAccessPages);
hrRouter.get('/user', userOperations.selectAll);
hrRouter.get('/user/:uuid', validateUuidParam(), userOperations.select);
hrRouter.post('/user', userOperations.insert);
hrRouter.put('/user/:uuid', userOperations.update);
hrRouter.delete('/user/:uuid', validateUuidParam(), userOperations.remove);
hrRouter.get('/user-common', userOperations.selectCommonUsers);
hrRouter.put('/user/can-access/:uuid', userOperations.changeUserAccess);
hrRouter.put('/user/status/:uuid', userOperations.changeUserStatus);
hrRouter.put('/user/password/:uuid', userOperations.changeUserPassword);

// department routes

hrRouter.get('/department', departmentOperations.selectAll);
hrRouter.get(
	'/department/:uuid',
	validateUuidParam(),
	departmentOperations.select
);
hrRouter.post('/department', departmentOperations.insert);
hrRouter.put('/department/:uuid', departmentOperations.update);
hrRouter.delete(
	'/department/:uuid',
	validateUuidParam(),
	departmentOperations.remove
);

// designation routes

hrRouter.get('/designation', designationOperations.selectAll);
hrRouter.get(
	'/designation/:uuid',
	validateUuidParam(),
	designationOperations.select
);
hrRouter.post('/designation', designationOperations.insert);
hrRouter.put('/designation/:uuid', designationOperations.update);
hrRouter.delete(
	'/designation/:uuid',
	validateUuidParam(),
	designationOperations.remove
);

// privacy_and_policy routes

hrRouter.get('/policy-and-notice', policyAndNoticeOperations.selectAll);
hrRouter.get(
	'/policy-and-notice/:uuid',
	validateUuidParam(),
	policyAndNoticeOperations.select
);
hrRouter.post('/policy-and-notice', policyAndNoticeOperations.insert);
hrRouter.put('/policy-and-notice/:uuid', policyAndNoticeOperations.update);
hrRouter.delete(
	'/policy-and-notice/:uuid',
	validateUuidParam(),
	policyAndNoticeOperations.remove
);
hrRouter.get(
	'/policy-and-notice/policy',
	policyAndNoticeOperations.selectPolicy
);
hrRouter.get(
	'/policy-and-notice/notice',
	policyAndNoticeOperations.selectNotice
);

export { hrRouter };
