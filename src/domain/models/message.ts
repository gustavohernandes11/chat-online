import { IAccountModel } from "./account";

export type IMessage = {
	id: string;
	date: string;
	text: string;
	author: IAccountModel;
};
