import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";

describe("No cache Middleware", () => {
	let app: Express;
	beforeAll(async () => {
		app = await setupApp();
	});
	it("should disable cache", async () => {
		app.get("/test_cache", (req, res) => {
			res.send();
		});
		await request(app)
			.get("/test_cache")
			.expect(
				"cache-control",
				"no-store, no-cache, must-revalidate, proxy-revalidate"
			)
			.expect("pragma", "no-cache")
			.expect("surrogate-control", "no-store");
	});
});
