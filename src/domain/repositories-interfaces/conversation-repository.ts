import { IMessage } from "../models/message";

export interface IConversationRepository
	extends ICreateNewConversationRepository,
		IRemoveConversationRepository,
		ICheckConversationByIdRepository,
		ICheckMessageByIdRepository,
		IGetAllMessagesRepository {}

export type ICreateNewConversationRepository = {
	createNewConversation(): Promise<string>;
};

export type IRemoveConversationRepository = {
	removeConversation(): Promise<boolean>;
};

export type ICheckConversationByIdRepository = {
	checkConversationById(id: string): Promise<boolean>;
};

export type ICheckMessageByIdRepository = {
	checkMessageById(id: string): Promise<boolean>;
};

export type IGetAllMessagesRepository = {
	getAllMessages(conversationId: string): Promise<IMessage[]>;
};
