import { readFileSync } from "fs";
import path from "path";

function readFile(relativePathFromRoot: string) {
	const filePath = path.resolve(relativePathFromRoot);
	const data = readFileSync(filePath, "utf-8");
	return data;
}

function parseHeaders(rawHeaders: string, startFromLine = 1) {
	const filteredHeaders = ["Content-Length"];

	return Object.fromEntries(
		rawHeaders
			.split("\n")
			.slice(startFromLine)
			.filter((key) => !filteredHeaders.every((filter) => key.includes(filter)))
			.map((line) => {
				const colonIndex = line.indexOf(":");
				return [
					line.slice(0, colonIndex).trim(),
					line.slice(colonIndex + 1).trim(),
				];
			}),
	);
}

async function main() {
	const parsedHeaders = parseHeaders(readFile("./request/headers"));
	const payload = readFile("./request/payload");
	const api = readFile("./request/api");

	const headers = new Headers(parsedHeaders);
	const request: RequestInit = {
		headers: headers,
		body: payload,
		method: "POST",
	};
	const res = await fetch(api, request);

	console.log(JSON.stringify(await res.json()));
	console.log("fin", res.status, res.statusText);
}

main();
