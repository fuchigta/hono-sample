import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from 'dotenv'

// 環境変数の読み込み
config()

const app = new Hono()

// 環境変数からポート番号を取得（デフォルト値: 3000）
const port = parseInt(process.env.PORT || '3000', 10)
const host = process.env.HOST || 'localhost'
const appName = process.env.APP_NAME || 'Hono Backend'
const nodeEnv = process.env.NODE_ENV || 'development'

// ミドルウェアの設定
app.use('*', logger())
app.use('/api/*', cors())

// APIルート
app.get('/api/hello', (c) => {
  return c.json({
    message: `Hello from ${appName}!`,
    environment: nodeEnv,
    timestamp: new Date().toISOString()
  })
})

// 環境変数の確認用エンドポイント（開発環境のみ）
if (nodeEnv === 'development') {
  app.get('/api/env', (c) => {
    return c.json({
      port,
      host,
      appName,
      nodeEnv
    })
  })
}

// サーバーの起動
console.log(`Starting ${appName} in ${nodeEnv} mode`)
console.log(`Server is starting on http://${host}:${port}`)

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log(`Server is running on http://${host}:${info.port}`)
})