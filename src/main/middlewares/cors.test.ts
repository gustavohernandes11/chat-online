import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";

describe("CORS Middleware", () => {
	let app: Express;
	beforeAll(async () => {
		app = await setupApp();
	});
	it("should enable cors", async () => {
		app.get("/test_cors", (req, res) => {
			res.send();
		});
		await request(app)
			.get("/test_cors")
			.expect("access-control-allow-origin", "*")
			.expect("access-control-allow-headers", "*")
			.expect("access-control-allow-methods", "*");
	});
});
