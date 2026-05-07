"use client";

import { useEffect, useMemo, useState } from "react";
import { GeneratedDraft, Product, ThemeInput } from "@/lib/types";

const PRODUCTS_KEY = "insta_aff_products_v1";
const THEME_KEY = "insta_aff_theme_v1";

const initialTheme: ThemeInput = {
  theme: "",
  target: "",
  postGoal: "保存される投稿にしたい",
  tone: "やさしく親しみやすい",
};

function generateDraft(themeInput: ThemeInput, products: Product[]): GeneratedDraft {
  const t = themeInput.theme || "野菜をおいしく食べるコツ";
  const target = themeInput.target || "料理初心者";

  const carousel = [
    `1枚目: ${t}で損してる人が多い`,
    `2枚目: ${target}がやりがちな失敗3つ`,
    "3枚目: 正しい手順を画像で解説",
    "4枚目: 時短できるコツ",
    "5枚目: まとめ（保存推奨）",
  ];

  const imagePrompts = carousel.map(
    (slide, i) =>
      `Japanese home kitchen, fresh vegetables, instagram carousel slide ${i + 1}, ${slide}, natural light, clean composition, high detail`,
  );

  const caption = `${t}をわかりやすくまとめました🥕\n\n${target}でも今日から実践できる内容です。\n保存して買い物前・調理前に見返してください！\n\n#野菜レシピ #料理初心者 #時短ごはん #自炊`;

  const cta = "気になったアイテムはプロフィールのリンクからチェック👇";

  const linkCandidates = products.slice(0, 3);

  return { carousel, imagePrompts, caption, cta, linkCandidates };
}

export default function Page() {
  const [themeInput, setThemeInput] = useState<ThemeInput>(initialTheme);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<GeneratedDraft | null>(null);

  useEffect(() => {
    const productText = localStorage.getItem(PRODUCTS_KEY);
    const themeText = localStorage.getItem(THEME_KEY);
    if (productText) setProducts(JSON.parse(productText));
    if (themeText) setThemeInput(JSON.parse(themeText));
  }, []);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(themeInput));
  }, [themeInput]);

  const [productForm, setProductForm] = useState<Product>({
    id: "",
    name: "",
    category: "",
    appeal: "",
    affiliateUrl: "",
  });

  const canGenerate = useMemo(() => themeInput.theme.trim().length > 0, [themeInput.theme]);

  return (
    <main className="mx-auto max-w-4xl p-4 pb-16 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold">Instagramアフィリエイト投稿メーカー（最小版）</h1>
      <p className="mb-6 text-sm text-slate-600">4ステップで投稿下書きを作成し、最後にまとめてコピーできます。</p>

      <section className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">1. 投稿テーマ入力</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-lg border p-2" placeholder="投稿テーマ（例：ブロッコリーの冷凍保存）" value={themeInput.theme} onChange={(e) => setThemeInput({ ...themeInput, theme: e.target.value })} />
          <input className="rounded-lg border p-2" placeholder="ターゲット（例：一人暮らしの社会人）" value={themeInput.target} onChange={(e) => setThemeInput({ ...themeInput, target: e.target.value })} />
          <input className="rounded-lg border p-2" placeholder="投稿ゴール" value={themeInput.postGoal} onChange={(e) => setThemeInput({ ...themeInput, postGoal: e.target.value })} />
          <input className="rounded-lg border p-2" placeholder="文体トーン" value={themeInput.tone} onChange={(e) => setThemeInput({ ...themeInput, tone: e.target.value })} />
        </div>
      </section>

      <section className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">2. アフィリエイト商品登録</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded-lg border p-2" placeholder="商品名" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          <input className="rounded-lg border p-2" placeholder="カテゴリ" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
          <input className="rounded-lg border p-2" placeholder="訴求ポイント" value={productForm.appeal} onChange={(e) => setProductForm({ ...productForm, appeal: e.target.value })} />
          <input className="rounded-lg border p-2" placeholder="アフィリエイトURL" value={productForm.affiliateUrl} onChange={(e) => setProductForm({ ...productForm, affiliateUrl: e.target.value })} />
        </div>
        <button
          className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-white"
          onClick={() => {
            if (!productForm.name.trim()) return;
            setProducts([...products, { ...productForm, id: crypto.randomUUID() }]);
            setProductForm({ id: "", name: "", category: "", appeal: "", affiliateUrl: "" });
          }}
        >
          商品を追加
        </button>
        <ul className="mt-3 space-y-2 text-sm">
          {products.map((p) => (
            <li key={p.id} className="rounded border p-2">
              <div className="font-medium">{p.name}</div>
              <div className="text-slate-600">{p.category} / {p.appeal}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">3. 投稿案生成</h2>
        <button
          disabled={!canGenerate}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-40"
          onClick={() => setDraft(generateDraft(themeInput, products))}
        >
          投稿案を生成する
        </button>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">4. 完成投稿コピー</h2>
        {draft ? (
          <div className="space-y-3">
            <textarea className="h-72 w-full rounded border p-3 text-sm" readOnly value={`【カルーセル構成】\n${draft.carousel.join("\n")}\n\n【画像生成プロンプト】\n${draft.imagePrompts.join("\n")}\n\n【キャプション】\n${draft.caption}\n\n【CTA】\n${draft.cta}\n\n【アフィリエイトリンク候補】\n${draft.linkCandidates.map((p) => `- ${p.name}: ${p.affiliateUrl}`).join("\n") || "- 候補なし"}`} />
            <button
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
              onClick={() => navigator.clipboard.writeText(`【カルーセル構成】\n${draft.carousel.join("\n")}\n\n【画像生成プロンプト】\n${draft.imagePrompts.join("\n")}\n\n【キャプション】\n${draft.caption}\n\n【CTA】\n${draft.cta}\n\n【アフィリエイトリンク候補】\n${draft.linkCandidates.map((p) => `- ${p.name}: ${p.affiliateUrl}`).join("\n") || "- 候補なし"}`)}
            >
              全文をコピー
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">先に「投稿案を生成する」を押してください。</p>
        )}
      </section>
    </main>
  );
}
