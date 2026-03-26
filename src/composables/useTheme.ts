import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'
export type ThemeMode = 'light' | 'dark' | 'auto'

const THEME_STORAGE_KEY = 'macos-theme'

const getSystemTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
}

const getInitialMode = (): ThemeMode => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored as ThemeMode
    }
    return 'dark' // Default to dark
}

const themeMode = ref<ThemeMode>(getInitialMode())
const currentTheme = ref<Theme>('dark')

const updateCurrentTheme = () => {
    if (themeMode.value === 'auto') {
        currentTheme.value = getSystemTheme()
    } else {
        currentTheme.value = themeMode.value
    }
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', currentTheme.value)
    }
}

// Initial update
updateCurrentTheme()

// Watch for mode changes
watch(themeMode, (newMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, newMode)
    updateCurrentTheme()
})

// Watch for system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeMode.value === 'auto') {
            updateCurrentTheme()
        }
    })
}

export function useTheme() {
    const setThemeMode = (mode: ThemeMode) => {
        themeMode.value = mode
    }

    const toggleTheme = () => {
        // Cycles: auto -> light -> dark -> auto ... or just toggle light/dark?
        // Let's make it toggle between light and dark explicit modes for now to keep simple behavior predictable if clicked
        // Or if in auto, switch to the opposite of current resolved theme
        if (themeMode.value === 'auto') {
            themeMode.value = currentTheme.value === 'light' ? 'dark' : 'light'
        } else {
            themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
        }
    }

    return {
        themeMode,
        currentTheme,
        setThemeMode,
        toggleTheme
    }
}
