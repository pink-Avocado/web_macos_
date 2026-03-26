云函数：
import cloud from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const db = cloud.database()
  const { action, key, value } = ctx.body || ctx.query

  // 可选：强制要求 key 存在（除 list 外）
  if (!['list'].includes(action) && !key) {
    return { code: 400, message: '缺少 key 参数' }
  }

  try {
    // 1. 保存或更新（upsert 行为：存在则更新，不存在则插入）
    if (action === 'save' || action === 'set') {
      if (value === undefined) {
        return { code: 400, message: '缺少 value 参数' }
      }

      // 查找是否已存在该 key
      const query = db.collection('macoswebnew').where({ key })
      const exist = await query.get()

      if (exist.data.length > 0) {
        // 已存在：更新
        const docId = exist.data[0]._id
        await query.update({
          value,
          updatedAt: new Date()
        })
        return { code: 0, message: '更新成功', data: { id: docId, key } }
      } else {
        // 不存在：新增
        const res = await db.collection('macoswebnew').add({
          key,
          value,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return { code: 0, message: '保存成功', data: { id: res.id, key } }
      }
    }

    // 2. 按 key 获取单条数据
    if (action === 'get') {
      const res = await db.collection('macoswebnew').where({ key }).get()
      if (res.data.length === 0) {
        return { code: 404, message: '未找到对应 key 的数据', key }
      }
      return { code: 0, message: '查询成功', data: res.data[0] }
    }

    // 3. 获取所有（可选，用于调试）
    if (action === 'list') {
      const res = await db.collection('macoswebnew')
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get()
      return { code: 0, message: '查询成功', data: res.data }
    }

    // 4. 删除（可选）
    if (action === 'delete') {
      const res = await db.collection('macoswebnew').where({ key }).remove()
      return { code: 0, message: '删除成功', deleted: res.deleted }
    }

    return { code: 400, message: '不支持的操作', supportedActions: ['save', 'get', 'list', 'delete'] }
  } catch (error) {
    console.error('KV 操作失败:', error)
    return { code: -1, message: '操作失败', error: error.message }
  }
}

接口地址：https://lt20czhfj3.hzh.sealos.run/macos_web_data_new
请求方式：POST（推荐）或 GET（仅限查询类操作）
数据格式：application/json
请求参数说明
所有操作通过 action 字段指定行为，其余字段根据操作类型动态变化。
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `action` | string | 是 | 操作类型：`save` / `get` / `delete` / `list` |
| `key` | string | 否* | 数据唯一标识（除 `list` 外必填） |
| `value` | any | 否* | 要存储的值（`save` 时必填） |
🔧 接口详情
1. 保存/更新数据（Upsert）
action: save 或 set
方法: POST
请求体示例:
2. 按 key 获取数据
action: get
方法: POST 或 GET
请求示例（POST）:
{
  "action": "get",
  "key": "user_1001_theme"
}
成功响应:
{
  "code": 0,
  "message": "查询成功",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "key": "user_1001_theme",
    "value": "dark",
    "createdAt": "2026-01-23T12:00:00.000Z",
    "updatedAt": "2026-01-23T12:05:00.000Z"
  }
}
3. 删除数据
action: delete
方法: POST
请求体示例:
{
  "action": "delete",
  "key": "user_1001_theme"
}
4. 列出所有数据（调试用）
action: list
方法: POST 或 GET
请求示例:
{ "action": "list" }