import { randomUUID } from "crypto";

import fastify from "fastify";

import MessagesController from "src/routes/messages/messages.controller";
import { fastifyRedisMock } from "test/mocks/fastifyRedis.mock";

describe("Sandwiches controller", () => {
	const app = fastify();

	beforeAll(async () => {
		void app.register(MessagesController, {});
		void app.decorate("redis", fastifyRedisMock);

		await app.ready();
	});

	afterAll(() => app.close());

	describe("Get message route", () => {
		test("Should return message if exists", async () => {
			jest.spyOn(app.redis, "get").mockResolvedValueOnce("message");

			const result = await app.inject({
				url: randomUUID(),
			});

			expect(JSON.parse(result.payload)).toHaveProperty("message", "message");
		});

		test("Should return 404 on nonexisting message", async () => {
			jest.spyOn(app.redis, "get").mockResolvedValueOnce(undefined);

			const result = await app.inject({
				url: randomUUID(),
			});

			expect(JSON.parse(result.payload)).toHaveProperty("statusCode", 404);
		});

		test("Should return 400 on invalid sandwich id", async () => {
			const result = await app.inject({ url: "/notUUID" });

			expect(JSON.parse(result.payload)).toHaveProperty("statusCode", 400);
		});
	});

	describe("Create message route", () => {
		test("Should return created message id", async () => {
			jest.spyOn(app.redis, "set").mockResolvedValueOnce("OK");

			const result = await app.inject({
				method: "POST",
				url: "/",
				payload: {
					message: "message",
				},
			});

			expect(JSON.parse(result.payload)).toHaveProperty("id", expect.any(String));
		});

		test("Should return 400 on invalid data", async () => {
			const result = await app.inject({
				method: "POST",
				url: "/",
				payload: {
					message: [],
				},
			});

			expect(JSON.parse(result.payload)).toHaveProperty("statusCode", 400);
		});
	});
});
