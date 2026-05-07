export type Product = {
  id: string;
  name: string;
  genre: string;
  concern: string;
  affiliateUrl: string;
  memo: string;
};

export type ThemeInput = {
  theme: string;
  target: string;
  postGoal: string;
  tone: string;
};

export type CarouselSlide = {
  title: string;
  body: string;
};

export type GeneratedDraft = {
  carousel: CarouselSlide[];
  imagePrompts: string[];
  caption: string;
  cta: string;
  affiliateLink: Product | null;
  prLabel: string;
};
