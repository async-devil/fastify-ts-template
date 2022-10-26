import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

export const autoPrefix = "/channels";

const ChannelsController: FastifyPluginAsyncTypebox = async (server) => {
	const messages: { channel: string; message: string }[] = [];

	server.post(
		"/:channel/subscribe",
		{
			schema: {
				params: Type.Object({
					channel: Type.String(),
				}),
			},
		},
		async (request) => {
			await server.redis.subscribe(request.params.channel);

			server.redis.on("message", (channel: string, message: string) => {
				messages.push({ channel, message });
			});
		}
	);

	server.post(
		"/:channel/message",
		{
			schema: {
				params: Type.Object({
					channel: Type.String(),
				}),
				body: Type.Object({ message: Type.String() }),
			},
		},
		async (request) => {
			await server.redis.publish(request.params.channel, request.body.message);
		}
	);

	server.get(
		"/:channel/messages",
		{
			schema: {
				params: Type.Object({
					channel: Type.String(),
				}),
				response: {
					200: Type.Array(Type.String()),
				},
			},
		},
		(request) => {
			return messages
				.filter((message) => message.channel === request.params.channel)
				.map((message) => message.message);
		}
	);
};

export default ChannelsController;
