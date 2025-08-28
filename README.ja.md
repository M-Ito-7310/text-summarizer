# テキスト要約・キーワード抽出ツール

日本語対応のAI搭載テキスト分析ツール。Google Gemini APIを活用した、インテリジェントなテキスト要約・キーワード抽出アプリケーションです。

![プロジェクト状況](https://img.shields.io/badge/status-本番対応完了-brightgreen)
![Node.js](https://img.shields.io/badge/node.js-22%2B-green)
![Vue.js](https://img.shields.io/badge/vue.js-3.5-green)

**言語**: [English](README.md) | 日本語

## 概要

このプロジェクトは、最新のAI技術とモダンなWeb開発手法、本番環境対応のアーキテクチャを実証するフリーランスWebエンジニア向けポートフォリオ作品です。最先端のAI技術と実用的なビジネスアプリケーションを組み合わせています。

## アーキテクチャ概要

### システム構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js Web    │    │   Express API   │    │  Google Gemini  │
│   フロントエンド │◄──►│   バックエンド   │◄──►│   AI サービス    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 主な機能

#### 🔍 **テキスト分析**
- **AI要約機能**: Google Gemini 1.5 Flash モデルによる高品質な日本語抽象的要約
- **スマートキーワード抽出**: 日本語最適化された高度な頻度分析
- **複数の長さオプション**: 短文 (50-100文字)、中文 (100-200文字)、長文 (200-300文字)
- **リアルタイム処理**: 圧縮率表示付きの即座分析

#### 🌐 **言語サポート**
- **日本語特化処理**: ひらがな、カタカナ、漢字の完全Unicode対応で日本語に最適化
- **混在言語対応**: 多言語文書のシームレスな処理
- **専門用語検出**: 技術用語や複合語の自動識別

#### 🔧 **AI統合**
- **Google Gemini API**: 1日1,500リクエストの無料枠を持つ高性能AIサービス
- **信頼性の高い処理**: 本番環境対応のエラーハンドリングとサービス監視
- **透明な処理**: 結果と共に処理プロバイダー情報を表示

## 技術スタック

### フロントエンド
- **Vue.js 3**: Composition API と TypeScript
- **カスタムCSS**: モダンなデザインパターンとレスポンシブレイアウト
- **Vite**: 高速開発と最適化された本番ビルド
- **Axios**: 包括的エラーハンドリング付きAPI通信

### バックエンド
- **Node.js**: Express.js フレームワーク
- **Google Gemini API**: AI搭載テキスト処理
- **堅牢なエラーハンドリング**: 包括的なサービス監視とユーザーフィードバック
- **Winston**: 構造化ログと監視
- **Express Validator**: リクエストバリデーションとセキュリティ

### インフラストラクチャ
- **Vercel対応**: サーバーレス機能対応のデプロイ設定
- **環境ベース設定**: 異なるデプロイ環境への対応
- **ヘルスチェックエンドポイント**: 監視と診断機能

## クイックスタート

### 前提条件
- Node.js 18+ (推奨: 22+)
- Google Gemini API キー (無料枠利用可能)
- npm または yarn

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd text-summarizer
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **環境設定**
   ```bash
   # プロジェクトルートに .env ファイルを作成
   cp .env.example .env
   
   # Google Gemini API キーを追加
   GOOGLE_API_KEY=your_api_key_here
   ```

4. **開発サーバーの起動**
   ```bash
   # ターミナル 1: バックエンド
   cd backend && npm start
   
   # ターミナル 2: フロントエンド
   cd frontend && npm run dev
   ```

5. **アプリケーションへのアクセス**
   - フロントエンド: http://localhost:5173
   - バックエンド API: http://localhost:3001
   - ヘルスチェック: http://localhost:3001/health

## API ドキュメント

### フルテキスト分析
```http
POST /api/text/analyze
Content-Type: application/json

{
  "text": "分析したいテキストをここに入力...",
  "summaryOptions": {
    "maxLength": 200,
    "minLength": 50
  },
  "keywordOptions": {
    "maxKeywords": 10
  }
}
```

### レスポンス形式
```json
{
  "success": true,
  "data": {
    "summary": {
      "text": "生成された要約文...",
      "provider": "Gemini",
      "method": "abstractive"
    },
    "keywords": {
      "list": [
        {
          "word": "キーワード",
          "score": 0.95,
          "frequency": 5,
          "type": "word"
        }
      ],
      "provider": "Gemini"
    }
  },
  "metadata": {
    "processingTime": 1234,
    "characterCount": 500
  }
}
```

### その他のエンドポイント
- `GET /health` - ヘルスチェック
- `GET /api/text/services/status` - AIサービス状況
- `POST /api/text/summarize` - 要約のみ
- `POST /api/text/keywords` - キーワード抽出のみ

## 開発

### バックエンド開発
```bash
cd backend
npm run dev          # ホットリロード付き開発サーバー
npm test            # テストスイート実行
npm run lint        # コードリンティング
```

### フロントエンド開発
```bash
cd frontend
npm run dev         # 開発サーバー
npm run build       # 本番ビルド
npm run preview     # 本番ビルドプレビュー
```

### プロジェクト構成
```
text-summarizer/
├── frontend/                 # Vue.js フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/      # Vue コンポーネント
│   │   ├── services/       # API クライアント
│   │   ├── App.vue         # メインアプリケーション
│   │   └── style.css       # グローバルスタイル
│   └── package.json
├── backend/                  # Node.js バックエンドアプリケーション
│   ├── src/
│   │   ├── controllers/    # リクエストハンドラー
│   │   ├── services/       # ビジネスロジック
│   │   │   └── ai/        # AI サービス統合
│   │   ├── routes/         # API ルート
│   │   ├── middleware/     # カスタムミドルウェア
│   │   └── utils/          # ユーティリティとログ
│   └── package.json
├── docs/                     # ドキュメント
├── scripts/                  # 開発用ユーティリティ
├── vercel.json              # デプロイ設定
├── README.md                # 英語版 README
└── README.ja.md             # 日本語版 README（このファイル）
```

## 設定

### 必須環境変数
```env
# AI サービス設定
GOOGLE_API_KEY=your_google_gemini_api_key

# アプリケーション設定
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### オプション設定
```env
# データベース設定（将来の機能用）
DATABASE_URL=postgresql://...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=text_summarizer
DB_USER=postgres
DB_PASSWORD=password
```

## AIサービス詳細

### Google Gemini 統合
- **モデル**: gemini-1.5-flash
- **無料枠**: 1日 1,500リクエスト
- **機能**: 抽象的要約、キーワード抽出
- **言語**: 日本語・英語最適化
- **応答時間**: 通常 1-3秒
- **信頼性**: 包括的エラーハンドリングで本番環境対応

## パフォーマンス・監視

### パフォーマンス指標
- **API応答時間**: 1-3秒（AI処理）
- **フロントエンドバンドルサイズ**: 高速読み込み最適化
- **日本語テキスト処理**: Google Geminiによる精度最適化

### 監視機能
- **構造化ログ**: リクエスト/レスポンス追跡付きWinstonベースログシステム
- **ヘルスチェックエンドポイント**: `/health`によるアップタイム監視、サービス状況エンドポイント
- **エラートラッキング**: 包括的エラーハンドリングとデバッグ
- **API使用量メトリクス**: 処理統計のローカル追跡

## セキュリティ

### API セキュリティ
- **入力バリデーション**: 包括的リクエストバリデーション用 express-validator
- **レート制限**: 悪用防止のためのミドルウェア
- **CORS 設定**: セキュアなクロスオリジンリクエスト
- **環境保護**: セキュアなAPIキー管理

### データプライバシー
- **永続化しない**: ユーザーテキストは永続的に保存されません
- **APIキーセキュリティ**: 機密情報の安全な取り扱い
- **クライアントサイド処理**: 可能な限りローカル処理を実行

## デプロイメント

### Vercel デプロイメント
プロジェクトはワンクリック Vercel デプロイメントに対応しています：

1. GitHub リポジトリを Vercel に接続
2. Vercel ダッシュボードで環境変数を設定
3. main ブランチへのプッシュで自動デプロイ

### 本番環境用環境変数
- `GOOGLE_API_KEY`: Google Gemini API キー
- `NODE_ENV`: `production` に設定
- `FRONTEND_URL`: フロントエンドのドメイン

### 開発ワークフロー
- **セットアップ**: リポジトリクローン、依存関係インストール、環境設定
- **テスト**: Jest によるユニットテスト、API 統合テスト、手動UI テスト
- **デプロイ**: main へのプッシュで自動デプロイ、Vercel での環境変数設定、ヘルスチェック監視

## 今後のロードマップ

### 短期計画（Phase 4）
- [ ] **ファイルアップロード対応**: ドラッグ&ドロップUI付きPDF、DOCX、TXT処理
- [ ] **エクスポート機能**: PDF、Markdown、JSON エクスポートオプション
- [ ] **処理履歴**: 比較機能付きローカルストレージ
- [ ] **バッチ処理**: 複数文書処理機能

### 中期計画
- [ ] **ユーザー認証**: 保存文書付きアカウントシステム
- [ ] **複数文書分析**: 文書比較とバッチ分析
- [ ] **高度なAI機能**: 感情分析、固有表現認識
- [ ] **リアルタイムコラボレーション**: 共有処理と結果

### 長期計画
- [ ] **多言語UI**: 国際言語サポート
- [ ] **統合拡張**: 追加AIプロバイダーとサービス
- [ ] **カスタムモデル対応**: ファインチューニングと専用モデル
- [ ] **エンタープライズ機能**: 組織アカウント、使用量分析

## 使用方法

### 基本的な使い方
1. **テキスト入力**: メインのテキストエリアに分析したい文章を入力
2. **要約レベル選択**: 短文・中文・長文から希望する要約の長さを選択
3. **分析実行**: 「テキストを分析」ボタンをクリック
4. **結果確認**: 生成された要約文とキーワードを確認

### 高度な活用
- **圧縮率確認**: 元の文章と要約文の圧縮率を確認
- **キーワードスコア**: 各キーワードの重要度スコアを参考に文章の特徴を把握
- **処理プロバイダー**: AI処理かローカル処理かを確認して品質を判断

## 開発への貢献

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

### 開発ガイドライン
- 既存のコードパターンとアーキテクチャに従う
- 包括的なエラーハンドリングを確実に実装
- デバッグ用の適切なログを追加
- AI処理とエラーシナリオをテスト
- 新機能についてはドキュメントを更新

## トラブルシューティング

### よくある問題

#### API キーエラー
```
Error: API key not configured
```
**解決方法**: `.env` ファイルに有効な `GOOGLE_API_KEY` を設定してください。

#### ポート使用中エラー
```
Error: listen EADDRINUSE: address already in use :::3001
```
**解決方法**: 既存のプロセスを終了するか、別のポートを使用してください。

#### 日本語文字化け
文字化けが発生する場合は、ファイルのエンコーディングがUTF-8になっているか確認してください。

### サポート
- [GitHub Issues](../../issues) で問題を報告
- プロジェクトドキュメントを確認
- 上記のAPI例を参照
- [ROADMAP.md](ROADMAP.md) で予定機能を確認

## ライセンス

このプロジェクトは MIT ライセンス の下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 謝辞

このプロジェクトは以下の技術とサービスを使用しています：
- [Google Gemini AI](https://ai.google.dev/) - 高品質なAIテキスト処理
- [Vue.js](https://vuejs.org/) - プログレッシブJavaScriptフレームワーク
- [Vercel](https://vercel.com/) - フロントエンドデプロイメントプラットフォーム
- [Node.js](https://nodejs.org/) - JavaScriptランタイム環境