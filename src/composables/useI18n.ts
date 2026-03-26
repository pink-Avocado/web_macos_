import { zhCN } from '../locales/zh-CN'

// 目前只支持中文，未来可以扩展
export function useI18n() {
    const t = zhCN

    return {
        t
    }
}
