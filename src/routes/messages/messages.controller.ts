import { randomUUID } from "crypto";

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { NotFound } from "http-errors";

import { CreateMessageBodyDto } from "./dto/create-message.dto";
import { GetMessageParamsDto } from "./dto/get-message.dto";

export const autoPrefix = "/messages";

const MessagesController: FastifyPluginAsyncTypebox = async (server) => {
	server.get(
		"/:id",
		{
			schema: {
				params: GetMessageParamsDto,
				response: {
					200: CreateMessageBodyDto,
				},
			},
		},
		async (request) => {
			const message = await server.redis.get(request.params.id.toString());

			if (!message) throw new NotFound();

			return { message };
		}
	);

	server.post(
		"/",
		{
			schema: {
				body: CreateMessageBodyDto,
				response: {
					201: GetMessageParamsDto,
				},
			},
		},
		async (request, response) => {
			const id = randomUUID();

			await server.redis.set(id, request.body.message);

			await response.code(201).send({ id });
		}
	);
};

export default MessagesController;
