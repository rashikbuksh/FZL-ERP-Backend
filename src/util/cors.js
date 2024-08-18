import cors from 'cors';

const whitelist = [
	// FZL H/O
	'http://103.147.163.46:3005',
	'http://103.147.163.46:4010',
	'http://103.147.163.46:3000',
	'http://103.147.163.46:4173',
	// Development
	'http://localhost:3005',
	'http://localhost:4010',
	'http://localhost:3000',
	'http://localhost:4173',
	// Office Server PC
	'http://192.168.10.56:3005',
	'http://192.168.10.56:4010',
	'http://192.168.10.56:3000',
	'http://192.168.10.56:4173',
];

var corsOptionsDelegate = function (req, callback) {
	var corsOptions;
	if (whitelist.indexOf(req?.header('Origin')) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

export default cors(corsOptionsDelegate);
