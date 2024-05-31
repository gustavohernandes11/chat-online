import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";

describe("Content Type Middleware", () => {
	let app: Express;
	beforeAll(async () => {
		app = await setupApp();
	});
	it("should return json content type by default", async () => {
		app.get("/test_content_type", (req, res) => {
			res.send("");
		});
		await request(app)
			.get("/test_content_type")
			.expect("content-type", /json/);
	});
});
