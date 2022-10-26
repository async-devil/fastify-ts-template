import { Type } from "@sinclair/typebox";

export const GetMessageParamsDto = Type.Object({
	id: Type.String({ format: "uuid" }),
});
