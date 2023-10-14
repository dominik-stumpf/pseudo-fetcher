import http from "http";

const hostname = "localhost";
const port = 3001;

function safeStringify(obj, indent = 2) {
	let cache = [];
	const retVal = JSON.stringify(
		obj,
		(key, value) =>
			typeof value === "object" && value !== null
				? cache.includes(value)
					? undefined
					: cache.push(value) && value
				: value,
		indent,
	);
	cache = null;
	return retVal;
}

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(safeStringify(req.headers));
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
