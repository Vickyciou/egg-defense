# 武器素材表

這組素材以原始手繪稿為造型依據，保留藍筆線條與不規則比例，並整理成透明背景 PNG。遊戲內可直接使用 `final/` 內的圖片。

| 編號 | 圖片 | 武器名稱 | 購買金額 | 攻擊力 |
| ---: | --- | --- | ---: | --- |
| 1 | <img src="final/01-scythe.png" width="160" alt="鐮刀"> | 鐮刀 | $50 | 8 |
| 2 | <img src="final/02-longsword.png" width="160" alt="長刀"> | 長刀 | $100 | 9 |
| 3 | <img src="final/03-bow.png" width="160" alt="弓"> | 弓 | $250 | 8 |
| 4 | <img src="final/04-m1911.png" width="160" alt="M1911"> | M1911 | $550 | 10 |
| 5 | <img src="final/05-gl06.png" width="160" alt="GL06"> | GL06 | $900 | 20 |
| 6 | <img src="final/06-ak47.png" width="160" alt="AK-47"> | AK-47 | $1,500 | 15 |
| 7 | <img src="final/07-m134.png" width="160" alt="M134"> | M134 | $2,000 | 25 |

## 資料夾

- `final/`：去除紙張、文字與雜線後的透明背景遊戲素材。
- `source-crops/`：從原始照片裁出的手繪造型參考，方便日後比對與重製。
- `weapons.json`：程式可讀取的武器資料與素材路徑。

攻擊力數值依遊戲設定填入，程式資料使用 `attackPower` 欄位。
