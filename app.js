const STORAGE_KEY = "veggie_instagram_posts_v1";

const form = document.getElementById("postForm");
const clearBtn = document.getElementById("clearBtn");
const tableBody = document.getElementById("tableBody");
const filterVegetable = document.getElementById("filterVegetable");
const filterPostType = document.getElementById("filterPostType");
const sortViews = document.getElementById("sortViews");

const getInput = (id) => document.getElementById(id);

const loadPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const savePosts = (posts) => localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));

const formatNum = (n) => (Number.isFinite(n) ? n.toLocaleString("ja-JP") : "-");

const render = () => {
  const posts = loadPosts();
  const vegFilter = filterVegetable.value.trim().toLowerCase();
  const typeFilter = filterPostType.value;
  const sort = sortViews.value;

  const filtered = posts
    .filter((p) => !vegFilter || p.vegetable.toLowerCase().includes(vegFilter))
    .filter((p) => !typeFilter || p.postType === typeFilter)
    .sort((a, b) => sort === "asc" ? a.views - b.views : b.views - a.views);

  tableBody.innerHTML = "";

  if (!filtered.length) {
    tableBody.innerHTML = `<tr><td colspan="6">データがありません。</td></tr>`;
    return;
  }

  filtered.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <a href="${p.url}" target="_blank" rel="noopener noreferrer">投稿を開く</a><br>
        <span class="small">@${p.accountName}</span>
      </td>
      <td>
        <strong>${p.theme}</strong><br>
        <span class="small">野菜: ${p.vegetable}</span><br>
        <span class="small">型: ${p.postType}</span>
      </td>
      <td>
        再生: ${formatNum(p.views)}<br>
        いいね: ${formatNum(p.likes)}<br>
        コメント: ${formatNum(p.comments)}
      </td>
      <td>
        <strong>フック:</strong> ${p.hook}<br>
        <strong>分析:</strong> ${p.whyViral || "-"}
      </td>
      <td>
        <strong>似た投稿案:</strong> ${p.myIdea || "-"}<br>
        <strong>フック案:</strong><br>
        ① ${p.myHook1 || "-"}<br>
        ② ${p.myHook2 || "-"}<br>
        ③ ${p.myHook3 || "-"}<br>
        <strong>画像プロンプト:</strong> ${p.imagePrompt || "-"}
      </td>
      <td><button class="delete" data-id="${p.id}">削除</button></td>
    `;
    tableBody.appendChild(tr);
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const posts = loadPosts();

  const post = {
    id: crypto.randomUUID(),
    url: getInput("url").value.trim(),
    accountName: getInput("accountName").value.trim(),
    theme: getInput("theme").value.trim(),
    vegetable: getInput("vegetable").value.trim(),
    views: Number(getInput("views").value || 0),
    likes: Number(getInput("likes").value || 0),
    comments: Number(getInput("comments").value || 0),
    hook: getInput("hook").value.trim(),
    postType: getInput("postType").value,
    whyViral: getInput("whyViral").value.trim(),
    myIdea: getInput("myIdea").value.trim(),
    myHook1: getInput("myHook1").value.trim(),
    myHook2: getInput("myHook2").value.trim(),
    myHook3: getInput("myHook3").value.trim(),
    imagePrompt: getInput("imagePrompt").value.trim(),
    createdAt: new Date().toISOString(),
  };

  posts.push(post);
  savePosts(posts);
  form.reset();
  render();
});

clearBtn.addEventListener("click", () => form.reset());

tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button.delete");
  if (!btn) return;
  const id = btn.dataset.id;
  const next = loadPosts().filter((p) => p.id !== id);
  savePosts(next);
  render();
});

[filterVegetable, filterPostType, sortViews].forEach((el) => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

render();
