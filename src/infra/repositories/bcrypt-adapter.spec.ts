import { IHashRepository } from "@/domain/repositories-interfaces/hash-repository"
import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock("bcrypt", () => ({
    async hash(): Promise<string> {
        return "hash"
    },
    async compare(): Promise<boolean> {
        return true
    },
}))

type ISutType = {
    sut: IHashRepository
}
const makeSut = (): ISutType => {
    return {
        sut: new BcryptAdapter(12),
    }
}

describe("Bcrypt Adapter", () => {
    describe("hash()", () => {
        it("should use the correct params", () => {
            const { sut } = makeSut()
            const bcryptSpy = jest.spyOn(bcrypt, "hash")

            sut.hash("any_text")

            expect(bcryptSpy).toHaveBeenCalledWith("any_text", 12)
        })
        it("should return a valid hash value", async () => {
            const { sut } = makeSut()
            jest.spyOn(bcrypt, "hash")

            const response = await sut.hash("any_text")

            expect(response).toBe("hash")
        })
        it("should throw if bcrypt throws", async () => {
            const { sut } = makeSut()
            const bcryptSpy = jest.spyOn(bcrypt, "hash")
            bcryptSpy.mockImplementationOnce(() => {
                throw new Error()
            })

            const promise = sut.hash("any_text")

            expect(promise).rejects.toThrow()
        })
    })
    describe("compare", () => {
        it("should use the correct values in method", async () => {
            const { sut } = makeSut()
            const compareSpy = jest.spyOn(sut, "compare")

            const original = "any_text"
            const hashed = await sut.hash(original)

            await sut.compare(original, hashed)

            expect(compareSpy).toHaveBeenCalledWith("any_text", hashed)
        })
        it("should return true if the hashed IS the same as the original after hashing", async () => {
            const { sut } = makeSut()

            const original = "any_text"
            const hashed = await sut.hash(original)
            const response = await sut.compare(original, hashed)

            expect(response).toBeTruthy()
        })
        it("should return false if the hashed IS NOT the same as the original after hashing", async () => {
            const { sut } = makeSut()
            jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => false)

            const original = "any_text"
            const hashed = await sut.hash("not_the_any_text")
            const response = await sut.compare(original, hashed)

            expect(response).toBeFalsy()
        })
        it("should throw if compare throws", async () => {
            const { sut } = makeSut()
            jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
                throw new Error()
            })

            const promise = sut.compare("any_text", "any_hash")

            expect(promise).rejects.toThrow()
        })
    })
})
