import { vegetableKnowledgeList } from "@/lib/vegetableKnowledge";

export type TopicType = "cutting" | "cooking" | "storage";
export type VegetableKey = string;

type Slide = { title: string; body: string };
type TopicContent = { hook:[string,string]; slides: Slide[]; caption: string[]; cta: string; imagePromptHints: string[]; bannedPhrases?: string[] };
type VegetableMaster = { key:string; aliases:string[]; category:"leaf"|"fruit"|"flower"|"root"|"stem"|"tuber"|"bulb"|"sprout"; bannedCommonPhrases:string[]; topics: Record<TopicType, TopicContent> };

const categoryMap: Record<string, VegetableMaster["category"]> = {"キャベツ":"leaf","レタス":"leaf","サニーレタス":"leaf","グリーンリーフ":"leaf","白菜":"leaf","ほうれん草":"leaf","小松菜":"leaf","水菜":"leaf","春菊":"leaf","チンゲン菜":"leaf","にら":"leaf","ブロッコリー":"flower","カリフラワー":"flower","アスパラガス":"stem","白ねぎ":"stem","青ねぎ":"stem","オクラ":"fruit","ピーマン":"fruit","パプリカ":"fruit","ししとう":"fruit","なす":"fruit","トマト":"fruit","ミニトマト":"fruit","きゅうり":"fruit","ズッキーニ":"fruit","とうもろこし":"fruit","かぼちゃ":"fruit","ゴーヤ":"fruit","じゃがいも":"tuber","さつまいも":"tuber","里芋":"tuber","長芋":"tuber","山芋":"tuber","大根":"root","にんじん":"root","ごぼう":"root","れんこん":"root","かぶ":"root","玉ねぎ":"bulb","もやし":"sprout"};

const aliasMap: Record<string,string[]> = {"トマト":["tomato"],"ミニトマト":["プチトマト"],"白ねぎ":["長ねぎ","ねぎ"],"青ねぎ":["小ねぎ"],"ピーマン":["green pepper"]};

const topicFromTips = (name:string, tips:string[], kind:TopicType): TopicContent => ({
  hook:[name, kind==="cutting"?"切り方で差が出る":kind==="storage"?"保存で差が出る":"おいしさが変わる"],
  slides:[
    {title:"1枚目：フック",body:`${name}\n${kind==="cutting"?"切り方で差が出る":kind==="storage"?"保存で差が出る":"おいしく食べる"}`},
    {title:"2枚目：よくある失敗",body:`${tips[2]||"自己流だけ"}\n続けてしまう`},
    {title:"3枚目：原因",body:`${tips[1]||"条件が違う"}\n結果が変わる`},
    {title:"4枚目：解決策",body:`${tips[0]||"まず1つ実践"}\n${tips[1]||"次に2つ目実践"}`},
    {title:"5枚目：保存CTA＋商品導線",body:`あとで保存\n${kind==="cutting"?"切り方で変わる":kind==="storage"?"保存で変わる":"調理で変わる"}`},
  ],
  caption:[`${name}の${kind==="cutting"?"切り方":kind==="storage"?"保存方法":"おいしい食べ方"}を5枚でまとめました。`,tips[2]||"失敗しやすい点",tips[1]||"理由",tips[0]||"解決策","あとで見返すなら保存してください。"],
  cta:`あとで見返すなら保存。\n${name}は${kind==="cutting"?"切り方":kind==="storage"?"保存":"調理"}で変わります。`,
  imagePromptHints:[`${name} close-up`,tips[2]||"mistake",tips[1]||"cause",tips[0]||"solution",`${name} finished prep`],
});

export const VEGETABLE_MASTER: Record<string, VegetableMaster> = Object.fromEntries(vegetableKnowledgeList.map(v=>[v.name,{key:v.name,aliases:[v.name,...(aliasMap[v.name]||[])],category:categoryMap[v.name],bannedCommonPhrases:v.avoidWords||[],topics:{cutting:topicFromTips(v.name,v.cuttingTips,"cutting"),cooking:topicFromTips(v.name,v.cookingTips,"cooking"),storage:topicFromTips(v.name,v.storageTips,"storage")}}]));

export const normalizeVegetable = (input:string): VegetableKey | null => {
  const lower=input.toLowerCase();
  for (const m of Object.values(VEGETABLE_MASTER)) if (m.aliases.some(a=>lower.includes(a.toLowerCase()))) return m.key;
  return null;
};
export const detectTopicType = (input:string): TopicType => {
  if (/美味しい食べ方/.test(input)) return "cooking";
  if (/(切り方|切る|千切り|薄切り|乱切り|ざく切り|下ごしらえ|包丁)/.test(input)) return "cutting";
  if (/(保存|長持ち|傷む|腐る|保存方法|冷蔵|冷凍|野菜室|しなびる)/.test(input)) return "storage";
  if (/(美味しい|おいしい|食べ方|調理|炒め方|焼き方|煮方|茹で方|レシピ|甘さ|苦くない|うまく作る)/.test(input)) return "cooking";
  return "cooking";
};
export const getVegetableMaster = (key:VegetableKey)=>VEGETABLE_MASTER[key];

export const buildCarouselFromMaster=(m:VegetableMaster,t:TopicType)=>m.topics[t].slides;
export const buildImagePromptsFromMaster=(m:VegetableMaster,t:TopicType)=>m.topics[t].slides.map((s,i)=>[
  `Instagram carousel slide ${i+1}, ${m.topics[t].imagePromptHints[i]}`,
  "vertical 4:5, 1080x1350, ultra realistic, realistic Japanese home kitchen, natural warm light or warm cinematic light, clean composition, clear main subject, text space, high readability, friendly for Japanese women in their 30s",
  "bold Japanese text, extremely large white text, thick black outline:",
  ...s.body.split("\n").map(x=>`「${x}」`)
].join("\n"));
export const buildCaptionFromMaster=(m:VegetableMaster,t:TopicType)=>m.topics[t].caption.join("\n\n");
export const validateDraftConsistency=(m:VegetableMaster,t:TopicType,slides:Slide[],prompts:string[])=>{
  const banned=[...m.bannedCommonPhrases,...(m.topics[t].bannedPhrases||[])];
  const text=slides.map(s=>s.body).join("\n")+"\n"+prompts.join("\n");
  if (banned.some(b=>text.includes(b))) throw new Error(`banned phrase detected: ${m.key}`);
};
