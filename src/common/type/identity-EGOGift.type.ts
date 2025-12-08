type EGOGiftDetail = {
  Rate: number;
  Trait: string[];
  Keyword: string[];
  Skill1: string[];
  Skill2: string[];
  Skill3: string[];
  Formation: string[];
  Recipe: string[];
  ThemePack: string[];
  Effect: string;
};
export type EGOGiftCollection = Record<string, EGOGiftDetail>;

type IdentityDetail = {
  Trait: string[];
  Keyword: string[];
  Skill1: string[];
  Skill2: string[];
  Skill3: string[];
};
export type IdentityCollection = Record<string, IdentityDetail>;
