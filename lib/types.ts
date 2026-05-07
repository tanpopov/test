export type Product = {
  id: string;
  name: string;
  category: string;
  appeal: string;
  affiliateUrl: string;
};

export type ThemeInput = {
  theme: string;
  target: string;
  postGoal: string;
  tone: string;
};

export type GeneratedDraft = {
  carousel: string[];
  imagePrompts: string[];
  caption: string;
  cta: string;
  linkCandidates: Product[];
};
