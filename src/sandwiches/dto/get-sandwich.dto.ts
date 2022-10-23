import { Type } from "@sinclair/typebox";

export const GetSandwichParamsDto = Type.Object({
	id: Type.Number(),
});

export const GetSandwichResponseDto = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	ingredients: Type.Record(Type.String(), Type.Number()),
});
