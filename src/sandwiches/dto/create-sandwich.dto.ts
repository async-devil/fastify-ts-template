import { Type } from "@sinclair/typebox";

export const CreateSandwichBodyDto = Type.Object({
	name: Type.String(),
	ingredients: Type.Record(Type.String(), Type.Number()),
});

export const CreateSandwichResponseDto = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	ingredients: Type.Record(Type.String(), Type.Number()),
});
