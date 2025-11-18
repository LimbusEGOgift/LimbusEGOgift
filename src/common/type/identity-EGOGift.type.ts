type EGOGiftDetail = {
  조건?: string[];
  [key: string]: unknown;
};
export type EGOGiftCollection = Record<string, EGOGiftDetail>;

type IdentityDetail = {
  키워드?: string[];
  [key: string]: unknown;
};
export type IdentityCollection = Record<string, IdentityDetail>;
