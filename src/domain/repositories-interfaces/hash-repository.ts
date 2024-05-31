export interface IHashRepository extends IHasher, IHashComparer {}

export type IHasher = {
	hash(text: string): Promise<string>;
};

export type IHashComparer = {
	compare(plaintext: string, digest: string): Promise<boolean>;
};
