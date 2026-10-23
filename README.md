# 蛋仔守城

依照 [第一版規格](docs/game-v1-spec.md) 實作的兩關橫向守城網頁遊戲。關卡數值、怪物配置與商店規則以該規格為準。

## 本機預覽

```sh
python3 -m http.server 4173 --directory dist
```

開啟 `http://localhost:4173`。

## 操作

- 電腦：方向鍵移動，按住 `Space` 連續攻擊，`Esc` 暫停。
- 手機／平板：橫向使用，左下虛擬搖桿移動，按住右下攻擊鍵連續攻擊。

## 專案結構

- `dist/index.html`：遊戲界面與流程畫面。
- `dist/styles.css`：響應式介面、HUD、觸控操作。
- `dist/game.js`：關卡狀態、怪物生成、戰鬥、商店與重試回滾邏輯。
