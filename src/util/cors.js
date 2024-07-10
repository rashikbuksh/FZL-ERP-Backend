import cors from "cors";

const whitelist = [
	// FZL H/O
	"http://103.147.163.46:81",
	// "http://103.147.163.46:3000",
	// "http://103.147.163.46:3005",
	"http://103.147.163.46:4173",
	"http://103.147.163.46:4175",

	// Development
	"http://localhost:81",
	"http://localhost:3000",
	"http://localhost:3005",
	"http://localhost:4173",

	// RBR Home
	"http://192.168.10.56:81",
	// "http://192.168.10.56:3000",
	// "http://192.168.10.56:3005",
	"http://192.168.10.56:4173",
	"http://192.168.10.56:4175",
	"http://192.168.10.56:4176", // proxy server for http://192.168.10.56:4175
];

var corsOptionsDelegate = function (req, callback) {
	var corsOptions;
	if (whitelist.indexOf(req?.header("Origin")) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

export default cors(corsOptionsDelegate);
