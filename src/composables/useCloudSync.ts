import { CloudSyncAPI } from '../api'
import { useApps } from './useApps'
import { ref } from 'vue'

export function useCloudSync() {
    const { updateAppOrder } = useApps()
    const isSyncing = ref(false)

    const syncDataFromCloud = async () => {
        if (isSyncing.value) return
        isSyncing.value = true

        try {
            const data = await CloudSyncAPI.list()

            data.forEach((item: any) => {
                if (!item.key) return

                try {
                    if (item.key === 'macos_dock_settings') {
                        const apps = item.parsedValue
                        if (apps) {
                            updateAppOrder(apps)
                        }
                    } else {
                        if (item.rawValue !== undefined) {
                            if (typeof item.parsedValue === 'string') {
                                localStorage.setItem(item.key, item.parsedValue)
                            } else {
                                localStorage.setItem(item.key, item.rawValue)
                            }
                            // If it's launchpad state, we might need to trigger a reactivity update if Launchpad component is watching localStorage?
                            // Launchpad watches `apps` ref. It initializes from localStorage on mount.
                            // If we update localStorage here, Launchpad won't know unless we reload or it listens to storage event.
                            // But `useApps` handles dock settings reactivity.
                            // For Launchpad, it might be better if we had a useLaunchpad composable, but we don't.
                            // However, simply updating localStorage is what the original code did.
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to process cloud data for key ${item.key}:`, e)
                }
            })

            console.log('Cloud sync completed')

        } catch (e) {
            console.error('Cloud synchronization failed:', e)
        } finally {
            isSyncing.value = false
        }
    }

    return {
        syncDataFromCloud,
        isSyncing
    }
}
