
// Ported from apiConfig.js
const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
} as const;

// Current environment (hardcoded to DEVELOPMENT as per reference)
const CURRENT_ENV = ENV.DEVELOPMENT;

export const API_CONFIG = {
    [ENV.DEVELOPMENT]: {
        FILE_SERVICE: 'https://lt20czhfj3.hzh.sealos.run',
        OBJECT_STORAGE: {
            BASE_URL: 'https://objectstorageapi.hzh.sealos.run',
            BUCKET_NAME: '48uh3xwo-macweb',
        },
        TIMEOUT: 10000,
    },
    [ENV.PRODUCTION]: {
        FILE_SERVICE: 'https://your-prod-file-service.com',
        OBJECT_STORAGE: {
            BASE_URL: 'https://prod-objectstorage.com',
            BUCKET_NAME: 'prod-bucket',
        },
        TIMEOUT: 8000,
    },
    [ENV.TEST]: {
        FILE_SERVICE: 'https://test-file-service.com',
        OBJECT_STORAGE: {
            BASE_URL: 'https://test-objectstorage.com',
            BUCKET_NAME: 'test-bucket',
        },
        TIMEOUT: 5000,
    }
};

const getCurrentConfig = () => {
    return API_CONFIG[CURRENT_ENV] || API_CONFIG[ENV.DEVELOPMENT];
};

const API_ENDPOINTS = {
    FILE: {
        GET_DATA: '/get_data',
        READ_DATA: '/read_data',
        UPLOAD_FILE: '/upload',
        DELETE_FILE: '/del_data',
        CREATE_FOLDER: '/create_folder',
        ADD_DATA: '/add_data'
    },
    OBJECT_STORAGE: {
        BASE_PATH: '',
    },
    USER: {
        LOGIN: '/login-user',
        LOGOUT: '/api/user/logout',
        PROFILE: '/api/user/profile',
        VALIDATE: '/login-user'
    }
};

// --- Type Definitions ---

export interface FileItem {
    Key: string;
    LastModified: string;
    ETag: string;
    Size: number;
    StorageClass: string;
    [key: string]: any;
}

export interface FolderItem {
    Prefix: string;
}

export interface ListResponse {
    Name: string;
    Prefix: string;
    MaxKeys: number;
    CommonPrefixes?: FolderItem[];
    Contents?: FileItem[];
    [key: string]: any;
}

// --- API Service ---

const fetchJson = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const config = getCurrentConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        }
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            throw new Error('Invalid JSON response');
        }
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const FileAPI = {
    async getData(path: string): Promise<ListResponse> {
        const config = getCurrentConfig();
        const endpoint = API_ENDPOINTS.FILE.GET_DATA || '';
        // If there's an endpoint, use it. Otherwise fall back to base URL.
        const baseUrl = endpoint ? `${config.FILE_SERVICE}${endpoint}` : config.FILE_SERVICE;

        return fetchJson<ListResponse>(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: path })
        });
    },

    async readData(key: string): Promise<Blob | any> {
        const config = getCurrentConfig();
        const url = `${config.FILE_SERVICE}/read_data`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: key })
        });

        if (!res.ok) throw new Error("Failed to read file");

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        return res.blob();
    },

    /**
     * 读取文本文件内容
     * @param path 文件路径
     * @returns 文件文本内容
     */
    async readTextFile(path: string): Promise<string> {
        const config = getCurrentConfig();
        const url = `${config.FILE_SERVICE}/read_data`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: path }),
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error(`Failed to read file: ${res.statusText}`);
            }

            // 尝试解析 JSON 响应
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const jsonData = await res.json();
                // 如果返回的是 {data: "内容"} 格式
                if (jsonData.data !== undefined) {
                    return jsonData.data;
                }
                // 如果返回的是其他 JSON 格式,转换为字符串
                return JSON.stringify(jsonData, null, 2);
            }

            // 否则直接读取文本
            return await res.text();
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },

    getImageUrl(path: string): string {
        const config = getCurrentConfig();
        // Ensure path doesn't start with / to avoid double slashes
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${config.OBJECT_STORAGE.BASE_URL}/${config.OBJECT_STORAGE.BUCKET_NAME}/${cleanPath}`;
    },

    async uploadFile(file: File, path: string): Promise<any> {
        const config = getCurrentConfig();
        const url = `${config.FILE_SERVICE}/wenjian_data`;

        // 将文件转换为Base64
        const base64Content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // 移除 data:*/*;base64, 前缀
                const parts = result.split(',');
                const base64 = parts[1];
                if (!base64) {
                    reject(new Error('Failed to convert file to base64'));
                    return;
                }
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const requestData = {
            fileName: `${path}${file.name}`,
            content: base64Content,
            encoding: 'base64'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT * 5); // 5x timeout for uploads

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error(`Upload failed: ${res.statusText}`);
            }

            const result = await res.json();

            if (result.code !== 0) {
                throw new Error(result.message || '上传失败');
            }

            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Upload timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },

    async createFile(filePath: string, content: string): Promise<any> {
        const config = getCurrentConfig();
        const url = `${config.FILE_SERVICE}/add_data`;

        const requestData = {
            fileName: filePath,
            content: content
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error(`Create file failed: ${res.statusText}`);
            }

            const result = await res.json();

            if (result.code !== 0) {
                throw new Error(result.message || '创建文件失败');
            }

            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },

    async createFolder(folderPath: string): Promise<any> {
        const config = getCurrentConfig();
        const url = `${config.FILE_SERVICE}/add_data`;

        const requestData = {
            fileName: folderPath,
            content: '_#'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error(`Create folder failed: ${res.statusText}`);
            }

            const result = await res.json();

            if (result.code !== 0) {
                throw new Error(result.message || '创建文件夹失败');
            }

            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },

    async deleteFile(filePath: string): Promise<any> {
        const config = getCurrentConfig();
        const url = `${config.FILE_SERVICE}/del_data`;

        const requestData = {
            fileName: filePath
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error(`Delete failed: ${res.statusText}`);
            }

            const result = await res.json();

            if (result.code !== 0) {
                throw new Error(result.message || '删除失败');
            }

            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
}


export const AuthAPI = {
    // Key for storing user in localStorage
    STORAGE_KEY: 'terminal_login_user',

    login(username: string): void {
        localStorage.setItem(this.STORAGE_KEY, username);
    },

    logout(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    getCurrentUser(): string | null {
        return localStorage.getItem(this.STORAGE_KEY);
    },

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }
}

export const CloudSyncAPI = {
    ENDPOINT: 'https://lt20czhfj3.hzh.sealos.run/macos_web_data_new',

    async save(key: string, value: any): Promise<void> {
        try {
            // Encode value to Base64
            const encodedValue = btoa(unescape(encodeURIComponent(JSON.stringify(value))));

            await fetchJson(this.ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'save',
                    key,
                    value: encodedValue
                })
            });
        } catch (error) {
            console.error('Failed to sync to cloud:', error);
            throw error;
        }
    },

    async get(key: string): Promise<any> {
        try {
            const res = await fetchJson<{ code: number, data: any }>(this.ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'get',
                    key
                })
            });

            if (res.code === 0 && res.data) {
                const item = res.data;
                if (item.value) {
                    let decodedValue = '';
                    try {
                        decodedValue = decodeURIComponent(escape(atob(item.value)));
                        return JSON.parse(decodedValue);
                    } catch {
                        return decodedValue; // fallback to string
                    }
                }
            }
            return null;
        } catch (error) {
            console.error(`Failed to fetch key ${key} from cloud:`, error);
            // Don't throw, just return null so caller can handle empty state
            return null;
        }
    },

    async list(): Promise<any[]> {
        try {
            const res = await fetchJson<{ code: number, data: any[] }>(this.ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'list'
                })
            });

            if (res.code === 0 && Array.isArray(res.data)) {
                return res.data.map(item => {
                    try {
                        if (item.value) {
                            const decodedValue = decodeURIComponent(escape(atob(item.value)));
                            // Try parsing JSON if possible, otherwise return string
                            try {
                                item.parsedValue = JSON.parse(decodedValue);
                            } catch {
                                item.parsedValue = decodedValue;
                            }
                            item.rawValue = decodedValue; // The string representation
                        }
                    } catch (e) {
                        console.warn(`Failed to decode value for key ${item.key}`, e);
                    }
                    return item;
                });
            }
            return [];
        } catch (error) {
            console.error('Cloud synchronization failed:', error);
            throw error;
        }
    }
}
