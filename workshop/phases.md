## Phase 0 手動部署

需求: 把專案手動部署到 EC2 Linux instance 上去

- 手動部署 example-web 專案
- 先不管 .env 檔案

## Phase 1 基本 Pipeline

需求: 當 code merge 時，將產出部署至 EC2 上

- 在 .github/workflows 裡建立 deploy.yaml
  - 手動已經做過了，所以這個 workflow 中應該要有哪些 jobs?
- 什麼時候觸發 workflow? → on 要怎麼寫？
- 其他先不管，先可以成功自動部署
  - 假設環境只有一個 (production)
  - 不用 container
  - 不用測試、不用 lint…
- 使用 Phase 0 準備好的 infra 環境，不用自己建立
- 要怎麼部署到 EC2 instance 上去？練習找合適的 actions
- 要怎麼測試是否成功？

## Phase 2 加上 Branch Modeling

需求: 如果採用 Git Flow，那 workflow 的觸發應該怎麼調整？

- 建立 feat branch，feat branch 開發完成後，對 main 發 PR
- merge 後觸發 workflow 進行部署
- 注意: 要 merge 後才觸發，所以 .github/workflows/deploy.yaml 要怎麼修改？

## Phase 3 加上 lint

需求: 加上 lint / Prettier…

- 在哪裡執行 lint?
- 成功或失敗？

## Phase 4 加上測試

需求: 執行測試

- 可以執行測試
- 測試失敗就停下來
- 把測試報告保留下來?
  - Artifact 的管理？

## Phase 5 加上通知

需求: 測試跑失敗要通知相關人士

- 通知方式: email / slack / discord
- 通知內容應該要包含哪些資訊？

## Phase 6 人工介入 approval

需求: 不再從頭到尾自動化了，要有人工介入

- 什麼地方適合人工介入？
- 怎麼介入?
- 介入後怎麼繼續?
- 負責 approve 的人要怎麼知道有 pipeline 要他 approve?

## Phase 7 改成 containerize

需求: infra 改變，希望 containerize

- build Docker image & push to registry
- 怎麼部署到 EC2 上？
- 用 image 的 tag 來標注版號，要怎麼做？
  - 版號應該怎的設計？

## Phase 8 多環境

需求: 有 dev / staging / production 三個環境

- pipeline 會怎麼調整？
