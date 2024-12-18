import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { z } from 'zod'

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

const ChatMessage = z.object({
  role: z.union([
    z.literal('user'),
    z.literal('assistant'),
  ]),
  content: z.string()
});

// APIルート
const routes = app
  .post("/api/chat", zValidator('json', ChatMessage), (c) => {
    const req = c.req.valid("json");

    // TODO AzureOpenAIの呼び出し

    return c.json({
      messages: [
        {
          role: 'assistant', content: 'Hello!!!'
        } as z.infer<typeof ChatMessage>
      ],
    });
  });

export type Api = typeof routes;

// サーバーの起動
console.log(`Starting ${appName} in ${nodeEnv} mode`)
console.log(`Server is starting on http://${host}:${port}`)

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log(`Server is running on http://${host}:${info.port}`)
})
