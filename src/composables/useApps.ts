import { ref } from 'vue'
import { appsConfig, type AppConfig } from '../config/apps'

const STORAGE_KEY = 'macos_dock_settings'

// Helper to initialize state by merging localStorage with default config
const getInitialState = (): AppConfig[] => {
    const savedJson = localStorage.getItem(STORAGE_KEY)

    if (savedJson) {
        try {
            const savedApps = JSON.parse(savedJson) as AppConfig[]
            // Map over the SOURCE app config to ensure we define the structure
            // but override 'showInDock' from saved preferences if available.
            return appsConfig.map(defaultApp => {
                const savedApp = savedApps.find(a => a.id === defaultApp.id)
                if (savedApp) {
                    return {
                        ...defaultApp,
                        showInDock: savedApp.showInDock
                    }
                }
                return { ...defaultApp }
            })
        } catch (e) {
            console.warn('Failed to parse dock settings', e)
        }
    }

    // Fallback to default config
    return appsConfig.map(app => ({ ...app }))
}

// Create a singleton reactive reference
const apps = ref<AppConfig[]>(getInitialState())

export function useApps() {
    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apps.value))
    }

    const toggleDock = (appId: string, show: boolean) => {
        const app = apps.value.find(a => a.id === appId)
        if (app) {
            app.showInDock = show
            saveSettings()
        }
    }

    return {
        apps,
        toggleDock,
        updateAppOrder: (newApps: AppConfig[]) => {
            apps.value = newApps
            saveSettings()
        }
    }
}
