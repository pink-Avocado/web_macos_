/**
 * macOS Big Sur/Monterey 风格图标生成工具
 * 统一风格：32x32 ViewBox, 线性渐变, 统一投影
 */

const generateId = () => Math.random().toString(36).substring(2, 9)

// ========== 1. 文件夹图标 ==========

export function createFolderIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;">
      <defs>
        <linearGradient id="folderGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#4A9EFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1976D2;stop-opacity:1" />
        </linearGradient>
        <filter id="folderShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#folderGrad${id})" 
            filter="url(#folderShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
    </svg>
  `
}

// ========== 2. 通用文档图标 ==========

export function createGenericIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;">
      <defs>
        <linearGradient id="docGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E0E0E0;stop-opacity:1" />
        </linearGradient>
        <filter id="docShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.2)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#docGrad${id})" 
            filter="url(#docShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(0,0,0,0.1)"/>
      <line x1="8" y1="12" x2="22" y2="12" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
      <line x1="8" y1="16" x2="22" y2="16" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
      <line x1="8" y1="20" x2="18" y2="20" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
    </svg>
  `
}

// ========== 3. 具体文件类型图标 (统一风格) ==========

export function createTextIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="textGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F0F0F0;stop-opacity:1" />
        </linearGradient>
        <filter id="textShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.2)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#textGrad${id})" 
            filter="url(#textShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(0,0,0,0.1)"/>
      <text x="16" y="20" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="rgba(0,0,0,0.6)">TXT</text>
    </svg>
  `
}

// Word (DOC)
export function createWordIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="wordGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#2B579A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E3F6F;stop-opacity:1" />
        </linearGradient>
        <filter id="wordShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#wordGrad${id})" 
            filter="url(#wordShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/>
      <text x="15" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">W</text>
    </svg>
  `
}

// Excel (XLS)
export function createExcelIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="excelGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1D6F42;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0F4C2C;stop-opacity:1" />
        </linearGradient>
        <filter id="excelShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#excelGrad${id})" 
            filter="url(#excelShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/>
      <text x="15" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">X</text>
    </svg>
  `
}

// PDF
export function createPdfIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="pdfGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#D63031;stop-opacity:1" />
        </linearGradient>
        <filter id="pdfShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#pdfGrad${id})" 
            filter="url(#pdfShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/>
      <text x="15" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">PDF</text>
    </svg>
  `
}

// Code Icon (Blue generic code)
export function createCodeIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="codeGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#55A3FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2E86DE;stop-opacity:1" />
        </linearGradient>
        <filter id="codeShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#codeGrad${id})" 
            filter="url(#codeShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/>
      <path d="M10 14 L12 16 L10 18" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
      <path d="M20 14 L18 16 L20 18" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
      <line x1="14" y1="20" x2="16" y2="12" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
    </svg>
  `
}

// HTML (Use Code Icon as per FinderApp.vue)
export function createHtmlIcon(): string {
  return createCodeIcon()
}

// CSS (Use Code Icon)
export function createCssIcon(): string {
  return createCodeIcon()
}

// JS (Use Code Icon)
export function createJsIcon(): string {
  return createCodeIcon()
}

// Vue (Use Code Icon)
export function createVueIcon(): string {
  return createCodeIcon()
}

// ========== 4. 媒体图标 ==========

export function createImageIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="imageGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FF9500;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E8890B;stop-opacity:1" />
        </linearGradient>
        <filter id="imageShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="2" ry="2" 
            fill="url(#imageGrad${id})" 
            filter="url(#imageShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <circle cx="10" cy="12" r="2" fill="rgba(255,255,255,0.8)"/>
      <path d="M8 20 L12 16 L16 20 L20 16 L24 20 L24 26 C24 27.1 23.1 28 22 28 L6 28 C4.9 28 4 27.1 4 26 L4 22 Z" 
            fill="rgba(255,255,255,0.3)"/>
    </svg>
  `
}

export function createVideoIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="videoGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#6C5CE7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#5F3DC4;stop-opacity:1" />
        </linearGradient>
        <filter id="videoShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <rect x="4" y="6" width="24" height="20" rx="2" ry="2" 
            fill="url(#videoGrad${id})" 
            filter="url(#videoShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <polygon points="14,12 14,20 20,16" fill="white" opacity="0.9"/>
    </svg>
  `
}

export function createAudioIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="audioGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#00CEC9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00B894;stop-opacity:1" />
        </linearGradient>
        <filter id="audioShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#audioGrad${id})" 
            filter="url(#audioShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/>
      <circle cx="15" cy="18" r="3" fill="none" stroke="white" stroke-width="1" opacity="0.8"/>
      <circle cx="15" cy="18" r="1.5" fill="white" opacity="0.8"/>
    </svg>
  `
}

export function createArchiveIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="archiveGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FDCB6E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E17055;stop-opacity:1" />
        </linearGradient>
        <filter id="archiveShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" 
            fill="url(#archiveGrad${id})" 
            filter="url(#archiveShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/>
      <rect x="10" y="12" width="10" height="8" rx="1" ry="1" fill="none" stroke="white" stroke-width="1" opacity="0.8"/>
      <rect x="13" y="15" width="4" height="2" fill="white" opacity="0.8"/>
    </svg>
  `
}

// ========== 5. 特殊目录图标 (Sidebar/Specific) ==========

export function createDesktopIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="desktopGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#4A9EFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1976D2;stop-opacity:1" />
        </linearGradient>
        <filter id="desktopShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <rect x="4" y="8" width="24" height="16" rx="2" ry="2" 
            fill="url(#desktopGrad${id})" 
            filter="url(#desktopShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <rect x="6" y="10" width="20" height="12" rx="1" ry="1" fill="rgba(255,255,255,0.9)"/>
      <rect x="12" y="24" width="8" height="2" rx="1" ry="1" fill="rgba(0,0,0,0.3)"/>
      <rect x="10" y="26" width="12" height="2" rx="1" ry="1" fill="rgba(0,0,0,0.2)"/>
    </svg>
  `
}

export function createDocumentsIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="documentsGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#5DADE2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3498DB;stop-opacity:1" />
        </linearGradient>
        <filter id="documentsShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#documentsGrad${id})" 
            filter="url(#documentsShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <rect x="8" y="16" width="16" height="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="8" y="19" width="12" height="1" fill="rgba(255,255,255,0.8)"/>
    </svg>
  `
}

export function createDownloadsIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="downloadsGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#58D68D;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#28B463;stop-opacity:1" />
        </linearGradient>
        <filter id="downloadsShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#downloadsGrad${id})" 
            filter="url(#downloadsShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <path d="M16 13 L16 20 M13 17 L16 20 L19 17" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export function createPicturesIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="picturesGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#F39C12;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E67E22;stop-opacity:1" />
        </linearGradient>
        <filter id="picturesShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#picturesGrad${id})" 
            filter="url(#picturesShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <circle cx="12" cy="16" r="2" fill="rgba(255,255,255,0.8)"/>
      <path d="M8 22 L12 18 L16 22 L20 18 L24 22" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export function createMusicIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="musicGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E74C3C;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#C0392B;stop-opacity:1" />
        </linearGradient>
        <filter id="musicShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#musicGrad${id})" 
            filter="url(#musicShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <path d="M14 14 L20 12 L20 20 C20 21.1 19.1 22 18 22 C16.9 22 16 21.1 16 20 C16 18.9 16.9 18 18 18 C18.3 18 18.7 18.1 19 18.2 L19 14 L14 15 L14 21 C14 22.1 13.1 23 12 23 C10.9 23 10 22.1 10 21 C10 19.9 10.9 19 12 19 C12.3 19 12.7 19.1 13 19.2 L13 16 Z" 
            fill="rgba(255,255,255,0.9)"/>
    </svg>
  `
}

export function createMoviesIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="moviesGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#9B59B6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8E44AD;stop-opacity:1" />
        </linearGradient>
        <filter id="moviesShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#moviesGrad${id})" 
            filter="url(#moviesShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <rect x="10" y="14" width="12" height="8" rx="1" ry="1" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.8)" stroke-width="0.5"/>
      <polygon points="14,16 14,20 18,18" fill="rgba(255,255,255,0.9)"/>
    </svg>
  `
}

export function createApplicationsIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="applicationsGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#34495E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2C3E50;stop-opacity:1" />
        </linearGradient>
        <filter id="applicationsShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#applicationsGrad${id})" 
            filter="url(#applicationsShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.2)"/>
      <rect x="8" y="14" width="4" height="4" rx="1" ry="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="14" y="14" width="4" height="4" rx="1" ry="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="20" y="14" width="4" height="4" rx="1" ry="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="8" y="20" width="4" height="4" rx="1" ry="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="14" y="20" width="4" height="4" rx="1" ry="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="20" y="20" width="4" height="4" rx="1" ry="1" fill="rgba(255,255,255,0.8)"/>
    </svg>
  `
}

export function createSystemIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="systemGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#95A5A6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7F8C8D;stop-opacity:1" />
        </linearGradient>
        <filter id="systemShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#systemGrad${id})" 
            filter="url(#systemShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <circle cx="16" cy="18" r="4" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
      <circle cx="16" cy="18" r="1.5" fill="rgba(255,255,255,0.8)"/>
      <path d="M16 14 L16 12 M16 24 L16 22 M20 18 L22 18 M10 18 L12 18 M19.3 14.7 L20.7 13.3 M11.3 22.7 L12.7 21.3 M19.3 21.3 L20.7 22.7 M11.3 13.3 L12.7 14.7" 
            stroke="rgba(255,255,255,0.6)" stroke-width="1" stroke-linecap="round"/>
    </svg>
  `
}

export function createUserIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="userGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3498DB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2980B9;stop-opacity:1" />
        </linearGradient>
        <filter id="userShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 24 C30 25.1 29.1 26 28 26 L4 26 C2.9 26 2 25.1 2 24 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="url(#userGrad${id})" 
            filter="url(#userShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M3 8 L13 8 L15 6 L28 6 C29.1 6 30 6.9 30 8 L30 11 L2 11 L2 9 C2 8.4 2.4 8 3 8 Z" 
            fill="rgba(255,255,255,0.3)"/>
      <circle cx="16" cy="16" r="2.5" fill="rgba(255,255,255,0.9)"/>
      <path d="M11 22 C11 20 13 18.5 16 18.5 C19 18.5 21 20 21 22" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `
}

export function createLinkIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="linkGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#0984E3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00CEC9;stop-opacity:1" />
        </linearGradient>
        <filter id="linkShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="6" ry="6" 
            fill="url(#linkGrad${id})" 
            filter="url(#linkShadow${id})" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"/>
      <path d="M10 16 C10 12.686 12.686 10 16 10 C19.314 10 22 12.686 22 16 C22 19.314 19.314 22 16 22 C12.686 22 10 19.314 10 16 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      <path d="M8 16 L24 16" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
      <path d="M16 8 L16 24" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
      <path d="M12 21 C15 23 17 23 20 21 M12 11 C15 9 17 9 20 11" stroke="rgba(255,255,255,0.6)" stroke-width="1" fill="none"/>
    </svg>
  `
}

export function createAppIcon(): string {
  return createApplicationsIcon()
}

export function createDmgIcon(): string {
  const id = generateId()
  return `
    <svg viewBox="0 0 32 32" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="dmgGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#74B9FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0984E3;stop-opacity:1" />
        </linearGradient>
        <filter id="dmgShadow${id}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <circle cx="16" cy="16" r="12" 
              fill="url(#dmgGrad${id})" 
              filter="url(#dmgShadow${id})" 
              stroke="rgba(0,0,0,0.2)" 
              stroke-width="0.5"/>
      <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="1.5" opacity="0.8"/>
      <circle cx="16" cy="16" r="2" fill="white" opacity="0.8"/>
    </svg>
  `
}
