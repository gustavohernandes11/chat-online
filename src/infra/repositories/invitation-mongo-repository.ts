import {
    IAddInvitationModel,
    IInvite,
    IInviteStatus,
} from "@/domain/models/invite"
import { IInvitationRepository } from "@/domain/repositories-interfaces/invitation-repository"
import { MongoHelper } from "../utils/mongo-helper"
import { parseToObjectId } from "../utils/parse-to-object-id"

export class InvitationMongoRepository implements IInvitationRepository {
    async save(invite: IAddInvitationModel): Promise<string | null> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const { insertedId } =
            inviteCollection && (await inviteCollection.insertOne(invite))
        return insertedId ? insertedId.toString() : null
    }
    async remove(id: string): Promise<boolean> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const { deletedCount } =
            inviteCollection &&
            (await inviteCollection.deleteOne({ _id: parseToObjectId(id) }))
        return deletedCount === 1
    }
    async checkById(id: string): Promise<boolean> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const invitation = await inviteCollection.findOne({
            _id: parseToObjectId(id),
        })
        return invitation !== null
    }
    async updateStatus(
        inviteId: string,
        status: IInviteStatus
    ): Promise<boolean> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const { modifiedCount } =
            inviteCollection &&
            (await inviteCollection.updateOne(
                { _id: parseToObjectId(inviteId) },
                { $set: { status } }
            ))
        return modifiedCount === 1
    }
    async get(id: string): Promise<IInvite | null> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const invitation = await inviteCollection.findOne({
            _id: parseToObjectId(id),
        })
        return invitation ? MongoHelper.map(invitation) : null
    }
    async listUserInvitations(userId: string): Promise<IInvite[]> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const invitations = await inviteCollection.find({ userId }).toArray()
        return MongoHelper.mapCollection(invitations)
    }
    async listConversationInvitations(
        conversationId: string
    ): Promise<IInvite[]> {
        const inviteCollection = MongoHelper.getCollection("invitations")
        const invitations = await inviteCollection
            .find({ conversationId })
            .toArray()
        return MongoHelper.mapCollection(invitations)
    }
}
