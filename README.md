# Holo Repository API

这是一个基于 Next.js 构建的规则管理 API 服务，用于存储和管理规则数据。

## 项目功能

- **规则管理**：创建、读取、更新规则
- **数据存储**：使用 Vercel KV 进行持久化存储
- **API 接口**：提供 RESTful API 接口
- **数据验证**：使用 Zod 进行数据验证

## 技术栈

- **前端框架**：Next.js 16.1.6
- **编程语言**：TypeScript
- **数据验证**：Zod
- **数据存储**：Vercel KV

## 安装和部署

### 本地开发

1. **克隆仓库**
   ```bash
   git clone <仓库地址>
   cd holo-repository
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

5. **启动生产服务器**
   ```bash
   npm start
   ```

### 部署到 Vercel

1. **在 Vercel 控制台创建项目**
   - 登录 Vercel 控制台
   - 点击 "New Project"
   - 连接你的 Git 仓库

2. **配置 Vercel KV**
   - 进入项目设置
   - 点击 "Storage"
   - 点击 "Connect Database"
   - 选择 "KV" 并创建数据库

3. **部署项目**
   - Vercel 会自动检测项目配置
   - 点击 "Deploy"
   - 部署完成后，Vercel 会提供访问 URL

## API 接口

### 获取所有规则

- **请求方法**：GET
- **端点**：`/api/rule`
- **响应**：
  ```json
  [
    {
      "id": "1",
      "name": "规则名称",
      "baseUrl": "https://example.com",
      "...": "其他字段"
    }
  ]
  ```

### 保存规则

- **请求方法**：POST
- **端点**：`/api/rule`
- **请求体**：
  ```json
  [
    {
      "name": "规则名称",
      "baseUrl": "https://example.com",
      "...": "其他字段"
    }
  ]
  ```
- **响应**：
  ```json
  {
    "message": "Rules saved successfully"
  }
  ```

## 规则数据结构

规则包含以下字段：

- `id`：规则 ID（可选）
- `userId`：用户 ID
- `name`：规则名称
- `baseUrl`：基础 URL
- `logoUrl`：Logo URL
- `useWebView`：是否使用 WebView
- `version`：规则版本
- `searchUrl`：搜索 URL
- `searchRequestMethod`：搜索请求方法
- `searchRequestBody`：搜索请求体
- `searchRequestHeaders`：搜索请求头
- `fullSearchUrl`：是否使用完整搜索 URL
- `timeout`：超时时间（秒）
- `searchSelector`：搜索选择器
- `itemImgSelector`：项目图片选择器
- `itemImgFromSrc`：是否从 src 获取图片
- `itemTitleSelector`：项目标题选择器
- `itemIdSelector`：项目 ID 选择器
- `itemGenreSelector`：项目类型选择器
- `detailUrl`：详情 URL
- `detailRequestMethod`：详情请求方法
- `detailRequestBody`：详情请求体
- `detailRequestHeaders`：详情请求头
- `fullDetailUrl`：是否使用完整详情 URL
- `lineSelector`：线路选择器
- `episodeSelector`：剧集选择器
- `episodeReverse`：是否反转剧集顺序
- `playerUrl`：播放器 URL
- `playerRequestMethod`：播放器请求方法
- `playerRequestBody`：播放器请求体
- `playerRequestHeaders`：播放器请求头
- `fullPlayerUrl`：是否使用完整播放器 URL
- `playerVideoSelector`：播放器视频选择器
- `videoElementAttribute`：视频元素属性
- `embedVideoSelector`：嵌入视频选择器
- `waitForMediaElement`：是否等待媒体元素
- `videoUrlSubsChar`：视频 URL 替换字符
- `updateAt`：更新时间
- `isEnabled`：是否启用
- `isLocal`：是否本地

## 注意事项

- **Vercel KV**：使用 Vercel KV 进行数据存储，免费额度为 100MB 存储空间和 100,000 读写操作/天
- **数据验证**：所有规则数据都会经过 Zod 验证，确保数据格式正确
- **错误处理**：API 接口包含错误处理，确保服务稳定运行

## 许可证

MIT
