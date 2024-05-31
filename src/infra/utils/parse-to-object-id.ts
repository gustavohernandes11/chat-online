import { ObjectId } from "mongodb";

export const parseToObjectId = (
	id: ObjectId | string
): ObjectId | undefined => {
	if (typeof id === "string") {
		try {
			return new ObjectId(id);
		} catch (_) {
			return undefined;
		}
	} else {
		return id;
	}
};
