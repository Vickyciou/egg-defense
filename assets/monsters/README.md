# 怪物素材表

怪物素材由合併圖拆分而成，保留原本的手繪線條、配色與造型，並整理成透明背景 PNG。遊戲內可直接使用 `final/` 內的圖片。

| ID | 圖片 | 怪物名稱 | HP | 擊敗獎勵 | 備註 |
| --- | --- | --- | ---: | ---: | --- |
| `monster_01` | <img src="final/zombie_monster.png" width="180" alt="方塊殭屍"> | 方塊殭屍 (Square Zombie) | 20 | 10 金幣 | 手繪方塊人型，向前伸展雙臂 |
| `monster_02` | <img src="final/knight_monster.png" width="180" alt="三刺皇冠小戰士"> | 三刺皇冠小戰士 (Little Knight) | 60 | 50 金幣 | 戴著三刺皇冠，手持長劍的小戰士 |

## 資料夾

- `final/`：拆分後的透明背景遊戲素材。
- `source/monsters-combined.jpeg`：原始雙怪物合併圖。
- `monsters.json`：程式可讀取的怪物資料與素材檔名。
