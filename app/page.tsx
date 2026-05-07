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

const isHttpsUrl = (url: string) => url.trim().startsWith("https://");

function generateDraft(themeInput: ThemeInput, products: Product[]): GeneratedDraft {
  const rawTheme = themeInput.theme.trim();
  const picked = products[0] ?? null;

  const vegetableMatch = rawTheme.match(/(キャベツ|白菜|レタス|ほうれん草|小松菜|にんじん|人参|玉ねぎ|たまねぎ|じゃがいも|ピーマン|きゅうり|トマト|なす|大根|ブロッコリー|ねぎ|長ねぎ|もやし)/);
  const vegetable = vegetableMatch?.[0] || "野菜";

  const has = {
    save: /(保存|冷蔵|冷凍|袋)/.test(rawTheme),
    cut: /(切る|切り方|薄切り|千切り|ざく切り|繊維|包丁)/.test(rawTheme),
    heat: /(加熱|炒める|焼く|茹でる|蒸す|レンジ|火)/.test(rawTheme),
    select: /(選び方|見分け|新鮮|買い方)/.test(rawTheme),
    taste: /(甘く|おいしく|味|うまみ|食感)/.test(rawTheme),
    rot: /(傷み|腐る|悪くなる)/.test(rawTheme),
    quick: /(時短|すぐ|簡単)/.test(rawTheme),
  };

  const category = has.save
    ? "保存"
    : has.cut
      ? "切り方"
      : has.heat
        ? "加熱"
        : has.select
          ? "選び方"
          : has.taste
            ? "味を良くする"
            : has.rot
              ? "傷み対策"
              : has.quick
                ? "時短"
                : "味を良くする";

  const action = has.cut ? "切る" : has.heat ? "加熱する" : has.save ? "保存する" : has.select ? "選ぶ" : "調理する";
  const purpose = /甘く/.test(rawTheme)
    ? "甘くする"
    : has.taste
      ? "味を良くする"
      : has.save
        ? "長持ちさせる"
        : has.quick
          ? "時短にする"
          : "おいしくする";
  const worry = has.cut && /甘く/.test(rawTheme)
    ? "切り方で味が変わる"
    : has.save
      ? `${vegetable}の保存で傷みやすい`
      : `${vegetable}の扱い方で仕上がりが変わる`;

  const intent = { vegetable, action, purpose, worry, category };

  let carousel;
  if (intent.category === "切り方" && /甘く/.test(rawTheme)) {
    carousel = [
      { title: "1枚目：フック", body: `${vegetable}
切り方で甘い` },
      { title: "2枚目：よくある失敗", body: "細く切るほど
火が通りやすい" },
      { title: "3枚目：原因", body: "繊維を断つと
食感がやわらぐ" },
      { title: "4枚目：解決策", body: "芯は薄切り
葉はざく切り" },
      { title: "5枚目：保存CTA＋商品導線", body: picked ? `あとで保存
切り方で変わる` : `あとで保存
切り方で変わる` },
    ];
  } else if (intent.category === "保存" || intent.category === "傷み対策") {
    carousel = [
      { title: "1枚目：フック", body: `${vegetable}
傷みやすい理由` },
      { title: "2枚目：よくある失敗", body: "その保存NG
劣化が早い" },
      { title: "3枚目：原因", body: "水分と温度差で
傷みが進む" },
      { title: "4枚目：解決策", body: "乾かして小分け
冷蔵を一定に" },
      { title: "5枚目：保存CTA＋商品導線", body: `${vegetable}対策を保存
最後に道具を紹介` },
    ];
  } else {
    carousel = [
      { title: "1枚目：フック", body: `${vegetable}
${intent.purpose}` },
      { title: "2枚目：よくある失敗", body: `${intent.action}方しだいで
仕上がりが変わる` },
      { title: "3枚目：原因", body: `${intent.worry}
小さな差が出る` },
      { title: "4枚目：解決策", body: "手順をそろえる
食感をそろえる" },
      { title: "5枚目：保存CTA＋商品導線", body: `あとで保存
${intent.purpose}` },
    ];
  }

  const visualHint = intent.category === "切り方"
    ? `${vegetable}断面, kitchen knife, cutting board, slicing technique`
    : intent.category === "保存" || intent.category === "傷み対策"
      ? `${vegetable}, storage container, refrigerator, freshness care`
      : `${vegetable}, Japanese home kitchen, cooking process`;

  const imagePrompts = carousel.map((slide, i) => {
    const slideTexts = slide.body.split("\n").map((line) => `「${line}」`).join("\n");
    return [
      `Instagram carousel slide ${i + 1}, ${visualHint}, realistic ${vegetable}, natural light, clean composition`,
      `bold Japanese text:`,
      slideTexts,
      `high readability, vertical 4:5, typography space, friendly for Japanese women in their 30s`,
    ].join("\n");
  });

  const cta = picked ? `${vegetable}の${intent.category}で使いやすかった「${picked.name}」はプロフィールリンクから見られます。` : `${vegetable}の${intent.category}のコツを、まず保存して見返してください。`;
  const caption = [
    `${vegetable}の「${intent.category}」を5枚で短くまとめました。`,
    `悩み: ${intent.worry}`,
    `行動: ${intent.action} / 目的: ${intent.purpose}`,
    picked ? `最後に、使いやすかった「${picked.name}」を自然に紹介しています。` : "最後に、関連アイテムも紹介しています。",
    PR_LABEL,
    `#${vegetable} #料理のコツ #時短ごはん #自炊`,
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
  const promptText = draft?.imagePrompts.join("\n\n") ?? "";
  const allText = draft
    ? `【カルーセル5枚構成】\n${carouselText}\n\n【画像生成プロンプト】\n${promptText}\n\n【Instagramキャプション】\n${draft.caption}\n\n【CTA】\n${draft.cta}\n\n【使用するアフィリエイトリンク】\n${draft.affiliateLink ? `${draft.affiliateLink.name}\n${draft.affiliateLink.affiliateUrl}` : "未選択"}\n\n【PR表記】\n${draft.prLabel}`
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
          <div>
            <input className="w-full rounded-lg border p-3" placeholder="アフィリエイトURL" value={productForm.affiliateUrl} onChange={(e) => setProductForm({ ...productForm, affiliateUrl: e.target.value })} />
            {productForm.affiliateUrl.trim() && !isHttpsUrl(productForm.affiliateUrl) ? (
              <p className="mt-1 text-xs text-amber-600">URLは https:// から始めてください。</p>
            ) : null}
          </div>
          <textarea className="rounded-lg border p-3 sm:col-span-2" placeholder="メモ" value={productForm.memo} onChange={(e) => setProductForm({ ...productForm, memo: e.target.value })} />
        </div>
        <button className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-3 text-white sm:w-auto" onClick={handleSaveProduct}>{editingId ? "商品を更新" : "商品を追加"}</button>

        <ul className="mt-4 space-y-2">
          {products.map((p) => (
            <li key={p.id} className="rounded-lg border p-3 text-sm">
              <p className="font-semibold">{p.name}</p>
              <p>ジャンル: {p.genre}</p>
              <p>悩み: {p.concern}</p>
              <p className="mt-1 text-xs text-slate-500">URL</p>
              <p className="break-words text-slate-700">{p.affiliateUrl || "-"}</p>
              {p.affiliateUrl.trim() && !isHttpsUrl(p.affiliateUrl) ? <p className="mt-1 text-xs text-amber-600">⚠️ https:// から始まっていません</p> : null}
              <p className="mt-1 text-slate-600">メモ: {p.memo || "-"}</p>
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
          <div className="rounded-lg border bg-slate-50 p-3"><h3 className="font-semibold">カルーセル5枚構成</h3>{draft.carousel.map((s) => (<div key={s.title} className="mt-2 whitespace-pre-line"><p className="font-semibold">{s.title}</p><p>{s.body}</p></div>))}</div>
          <div className="rounded-lg border bg-slate-50 p-3">
            <h3 className="font-semibold">画像生成プロンプト</h3>
            <div className="mt-2 space-y-3">
              {draft.imagePrompts.map((prompt, i) => (
                <div key={`prompt-${i}`} className="rounded border bg-white p-2">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="font-medium">{i + 1}枚目の画像プロンプト</p>
                    <button className="rounded bg-emerald-700 px-2 py-1 text-xs text-white" onClick={() => navigator.clipboard.writeText(prompt)}>このプロンプトをコピー</button>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-xs">{prompt}</pre>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-slate-50 p-3"><h3 className="font-semibold">Instagramキャプション</h3><pre className="mt-2 whitespace-pre-wrap break-words rounded border bg-white p-2">{draft.caption}</pre></div>
          <div className="rounded-lg border bg-slate-50 p-3"><h3 className="font-semibold">CTA</h3><p className="mt-2">{draft.cta}</p></div>
          <div className="rounded-lg border bg-slate-50 p-3"><h3 className="font-semibold">使用するアフィリエイトリンク</h3>{draft.affiliateLink ? <div className="mt-2"><p className="font-medium">商品名: {draft.affiliateLink.name}</p><p className="mt-1 text-xs text-slate-500">URL</p><p className="break-words text-slate-700">{draft.affiliateLink.affiliateUrl}</p>{draft.affiliateLink.affiliateUrl.trim() && !isHttpsUrl(draft.affiliateLink.affiliateUrl) ? <p className="mt-1 text-xs text-amber-600">⚠️ https:// から始まっていません</p> : null}</div> : <p className="mt-2">未選択</p>}</div>
          <div className="rounded-lg border bg-slate-50 p-3"><h3 className="font-semibold">PR表記</h3><p className="mt-2">{draft.prLabel}</p></div>
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
