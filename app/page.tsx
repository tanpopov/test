"use client";

import { useEffect, useMemo, useState } from "react";
import { GeneratedDraft, Product, ThemeInput } from "@/lib/types";

const PRODUCTS_KEY = "insta_aff_products_v2";
const THEME_KEY = "insta_aff_theme_v1";
const PR_LABEL = "※アフィリエイト広告を利用しています";

const initialTheme: ThemeInput = {
  theme: "",
  target: "30代女性",
  postGoal: "保存される投稿にしたい",
  tone: "中学生でもわかる、やさしい言葉",
};

const emptyProduct: Product = { id: "", name: "", genre: "", concern: "", affiliateUrl: "", memo: "" };

function generateDraft(themeInput: ThemeInput, products: Product[]): GeneratedDraft {
  const theme = themeInput.theme || "野菜をムダなくおいしく使うコツ";
  const target = themeInput.target || "料理に忙しい30代女性";
  const picked = products[0] ?? null;

  const carousel = [
    { title: "1枚目：フック", body: `${theme}、なんとなくでやっていませんか？` },
    { title: "2枚目：よくある失敗", body: `${target}がやりがちなのは、自己流で保存や下ごしらえをしてしまうこと。` },
    { title: "3枚目：原因", body: "原因は、手順がむずかしそうに見えて後回しになることです。" },
    { title: "4枚目：解決策", body: "手順を3つに分ければ簡単。切る→保存する→使うの順で考えるだけ。" },
    { title: "5枚目：保存CTA＋商品導線", body: `この投稿を保存して次の買い物前に見返してね。${picked ? `使いやすい${picked.name}は最後に紹介します。` : "使いやすい調理アイテムは最後に紹介します。"}` },
  ];

  const imagePrompts = carousel.map(
    (slide, i) =>
      `Instagram carousel slide ${i + 1}, Japanese home kitchen, fresh vegetables, ${slide.title}, ${slide.body}, soft natural light, clean composition, readable typography space`,
  );

  const cta = "続きはプロフィールのリンクから、使いやすいアイテムをチェックしてください。";

  const caption = [
    `${theme}について、やさしく5枚でまとめました。`,
    "まずは毎日の料理の悩みを軽くすることを大事にしています。",
    "むずかしいテクニックではなく、今日からできる方法だけを紹介しています。",
    "よかったら保存して、調理前に見返してください。",
    picked ? `最後に、同じ悩みに合いやすい「${picked.name}」も紹介しています。` : "最後に、関連アイテムも紹介しています。",
    PR_LABEL,
    "#野菜レシピ #時短ごはん #自炊 #料理初心者",
  ].join("\n\n");

  return { carousel, imagePrompts, caption, cta, affiliateLink: picked, prLabel: PR_LABEL };
}

export default function Page() {
  const [themeInput, setThemeInput] = useState<ThemeInput>(initialTheme);
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<GeneratedDraft | null>(null);
  const [productForm, setProductForm] = useState<Product>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const productText = localStorage.getItem(PRODUCTS_KEY);
    const themeText = localStorage.getItem(THEME_KEY);
    if (productText) setProducts(JSON.parse(productText));
    if (themeText) setThemeInput(JSON.parse(themeText));
  }, []);

  useEffect(() => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(THEME_KEY, JSON.stringify(themeInput)), [themeInput]);

  const canGenerate = useMemo(() => themeInput.theme.trim().length > 0, [themeInput.theme]);

  const handleSaveProduct = () => {
    if (!productForm.name.trim()) return;
    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? { ...productForm, id: editingId } : p)));
      setEditingId(null);
    } else {
      setProducts([...products, { ...productForm, id: crypto.randomUUID() }]);
    }
    setProductForm(emptyProduct);
  };

  const carouselText = draft?.carousel.map((s) => `${s.title}\n${s.body}`).join("\n\n") ?? "";
  const promptText = draft?.imagePrompts.join("\n") ?? "";
  const allText = draft
    ? `【カルーセル5枚構成】\n${carouselText}\n\n【画像生成プロンプト】\n${promptText}\n\n【Instagramキャプション】\n${draft.caption}\n\n【CTA】\n${draft.cta}\n\n【使用するアフィリエイトリンク】\n${draft.affiliateLink ? `${draft.affiliateLink.name}: ${draft.affiliateLink.affiliateUrl}` : "未選択"}\n\n【PR表記】\n${draft.prLabel}`
    : "";

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-3 pb-16 sm:p-6">
      <h1 className="text-2xl font-bold">Instagramアフィリエイト投稿メーカー</h1>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">1. 投稿テーマ入力</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded-lg border p-3" placeholder="投稿テーマ" value={themeInput.theme} onChange={(e) => setThemeInput({ ...themeInput, theme: e.target.value })} />
          <input className="rounded-lg border p-3" placeholder="ターゲット" value={themeInput.target} onChange={(e) => setThemeInput({ ...themeInput, target: e.target.value })} />
          <input className="rounded-lg border p-3" placeholder="投稿ゴール" value={themeInput.postGoal} onChange={(e) => setThemeInput({ ...themeInput, postGoal: e.target.value })} />
          <input className="rounded-lg border p-3" placeholder="文体トーン" value={themeInput.tone} onChange={(e) => setThemeInput({ ...themeInput, tone: e.target.value })} />
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">2. アフィリエイト商品登録</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded-lg border p-3" placeholder="商品名" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          <input className="rounded-lg border p-3" placeholder="ジャンル" value={productForm.genre} onChange={(e) => setProductForm({ ...productForm, genre: e.target.value })} />
          <input className="rounded-lg border p-3" placeholder="悩み" value={productForm.concern} onChange={(e) => setProductForm({ ...productForm, concern: e.target.value })} />
          <input className="rounded-lg border p-3" placeholder="アフィリエイトURL" value={productForm.affiliateUrl} onChange={(e) => setProductForm({ ...productForm, affiliateUrl: e.target.value })} />
          <textarea className="rounded-lg border p-3 sm:col-span-2" placeholder="メモ" value={productForm.memo} onChange={(e) => setProductForm({ ...productForm, memo: e.target.value })} />
        </div>
        <button className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-3 text-white sm:w-auto" onClick={handleSaveProduct}>{editingId ? "商品を更新" : "商品を追加"}</button>

        <ul className="mt-4 space-y-2">
          {products.map((p) => (
            <li key={p.id} className="rounded-lg border p-3 text-sm">
              <p className="font-semibold">{p.name}</p>
              <p>ジャンル: {p.genre}</p>
              <p>悩み: {p.concern}</p>
              <p className="break-all">URL: {p.affiliateUrl}</p>
              <p className="text-slate-600">メモ: {p.memo || "-"}</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded bg-slate-800 px-3 py-2 text-white" onClick={() => { setEditingId(p.id); setProductForm(p); }}>編集</button>
                <button className="rounded bg-rose-600 px-3 py-2 text-white" onClick={() => { if (window.confirm("この商品を削除しますか？")) setProducts(products.filter((x) => x.id !== p.id)); }}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">3. 投稿案生成</h2>
        <button disabled={!canGenerate} className="rounded-lg bg-slate-900 px-4 py-3 text-white disabled:opacity-40" onClick={() => setDraft(generateDraft(themeInput, products))}>投稿案を生成する</button>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">4. 完成投稿コピー</h2>
        {draft ? <div className="space-y-4 text-sm">
          <div><h3 className="font-semibold">カルーセル5枚構成</h3>{draft.carousel.map((s) => <p key={s.title} className="mt-1"><strong>{s.title}</strong> {s.body}</p>)}</div>
          <div><h3 className="font-semibold">各スライドの画像生成プロンプト</h3><pre className="overflow-x-auto rounded border bg-slate-50 p-2">{promptText}</pre></div>
          <div><h3 className="font-semibold">Instagramキャプション</h3><pre className="whitespace-pre-wrap rounded border bg-slate-50 p-2">{draft.caption}</pre></div>
          <div><h3 className="font-semibold">CTA</h3><p>{draft.cta}</p></div>
          <div><h3 className="font-semibold">使用するアフィリエイトリンク</h3><p className="break-all">{draft.affiliateLink ? `${draft.affiliateLink.name}: ${draft.affiliateLink.affiliateUrl}` : "未選択"}</p></div>
          <div><h3 className="font-semibold">PR表記</h3><p>{draft.prLabel}</p></div>
          <div className="grid gap-2 sm:grid-cols-2">
            <button className="rounded bg-emerald-700 px-3 py-2 text-white" onClick={() => navigator.clipboard.writeText(carouselText)}>カルーセル文字だけコピー</button>
            <button className="rounded bg-emerald-700 px-3 py-2 text-white" onClick={() => navigator.clipboard.writeText(promptText)}>画像生成プロンプトだけコピー</button>
            <button className="rounded bg-emerald-700 px-3 py-2 text-white" onClick={() => navigator.clipboard.writeText(draft.caption)}>キャプションだけコピー</button>
            <button className="rounded bg-emerald-700 px-3 py-2 text-white" onClick={() => navigator.clipboard.writeText(allText)}>全部まとめてコピー</button>
          </div>
        </div> : <p className="text-sm text-slate-500">先に投稿案を生成してください。</p>}
      </section>
    </main>
  );
}
