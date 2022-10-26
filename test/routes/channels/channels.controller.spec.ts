import fastify from "fastify";

import ChannelsController from "src/routes/channels/channels.controller";
import { fastifyRedisMock } from "test/mocks/fastifyRedis.mock";

describe("Sandwiches controller", () => {
	const app = fastify();

	beforeAll(async () => {
		void app.register(ChannelsController, {});
		void app.decorate("redis", fastifyRedisMock);

		await app.ready();
	});

	afterAll(() => app.close());

	describe("Subscribe to channel route", () => {
		test("Should subscribe on channel", async () => {
			await app.inject({
				method: "POST",
				url: "/channel/subscribe",
			});
		});
	});

	describe("Publish message to channel route", () => {
		test("Should publish message on channel", async () => {
			await app.inject({
				method: "POST",
				url: "/channel/message",
				payload: {
					message: "message",
				},
			});
		});
	});

	describe("Get channel messages route", () => {
		test("Should get all channel messages from the beginning of connection", async () => {
			const result = await app.inject({
				url: "/channel/messages",
			});

			expect(JSON.parse(result.payload)).toEqual([]);
		});
	});
});
