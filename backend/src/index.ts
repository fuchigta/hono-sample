import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// ミドルウェアの設定
app.use('*', logger())
app.use('/api/*', cors())

// APIルート
app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from Hono Backend!',
    timestamp: new Date().toISOString()
  })
})

// サーバーの起動
const port = 3000
console.log(`Server is starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})