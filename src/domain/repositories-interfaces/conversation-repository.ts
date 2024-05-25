import { IMessage } from "../models/message";

export type IConversationRepository = {
	createNewConversation(): Promise<string>;
	removeConversation(): Promise<boolean>;
	checkConversationById(id: string): Promise<boolean>;
	checkMessageById(id: string): Promise<boolean>;
	getAllMessages(conversationId: string): Promise<IMessage[]>;
};
