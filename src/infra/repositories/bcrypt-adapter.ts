import { IHashRepository } from "@/domain/repositories-interfaces/hash-repository"
import bcrypt from "bcrypt"

export class BcryptAdapter implements IHashRepository {
    constructor(private readonly salt: number) {}

    async hash(text: string): Promise<string> {
        return await bcrypt.hash(text, this.salt)
    }

    async compare(plaintext: string, digest: string): Promise<boolean> {
        return await bcrypt.compare(plaintext, digest)
    }
}
