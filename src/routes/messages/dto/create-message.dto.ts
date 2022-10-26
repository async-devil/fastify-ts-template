import { Type } from "@sinclair/typebox";

export const CreateMessageBodyDto = Type.Object({
	message: Type.String(),
});
