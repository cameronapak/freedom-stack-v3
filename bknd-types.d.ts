import type { DB } from "bknd";
import type { Insertable, Selectable, Updateable, Generated } from "kysely";

declare global {
  type BkndEntity<T extends keyof DB> = Selectable<DB[T]>;
  type BkndEntityCreate<T extends keyof DB> = Insertable<DB[T]>;
  type BkndEntityUpdate<T extends keyof DB> = Updateable<DB[T]>;
}

export interface Posts {
  id: Generated<number>;
  content?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

interface Database {
  posts: Posts;
}

declare module "bknd" {
  interface DB extends Database {}
}