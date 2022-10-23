import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fp from "fastify-plugin";

import { CreateSandwichBodyDto, CreateSandwichResponseDto } from "./dto/create-sandwich.dto";
import { GetSandwichParamsDto, GetSandwichResponseDto } from "./dto/get-sandwich.dto";

// FastifyPluginCallbackTypebox || FastifyPluginAsyncTypebox
const SandwichesController: FastifyPluginAsyncTypebox = async (server) => {
	server.get(
		"/sandwiches/:id",
		{
			schema: {
				params: GetSandwichParamsDto,
				response: {
					200: GetSandwichResponseDto,
				},
			},
		},
		(request) => {
			return {
				id: request.params.id,
				name: "Meat sandwich",
				ingredients: { bread: 2, meat: 1 },
			};
		}
	);

	server.post(
		"/sandwiches",
		{
			schema: {
				body: CreateSandwichBodyDto,
				response: {
					201: CreateSandwichResponseDto,
				},
			},
		},
		async (request, response) => {
			return await response.code(201).send({
				id: Date.now(),
				name: request.body.name,
				ingredients: request.body.ingredients,
			});
		}
	);
};

export default fp(SandwichesController);
