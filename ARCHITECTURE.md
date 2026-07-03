# ARCHITECTURE — NIグループHP 提案デモ

## 全体像
完全静的な1枚ページ。サーバー処理・DB・APIなし。GitHub Pagesで配信。

```
ブラウザ ── GitHub Pages（静的配信）
   │
   ├─ index.html   … 全セクションのマークアップ
   ├─ styles.css   … デザイントークン＋全スタイル
   ├─ main.js      … 演出（フォールバック内蔵）
   └─ CDN          … GSAP / ScrollTrigger / Lenis / Google Fonts
```

## ページ構成（「夜明け」物語・上から順）
| # | セクション | 演出 |
|---|---|---|
| 1 | ヒーロー（夜） | 星空JS生成・紫グロー呼吸・光るNIモノグラム・mask-line見出し・5社マーキー・視差 |
| 2 | ステートメント（夜明け） | ScrollTriggerピン留め+160%。単語が順に灯る→深紫→薄紫→白へ明転。ヘッダーテーマ連動(0.72) |
| 3 | 数字 | IntersectionObserverでカウントアップ（5/5/1/全員） |
| 4 | 事業5社ベントー | GSAP stagger出現・ホバー浮き＋紫キーライン |
| 5 | CEOメッセージ | sticky写真枠（紫プレースホルダー）・ゆっくり寄る |
| 6 | 選ばれる理由 | reveal 3枚 |
| 7 | ニュース | 実3件・行ホバー |
| 8 | CTA（夕） | 紫オーロラアニメ＋視差・mailto |
| 9 | フッター | 濃色・5社リンク |

## CSS構造（styles.css）
1. `:root` デザイントークン（昼色・夜色・紫・フォント・影・ease）
2. リセット→ベース→ユーティリティ（.eyebrow/.text-dawn/.btn系）
3. ヘッダー（`.on-night`で夜テーマ切替）
4. ヒーロー→ステートメント→各セクション→フッターの順
5. レスポンシブ（1024/768）→ reduced-motion

## JS構造（main.js・即時関数1本）
1. ヘッダー影＋非シネマ時の夜昼フォールバック切替
2. モバイルnav開閉
3. 星空生成（`#heroStars`にi要素、PC64/SP34個）
4. `.reveal` IntersectionObserver（GSAP無しでも成立する土台）
5. `[data-count]` カウントアップ
6. **シネマ層**（gsap&ScrollTriggerあり＆motion OKのときだけ）：Lenis慣性＋アンカー、ヒーロー視差、夜明けタイムライン、カードstagger、CEOズーム、CTAオーロラ視差

### フォールバック設計（重要）
CSSの基本状態＝**演出後の完成形**。シネマ層が「夜に巻き戻してから」演出する。
→ CDN不通・reduced-motion・古いブラウザでも壊れず静的に全文表示。

## データフロー
なし（静的）。お問い合わせは `mailto:innovation1017@new2023.jp`。

## 既知の技術ノート
- SVG縦線パス（bbox幅0）に objectBoundingBox のグラデ/filterは描画されない → `userSpaceOnUse`＋明示領域で指定（モノグラムのI・favicon・グロー全て対応済み）
- `background-clip:text`＋`filter:drop-shadow` は四角い影が出る（使用禁止）
- robots.txt はプロジェクトPagesでは無効。検索よけの実体は `<meta name="robots" content="noindex,nofollow">`
