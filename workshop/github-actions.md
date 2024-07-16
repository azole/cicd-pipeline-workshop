# GitHub Actions

官方文件: [https://docs.github.com/en/actions/guides](https://docs.github.com/en/actions/guides)

# Demo

- 為專案建立 .github/workflows 檔案夾
- 在檔案夾裡建立 hello.yaml:
    
    ```yaml
    # 指定 Actions 的名稱，會顯示在 Actions 頁面上
    name: Hello Actions
    
    # 指定觸發的事件(trigger event)，這裡是 push 到 main 分支時觸發
    on:
      push:
        branches: main
    
    # 指定工作流程(jobs)
    # 每個 actions 至少要有一個 job
    jobs:
      first-job:
        # 指定運行環境，可以多個
        runs-on: ubuntu-latest
        # 指定工作流程的步驟(steps)
        # 每個 step 可以用 run 來叫用其他 GitHub Actions
        # 或是使用 run 來執行 shell 指令
        steps:
          - run: echo "This job was tirggered by a ${{ github.event_name }} event"
          # 使用 actions/checkout 來 checkout repository
          # 可能需要進行後續編譯或測試之類的
          - name: checkout-repository
            uses: actions/checkout@v4
          - run: echo "job - Hello Actoins"
    ```
    
- commit & push 後，到 github UI 上觀察

# Workflow

- 一個自動化的流程，可以執行一個或多個的 jobs。
- 採用 YAML 格式
- 放在 .github/workflows 裡，每個 repo 可以有多個 workflows
- 例如:
    - 使用一個工作流程來建立和測試拉取請求
    - 使用另一個工作流程在每次建立版本時部署應用程序
    - 還有另一個工作流程在每次有人開啟新問題時新增標籤
- 可以在另一個工作流程中引用一個工作流程 (resuing workflows)
- 觸發 workflow 的方式:
    - Events that occur in your workflow's repository
    - Events that occur outside of GitHub and trigger a `repository_dispatch` event on GitHub
    - Scheduled times
    - Manual
- 進階
    - workflow 之間的依賴
        
        [https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run)
        
        ```yaml
        on:
          # 定義一個 workflow 在另外一個 workflow 完成後觸發
          workflow_run:
            # 指定需要監控的 workflows
            # 例如: 當 Run Tests 這個 workflow 完成時，觸發當前的 workflow
            workflows: [Run Tests]
            types:
              - completed
        ```
        
    - Cache dependencies
        
        [https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
        
        ```yaml
        jobs:
          example-job:
            steps:
              # 示範怎麼 cache .npm 檔案夾
              - name: Cache node modules
                uses: actions/cache@v3
                env:
                  cache-name: cache-node-modules
                # with: 定義 action 需要的參數
                with:
                  # 指定要 cache 的目錄
                  path: ~/.npm
                  # 定義 cache 的 key
                  ## hashFiles: 計算 package-lock.json 文件的 hash value。這樣可以確保在依賴變更時 cache key 會變更，從而重新更新 cache 中的依賴。
                  key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
                  # 如果完全找不到 match 的 cache key 時，可以用這個前綴來找最近的 cache
                  # 可以設定多個
                  restore-keys: |
                    ${{ runner.os }}-build-${{ env.cache-name }}-
              # 當條件滿足時執行這個 step
              - if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
                name: List the state of node modules
                continue-on-error: true
                run: npm list
        ```
        
    - 使用其他依賴的服務，例如資料庫或 redis

# Trigger

- Event: repo 中觸發 workflow 的特定活動，event 會來自 GitHub，但也可以透過 schedul、REST API 或手動觸發
    - 事件列表 [https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)

### 決定 Action 在什麼時候會被觸發

```yaml
# 只有一個 event
on: push
# 也可以設定多個 event
on: [push, fork, issue, pull_request]
```

### 加上過濾條件

```yaml
on:
  # 指定在 push 時觸發 workflow，但下方有加上過濾條件
  push:
    # 當 push 到 main 分支時觸發
    branches:
      - main
    tag:
      # 當 tag 是 v 開頭時觸發，例如 v1.0
      - "v**"
      # 當 tag 是 release/ 開頭時觸發，例如 release/1.0
      - "releases/**"
      # 當 tag 以 release/ 開頭，但以 -alpha 結尾時，不要觸發
      - "!releases/**-alpha"
    # 當 docs 裡的檔案修改時，不會觸發
    paths-ignore:
      - 'docs/*'
  # 當 issue 事件發生時觸發，但有加上過濾條件
  issue:
    # opened: 當一個新的 issue 被打開時觸發
    # labeled: 當一個 issue 被 label 時觸發
    types: [opened, labeled]
```

### 手動觸發

```yaml
on:
  # 定義這是要手動觸發的 workflow
  workflow_dispatch:
    # 手動觸發時需要提供的參數
    inputs:
      # 輸入參數的名稱
      title:
        description: 'version title'
        required: true
        default: 'deploy to ec2'
```

在 steps 中，可以透過 `${{ github.event.inputs.title }}` 來存取

# Jobs

- Job: workflow 中，在同一個 runner 上執行的一組 steps
    - 每個 step 不是要執行一個 shell (run) 就是執行一個 action
    - step 會依序執行且相互依賴，因為是在同一個 runner 上，所以可以共享資料
- Job 之間預設是沒有依賴關係且並行運行的
    - 可以設定彼此的依賴關係
        
        ```yaml
        jobs:
          job1:
          # job2 依賴 job1
          job2:
            needs: job1
          job3:
            #if: ${{ always() }}
            needs: [job1, job2]
        ```
        
    - 動手測試看看，如果讓 job1 fail 會發生什麼事？
        - 如果把 always 這行反註解，結果會發生什麼事？
- 可以用 `if` 來決定要不要執行這個 job 或 step
- Matrix: 利用矩陣策略，在單一 job 定義中使用變數來自動建立基於變數組合的多個 job
    
    ```yaml
    jobs:
      build:
        runs-on: ubuntu-latest
        # 這個 job 會為 node:14, node:16 各執行一次
        strategy:
          matrix:
            node: [14, 16]
        steps:
          - uses: actions/setup-node@v4
            with:
              node-version: ${{ matrix.node }}
    ```
    
    或是在不同平台間運作
    
    ```yaml
    jobs:
      build-multi-platform:
        strategy:
          matrix:
            node: [mac-latest, ubuntu-latest, windows-latest]
    		runs-on: ${{ matrix.platform }}
        steps:
          - uses: actions/setup-node@v4
            with:
              node-version: ${{ matrix.node }}
    ```
    

# Actions

- Action: 是 GitHub Actions 平台的自定義應用
    - 用來執行複雜且重複的任務
    - 可以想像成是事先寫好的模組或函式，然後載入呼叫來用
- 可以自己開發

# Runners

- runner: 當 workflow 被觸發時，用來執行 workflow 的 server
    - 每個 runner 同一個時間只能執行一個 job
- GitHub 提供: Ubuntu Linux, Microsoft Windows 跟 MacOS
- 也可以自己 hosted

# 參考資料

- GitHub Actions 官方文件其實寫得很好，可以參考
  - https://docs.github.com/en/actions/guides