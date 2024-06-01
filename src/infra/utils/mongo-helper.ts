import { Collection, MongoClient } from "mongodb"

export const MongoHelper = {
    client: null as unknown as MongoClient,
    uri: null as unknown as string,

    async connect(uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri)
    },

    async createIndexes(): Promise<void> {
        const animalsCollection = this.getCollection("animals")

        await animalsCollection.createIndex({
            name: "text",
            code: "text",
        })
    },

    async disconnect(): Promise<void> {
        await this.client?.close()
        this.client = null as unknown as MongoClient
    },

    getCollection(name: string): Collection {
        return this.client.db().collection(name)
    },

    map: (data: any): any => {
        const { _id, ...rest } = data
        return { ...rest, id: _id.toHexString() }
    },

    mapCollection: (collection: any[]): any[] => {
        return collection.map(c => MongoHelper.map(c))
    },
}
