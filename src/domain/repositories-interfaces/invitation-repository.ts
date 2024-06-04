import { IAddInvitationModel, IInvite, IInviteStatus } from "../models/invite"

export interface IInvitationRepository
    extends ISaveInvitationRepository,
        IRemoveInvitationRepository,
        ICheckInvitationByIdRepository,
        IUpdateInvitationStatusRepository,
        IGetInvitationRepository,
        IListUserInvitations {}

export type ISaveInvitationRepository = {
    save(invite: IAddInvitationModel): Promise<string | null>
}

export type IRemoveInvitationRepository = {
    remove(id: string): Promise<boolean>
}

export type ICheckInvitationByIdRepository = {
    checkById(id: string): Promise<boolean>
}

export type IUpdateInvitationStatusRepository = {
    updateStatus(inviteId: string, status: IInviteStatus): Promise<boolean>
}

export type IGetInvitationRepository = {
    get(id: string): Promise<IInvite | null>
}

export type IListUserInvitations = {
    listUserInvitations(userId: string): Promise<IInvite[]>
}
