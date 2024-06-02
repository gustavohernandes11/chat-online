import { IInviteStatus } from "../models/invite"

export interface IInviteService
    extends ISaveInvitationRepository,
        IRemoveInvitationRepository,
        ICheckInvitationByIdRepository,
        IUpdateInvitationStatusRepository,
        IGetInvitationStatusRepository {}

export type ISaveInvitationRepository = {
    save(conversationId: string, accountId: string): Promise<string>
}

export type IRemoveInvitationRepository = {
    remove(id: string): Promise<boolean>
}

export type ICheckInvitationByIdRepository = {
    checkById(id: string): Promise<boolean>
}

export type IUpdateInvitationStatusRepository = {
    updateStatus(id: string, status: IInviteStatus): Promise<boolean>
}

export type IGetInvitationStatusRepository = {
    getStatus(id: string): Promise<IInviteStatus>
}
