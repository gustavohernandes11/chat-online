import { IEncryptRepository } from "@/domain/repositories-interfaces/encrypt-repository";
import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
	async sign(): Promise<string> {
		return new Promise((resolve) => resolve("encrypted_text"));
	},
	async verify(): Promise<string> {
		return new Promise((resolve) => resolve("decrypted_text"));
	},
}));

type ISutType = {
	sut: IEncryptRepository;
};

const makeSut = (): ISutType => {
	const secret = "any_secret";

	return {
		sut: new JwtAdapter(secret),
	};
};

describe("JWT Adapter", () => {
	describe("encrypt", () => {
		it("should call encrypt method with correct parameters", () => {
			const { sut } = makeSut();
			const jwtSpy = jest.spyOn(sut, "encrypt");
			const text = "any_text";
			sut.encrypt(text);

			expect(jwtSpy).toHaveBeenCalledWith("any_text");
		});
		it("should return an encrypted text", async () => {
			const { sut } = makeSut();
			const text = "any_text";
			const response = await sut.encrypt(text);

			expect(response).toBeTruthy();
		});
		it("should throw if encrypt throws", async () => {
			const { sut } = makeSut();
			const encryptSpy = jest.spyOn(jwt, "sign");
			encryptSpy.mockImplementationOnce((): never => {
				throw new Error();
			});
			const promise = sut.encrypt("any_text");

			expect(promise).rejects.toThrow();
		});
	});
	describe("decrypt", () => {
		it("should call decrypt with correct values", async () => {
			const { sut } = makeSut();
			const jwtSpy = jest.spyOn(sut, "decrypt");
			const text = "any_text";
			await sut.decrypt(text);

			expect(jwtSpy).toHaveBeenCalledWith("any_text");
			expect(jwtSpy).toHaveBeenCalled();
		});
		it("should return an encrypted value on success", async () => {
			const { sut } = makeSut();
			const response = await sut.decrypt("any_text");

			expect(response).toBe("decrypted_text");
		});

		it("should throw if decrypt throws", () => {
			const { sut } = makeSut();
			jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
				throw new Error();
			});
			const promise = sut.decrypt("any_text");
			expect(promise).rejects.toThrow();
		});
	});
});
