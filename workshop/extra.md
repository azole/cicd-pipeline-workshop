# 額外需求

- 測試時，如果需要 mock 其他服務呢？例如資料庫、Redis 等
- 什麼是 SBOM？？怎麼在 pipeline 中產生 SBOM？
  - [CI/CD - 於 GitHub 上建立自動生成 SBOM 及漏洞掃描](https://nics-tw.github.io/resilience-material/material/ci-cd-guideline)
- 如果要加上程式碼跟 Docker Image 的安全性掃描，應該要放在哪個地方？
- 資料庫的 migration 要怎麼處理？
- 到目前為止討論的都是應用程式的部署，如果 infra 有變動，應該要怎麼處理？
- 如果要加上壓力測試，應該要怎麼做？
- 如果要加上 A/B testing，應該要怎麼做？
- 如果要加上部署策略（例如藍綠部署、金絲雀部署等），應該要怎麼做？

## 管理與監控

- 如果要加上 CI/CD 的 dashboard，應該要怎麼做？
- 如果要加上 CI/CD 的 metrics，應該要怎麼做？
- 如果要加上 CI/CD 的 cost analysis，應該要怎麼做？
