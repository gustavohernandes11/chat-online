export interface IEncryptRepository extends IEncrypter, IDecrypter {}

export type IEncrypter = {
	encrypt(plaintext: string): Promise<string>;
};

export type IDecrypter = {
	decrypt(ciphertext: string): Promise<string>;
};
