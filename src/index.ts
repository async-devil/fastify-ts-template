import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";

import SandwichesController from "./sandwiches/sandwiches.controller";

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

void server.register(SandwichesController);

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server is listening at ${address}`);
});
