# NIグループHP 提案デモ

NIグループ（New Innovation Holdings）公式サイトの**見た目格上げ提案デモ**。
「夜明け」構成のシネマティックな1枚ページ。詳細は `HANDOVER.md` / `ARCHITECTURE.md` 参照。

## 見る
- 公開URL（限定・検索よけ済み）: https://xkx0xux.github.io/ni-group-hp/
- ローカル:
  ```bash
  cd ~/NIグループHP
  python3 -m http.server 5510 --bind 127.0.0.1
  # → http://127.0.0.1:5510/
  ```
  ※file://直開きだと動き（GSAP等CDN）は動くがPlaywright検品ができないためサーバー推奨。

## 開発
- 生のHTML/CSS/JS。ビルド不要。`index.html`・`assets/css/styles.css`・`assets/js/main.js` を直接編集。
- 検品: Playwrightで PC 1440×900 / スマホ 390×844 のスクショ確認（CLAUDE.md参照）。

## デプロイ
```bash
git push   # mainへpushすれば GitHub Pages が自動反映（数十秒〜1分）
```

## 環境変数・秘密情報
なし（完全静的・APIキー不使用）。

## 注意
- noindex維持（本採用まで検索に載せない）
- 未確認の数字・情報を載せない（HANDOVER参照）
