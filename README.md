# Instagramアフィリエイト投稿メーカー（最小版）

Next.js + TypeScript + Tailwind CSS で作成した、野菜・料理系Instagram投稿の下書き作成ツールです。

## できること
- 投稿テーマ入力
- アフィリエイト商品登録（localStorage保存）
- 投稿案生成（カルーセル構成 / 画像生成プロンプト / キャプション / CTA / リンク候補）
- 完成文のコピー

## ローカル開発
```bash
npm install
npm run dev
```

## Vercelデプロイ
このリポジトリは `package.json` の `next/react/react-dom` 構成を含んでおり、Vercelの標準的なNext.jsデプロイ対象です。

- Framework Preset: Next.js（自動検出）
- Build Command: `next build`（デフォルト）
- Output: `.next`（デフォルト）

特別な `vercel.json` は不要です。


## Node.js要件
- Next.js 16系のため Node.js 20.9+ を推奨（Vercelは通常自動で満たします）。
