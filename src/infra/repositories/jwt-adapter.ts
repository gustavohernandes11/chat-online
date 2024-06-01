import { IEncryptRepository } from "@/domain/repositories-interfaces/encrypt-repository"
import jwt from "jsonwebtoken"

export class JwtAdapter implements IEncryptRepository {
    constructor(private readonly secret: string) {}

    async encrypt(plaintext: string): Promise<string> {
        return jwt.sign({ id: plaintext }, this.secret)
    }

    async decrypt(ciphertext: string): Promise<string> {
        return jwt.verify(ciphertext, this.secret) as string
    }
}
