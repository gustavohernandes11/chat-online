import { IMessage } from "../models/message";

export type IConversationService = {
	createNewConversation(): Promise<string>;
	getMessages(conversationId: string): Promise<IMessage[]>;
};
