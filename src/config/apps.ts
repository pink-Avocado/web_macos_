/**
 * 应用配置接口定义
 * @property id 应用唯一标识符
 * @property nameKey 国际化翻译键值
 * @property icon 图标路径
 * @property showInLaunchpad 是否在启动台中显示
 * @property showInDock 是否在程序坞中显示
 */
export interface AppConfig {
    id: string
    nameKey: string
    icon: string
    showInLaunchpad: boolean
    showInDock: boolean
}

/**
 * 所有应用的集中配置列表
 * 用于统一管理 Launchpad 和 Dock 中的应用显示
 */
export const appsConfig: AppConfig[] = [
    {
        id: 'finder',
        nameKey: 'apps.finder',
        icon: '/icons/finder.png',
        showInLaunchpad: false,
        showInDock: true
    },
    {
        id: 'launchpad',
        nameKey: 'apps.launchpad',
        icon: '/icons/launchpad.png',
        showInLaunchpad: false,
        showInDock: true
    },
    {
        id: 'safari',
        nameKey: 'apps.safari',
        icon: '/icons/safari.png',
        showInLaunchpad: true,
        showInDock: true
    },
    {
        id: 'messages',
        nameKey: 'apps.messages',
        icon: '/icons/messages.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'notes',
        nameKey: 'apps.notes',
        icon: '/icons/notes.png',
        showInLaunchpad: true,
        showInDock: true
    },
    {
        id: 'stickies',
        nameKey: 'apps.stickies',
        icon: '/icons/stickies.png',
        showInLaunchpad: true,
        showInDock: true
    },
    {
        id: 'contacts',
        nameKey: 'apps.contacts',
        icon: '/icons/contacts.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'calendar',
        nameKey: 'apps.calendar',
        icon: '/icons/calendar.png',
        showInLaunchpad: true,
        showInDock: true
    },
    {
        id: 'music',
        nameKey: 'apps.music',
        icon: '/icons/music.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'settings',
        nameKey: 'apps.settings',
        icon: '/icons/settings.png',
        showInLaunchpad: true,
        showInDock: true
    },
    {
        id: 'calculator',
        nameKey: 'apps.calculator',
        icon: '/icons/calculator.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'reminders',
        nameKey: 'apps.reminders',
        icon: '/icons/reminders.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'preview',
        nameKey: 'apps.preview',
        icon: '/icons/preview.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'terminal',
        nameKey: 'apps.terminal',
        icon: '/icons/terminal.png',
        showInLaunchpad: true,
        showInDock: true
    },
    {
        id: 'siri',
        nameKey: 'apps.siri',
        icon: '/icons/siri.png',
        showInLaunchpad: true,
        showInDock: false
    },
    {
        id: 'vscode',
        nameKey: 'apps.vscode',
        icon: '/icons/vscode.png',
        showInLaunchpad: true,
        showInDock: true
    }
]
