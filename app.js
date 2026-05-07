const PRODUCTS_KEY = "insta_aff_products_v2";
const THEME_KEY = "insta_aff_theme_v1";
const PR_LABEL = "※アフィリエイト広告を利用しています";

const $ = (id) => document.getElementById(id);
const isHttps = (u) => u.trim().startsWith("https://");
const short = (t, max = 9) => t.trim().slice(0, max);

let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
let editingId = null;

const form = { theme: $("theme"), name: $("name"), genre: $("genre"), concern: $("concern"), url: $("url"), memo: $("memo") };
form.theme.value = localStorage.getItem(THEME_KEY) || "";

const renderProducts = () => {
  const root = $("productList");
  root.innerHTML = "";
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "slide";
    item.innerHTML = `
      <strong>${p.name}</strong>
      <div class="small">ジャンル: ${p.genre || "-"}</div>
      <div class="small">悩み: ${p.concern || "-"}</div>
      <div class="small">URL</div>
      <div class="mono break">${p.url || "-"}</div>
      ${p.url && !isHttps(p.url) ? '<div class="warn">⚠️ https:// から始まっていません</div>' : ""}
      <div class="actions" style="margin-top:6px"><button class="btn sub edit">編集</button><button class="btn danger del">削除</button></div>`;
    item.querySelector(".edit").onclick = () => {
      editingId = p.id;
      Object.assign(form, form);
      form.name.value = p.name; form.genre.value = p.genre; form.concern.value = p.concern; form.url.value = p.url; form.memo.value = p.memo;
      $("saveProduct").textContent = "商品を更新";
    };
    item.querySelector(".del").onclick = () => {
      if (!window.confirm("この商品を削除しますか？")) return;
      products = products.filter((x) => x.id !== p.id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      renderProducts();
    };
    root.appendChild(item);
  });
};

$("url").addEventListener("input", () => {
  $("urlWarn").hidden = !form.url.value.trim() || isHttps(form.url.value);
});

$("saveProduct").onclick = () => {
  if (!form.name.value.trim()) return;
  const item = { id: editingId || crypto.randomUUID(), name: form.name.value.trim(), genre: form.genre.value.trim(), concern: form.concern.value.trim(), url: form.url.value.trim(), memo: form.memo.value.trim() };
  if (editingId) products = products.map((p) => p.id === editingId ? item : p); else products.push(item);
  editingId = null;
  [form.name, form.genre, form.concern, form.url, form.memo].forEach((x) => x.value = "");
  $("urlWarn").hidden = true; $("saveProduct").textContent = "商品を追加";
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  renderProducts();
};

const draft = () => {
  const theme = form.theme.value.trim() || "野菜保存";
  localStorage.setItem(THEME_KEY, theme);
  const p = products[0] || null;
  const slides = [
    { title: "1枚目：フック", body: `袋のまま危険\n${short(theme)}NG` },
    { title: "2枚目：よくある失敗", body: "その保存NG\n腐りやすい" },
    { title: "3枚目：原因", body: "水分と熱\n傷みが加速" },
    { title: "4枚目：解決策", body: "切って乾かす\n小分け保存" },
    { title: "5枚目：保存CTA＋商品導線", body: p ? `まず保存してね\n最後に${p.name}紹介` : "まず保存してね\n道具を紹介" },
  ];
  const prompts = slides.map((s, i) => `Instagram carousel slide ${i + 1}\nbold Japanese text:\n${s.body.split("\n").map((x) => `「${x}」`).join("\n")}`);
  const caption = `${theme}で失敗しないコツを5枚で。\n悩み解決を先に、商品紹介は最後に。\n${PR_LABEL}`;
  return { slides, prompts, caption, cta: "プロフィールリンクもチェックしてください。", link: p };
};

$("gen").onclick = () => {
  const d = draft();
  const root = $("result");
  const carouselText = d.slides.map((s) => `${s.title}\n${s.body}`).join("\n\n");
  const promptsText = d.prompts.join("\n\n");
  const all = `${carouselText}\n\n${promptsText}\n\n${d.caption}`;
  root.innerHTML = `
  <div class="slide"><strong>カルーセル構成</strong>${d.slides.map((s) => `<div class="small" style="white-space:pre-line;margin-top:6px"><b>${s.title}</b>\n${s.body}</div>`).join("")}</div>
  <div class="slide"><strong>画像生成プロンプト</strong>${d.prompts.map((p, i) => `<div class="slide"><div class="actions" style="justify-content:space-between"><b>${i + 1}枚目の画像プロンプト</b><button class="btn sub cp" data-t="${encodeURIComponent(p)}">コピー</button></div><pre class="small break" style="white-space:pre-wrap">${p}</pre></div>`).join("")}</div>
  <div class="slide"><strong>キャプション</strong><pre class="small" style="white-space:pre-wrap">${d.caption}</pre></div>
  <div class="slide"><strong>CTA</strong><div class="small">${d.cta}</div></div>
  <div class="slide"><strong>リンク</strong>${d.link ? `<div class="small">商品名: ${d.link.name}</div><div class="mono break">${d.link.url}</div>${d.link.url && !isHttps(d.link.url) ? '<div class="warn">⚠️ https:// から始まっていません</div>' : ""}` : '<div class="small">未選択</div>'}</div>
  <div class="slide"><strong>PR表記</strong><div class="small">${PR_LABEL}</div></div>
  <div class="actions"><button class="btn sub" id="copyCarousel">カルーセル文字だけコピー</button><button class="btn sub" id="copyPrompts">画像生成プロンプトだけコピー</button><button class="btn sub" id="copyCaption">キャプションだけコピー</button><button class="btn sub" id="copyAll">全部まとめてコピー</button></div>`;
  root.querySelectorAll(".cp").forEach((b) => b.onclick = () => navigator.clipboard.writeText(decodeURIComponent(b.dataset.t)));
  $("copyCarousel").onclick = () => navigator.clipboard.writeText(carouselText);
  $("copyPrompts").onclick = () => navigator.clipboard.writeText(promptsText);
  $("copyCaption").onclick = () => navigator.clipboard.writeText(d.caption);
  $("copyAll").onclick = () => navigator.clipboard.writeText(all);
};

renderProducts();
