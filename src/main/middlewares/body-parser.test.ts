import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";

describe("Body Parser Middleware", () => {
	let app: Express;
	beforeAll(async () => {
		app = await setupApp();
	});
	it("should parse the content type to json", async () => {
		app.get("/test_body_parser", (req, res) => {
			res.send(req.body);
		});
		await request(app)
			.get("/test_body_parser")
			.send({ name: "John" })
			.expect({ name: "John" });
	});
});
