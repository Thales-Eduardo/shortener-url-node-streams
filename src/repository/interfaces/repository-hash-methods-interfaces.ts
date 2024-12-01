export interface RepositoryHashMethodsInterface {
  createHash(
    hash: string,
    available: boolean,
    limit_hash: number
  ): Promise<boolean>;

  createUserUrl(
    user_id: string,
    url_original: string
  ): Promise<string | undefined>;

  seandByHash(hash: string): Promise<string>;
}
