# Instagramアフィリエイト投稿メーカー（最小版）

Next.js + TypeScript + Tailwind CSS で作成した、野菜・料理系Instagram投稿の下書き作成ツールです。

## できること
- 投稿テーマ入力
- アフィリエイト商品登録（一覧 / 編集 / 削除 / localStorage保存）
- URLが `https://` で始まらない場合の警告表示
- 投稿案生成（5枚カルーセル / 画像生成プロンプト / キャプション / CTA / リンク候補 / PR表記）
- 画像生成プロンプトを1枚ずつ表示 + 各プロンプトの個別コピー
- 完成文コピー（カルーセル / プロンプト / キャプション / 全文）

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
