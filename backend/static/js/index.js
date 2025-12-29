
function createFloatingSocialIcons(iconCount = 30, options = {}) {
    // Default options
    const config = {
        container: document.body, // Container to append icons to
        colors: ['#1877F2', '#1DA1F2', '#E4405F', '#00ff5eff', '#FF0000', '#0A66C2', '#5865F2', '#000000', '#FF4500', '#00ffc3ff', '#FFD700'],
        animationDuration: { min: 25, max: 45 }, // Animation duration range in seconds
        sizeRange: { min: 50, max: 50 }, // Icon size range in pixels
        opacityRange: { min: 0.1, max: 0.5 }, // Opacity range
        ...options
    };

    // Social media icons with their brands and FontAwesome classes
    const socialIcons = [
        { name: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877F2' },
        { name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
        { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
        { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
        { name: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0A66C2' },
        { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2' },
        { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
        { name: 'Snapchat', icon: 'fab fa-snapchat-ghost', color: '#FFFC00' },
        { name: 'Pinterest', icon: 'fab fa-pinterest-p', color: '#E60023' },
        { name: 'Reddit', icon: 'fab fa-reddit-alien', color: '#FF4500' },
        { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954' },
        { name: 'Telegram', icon: 'fab fa-telegram', color: '#26A5E4' },
        { name: 'Twitch', icon: 'fab fa-twitch', color: '#9146FF' },
        { name: 'Slack', icon: 'fab fa-slack', color: '#4A154B' },
        { name: 'Behance', icon: 'fab fa-behance', color: '#1769FF' },
        { name: 'Dribbble', icon: 'fab fa-dribbble', color: '#EA4C89' },
        { name: 'GitHub', icon: 'fab fa-github', color: '#181717' },
        { name: 'Medium', icon: 'fab fa-medium', color: '#000000' },
        { name: 'Skype', icon: 'fab fa-skype', color: '#00AFF0' },
        { name: 'Vimeo', icon: 'fab fa-vimeo-v', color: '#1AB7EA' },
        { name: 'Weibo', icon: 'fab fa-weibo', color: '#DF2029' },
        { name: 'Apple', icon: 'fab fa-apple', color: '#000000' },
        { name: 'Android', icon: 'fab fa-android', color: '#3DDC84' },
        { name: 'Windows', icon: 'fab fa-windows', color: '#0078D6' }
    ];

    // Create container for icons
    const container = document.createElement('div');
    container.className = 'floating-social-icons';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: ${config.opacityRange.max * 0.7};
        overflow: hidden;
    `;

    // Add CSS animation keyframes if not already present
    if (!document.querySelector('#floating-icons-animation')) {
        const style = document.createElement('style');
        style.id = 'floating-icons-animation';
        style.textContent = `
            @keyframes floatAndRotate {
                0% { 
                    transform: translate(0, 0) rotate(0deg) scale(1); 
                    opacity: 0.6; 
                }
                25% { 
                    transform: translate(${Math.random() * 100 - 50}px, -30px) rotate(90deg) scale(1.1); 
                    opacity: 0.8; 
                }
                50% { 
                    transform: translate(${Math.random() * 100 - 50}px, 0) rotate(180deg) scale(1); 
                    opacity: 0.7; 
                }
                75% { 
                    transform: translate(${Math.random() * 100 - 50}px, 30px) rotate(270deg) scale(0.9); 
                    opacity: 0.8; 
                }
                100% { 
                    transform: translate(0, 0) rotate(360deg) scale(1); 
                    opacity: 0.6; 
                }
            }
            
            .floating-icon {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
            }
            
            .floating-icon:hover {
                opacity: 1 !important;
                transform: scale(1.2) !important;
                filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
                z-index: 10 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Create icons
    for (let i = 0; i < iconCount; i++) {
        const randomSocial = socialIcons[Math.floor(Math.random() * socialIcons.length)];
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.title = randomSocial.name;

        // Random properties
        const size = config.sizeRange.min + Math.random() * (config.sizeRange.max - config.sizeRange.min);
        const duration = config.animationDuration.min + Math.random() * (config.animationDuration.max - config.animationDuration.min);
        const delay = Math.random() * 30;
        const opacity = config.opacityRange.min + Math.random() * (config.opacityRange.max - config.opacityRange.min);
        const color = randomSocial.color || config.colors[Math.floor(Math.random() * config.colors.length)];

        // Create icon element
        const iconElement = document.createElement('i');
        iconElement.className = randomSocial.icon;
        iconElement.style.cssText = `
            font-size: ${size * 0.6}px;
            color: ${color};
        `;

        // Set icon styles
        icon.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: rgba(${hexToRgb(color)}, 0.1);
            border: 1px solid rgba(${hexToRgb(color)}, 0.2);
            animation: floatAndRotate ${duration}s infinite linear;
            animation-delay: ${delay}s;
            opacity: ${opacity};
            z-index: ${Math.floor(Math.random() * 5) + 1};
        `;

        // Add mouse interaction
        icon.addEventListener('mouseenter', function () {
            this.style.animationPlayState = 'paused';
            this.style.cursor = 'pointer';
        });

        icon.addEventListener('mouseleave', function () {
            this.style.animationPlayState = 'running';
        });

        // Click to bring to front temporarily
        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            this.style.zIndex = '100';
            this.style.animationDuration = '0.5s';
            this.style.opacity = '1';

            setTimeout(() => {
                this.style.animationDuration = '';
                this.style.opacity = opacity;
                this.style.zIndex = Math.floor(Math.random() * 5) + 1;
            }, 1000);
        });

        icon.appendChild(iconElement);
        container.appendChild(icon);
    }

    // Add container to DOM
    config.container.appendChild(container);

    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '255, 255, 255';
    }

    // Return cleanup function
    return function removeIcons() {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    };
}

createFloatingSocialIcons();

class DownloadWebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectInterval = 3000;
        this.isConnected = false;
        this.messageHandlers = new Map();
        this.downloadCallbacks = new Map(); // downloadId -> callback functions

        this.connect();
        this.setupMessageHandlers();
    }

    startPolling(downloadId) {
        console.log(`Starting poll for ${downloadId}`);
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}/progress/${downloadId}/`);
                if (response.ok) {
                    const progress = await response.json();

                    // Check if download is already finished before updating
                    if (window.activeDownloads && window.activeDownloads.has(downloadId)) {
                        const currentData = window.activeDownloads.get(downloadId);
                        if (currentData?.progressData?.status === 'finished') {
                            console.log(`Polling stopped for ${downloadId} - already finished`);
                            clearInterval(pollInterval);
                            return;
                        }
                    }

                    this.handleDownloadUpdate(downloadId, progress);

                    // Stop polling if download finished/error
                    if (['finished', 'error', 'cancelled', 'paused'].includes(progress.status)) {
                        console.log(`Stopping poll for ${downloadId} - status: ${progress.status}`);
                        clearInterval(pollInterval);

                        // Force history refresh
                        if (typeof loadHistoryDownloads === 'function') {
                            setTimeout(() => loadHistoryDownloads(), 500);
                        }
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
                // Stop polling on error
                clearInterval(pollInterval);
            }
        }, 1000); // Poll every second

        return pollInterval;
    }


    connect() {
        try {
            this.ws = new WebSocket('ws://127.0.0.1:65534/ws/status/');

            this.ws.onopen = () => {
                console.log('Download WebSocket connected');
                this.isConnected = true;
                this.onConnected();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.ws.onclose = () => {
                console.log('Download WebSocket disconnected');
                this.isConnected = false;
                setTimeout(() => this.connect(), this.reconnectInterval);
            };

            this.ws.onerror = (error) => {
                console.error('Download WebSocket error:', error);
            };

        } catch (error) {
            console.error('Download WebSocket connection failed:', error);
        }
    }

    setupMessageHandlers() {
        // Handle individual download updates
        this.messageHandlers.set('download_update', (data) => {
            this.handleDownloadUpdate(data.download_id, data.progress);
        });

        // Handle bulk download progress
        this.messageHandlers.set('download_progress', (data) => {
            this.handleAllDownloads(data.downloads || {});
        });

        // Handle full status (includes downloads)
        this.messageHandlers.set('full_status', (data) => {
            this.handleAllDownloads(data.downloads || {});
        });

        // Handle status updates (includes downloads)
        this.messageHandlers.set('status_update', (data) => {
            this.handleAllDownloads(data.downloads || {});
        });
    }

    handleMessage(data) {
        const handler = this.messageHandlers.get(data.type);
        if (handler) {
            handler(data);
        }
    }

    // Handle individual download update
    handleDownloadUpdate(downloadId, progress) {
        // Same UI update logic for both sources
        this.updateDownloadUI(downloadId, progress);

        // Call any registered callbacks
        if (this.downloadCallbacks.has(downloadId)) {
            this.downloadCallbacks.get(downloadId).forEach(callback => {
                callback(progress);
            });
        }
    }
    // Handle all active downloads
    handleAllDownloads(downloads) {
        for (const [downloadId, progress] of Object.entries(downloads)) {
            this.updateDownloadUI(downloadId, progress);
        }
    }

    // Update the UI for a specific download
    // Update the UI for a specific download
    updateDownloadUI(downloadId, progress) {
        // DEBUG: Log what we're receiving
        console.log(`Update for ${downloadId}:`, progress.status, progress.percent);
        console.log(window.activeDownloads)

        // Find the download element in your manager
        const downloadElement = document.querySelector(`[data-download-id="${downloadId}"]`);

        if (downloadElement) {
            this.updateRealDownloadProgress(downloadElement, progress);

            // Update activeDownloads map - but check if it's finished first
            if (window.activeDownloads && window.activeDownloads.has(downloadId)) {
                const downloadInfo = window.activeDownloads.get(downloadId);

                // IMPORTANT: Don't update if it's already marked as finished
                if (downloadInfo?.progressData?.status === 'finished') {
                    console.log(`Skipping update for ${downloadId} - already finished`);
                    return;
                }

                // Update the progress data
                const updatedInfo = {
                    ...downloadInfo,
                    progressData: progress
                };
                window.activeDownloads.set(downloadId, updatedInfo);

                // Update highlighted info if this is the current highlighted download
                if (window.currentHighlightedDownload === downloadId) {
                    this.updateHighlightedInfo(downloadId, updatedInfo, progress);
                }
            } else if (progress.status !== 'finished') {
                // If not in activeDownloads and not finished, it might be a new download
                console.log(`Download ${downloadId} not in activeDownloads but status is ${progress.status}`);
            }

            // Handle download completion - do this LAST
            if (progress.status === 'finished') {
                console.log(`Handling completion for ${downloadId}`);
                // Use setTimeout to ensure UI updates first
                setTimeout(() => {
                    this.handleDownloadCompletion(downloadId, progress);
                }, 100);
            }

            // Handle download errors
            if (progress.status === 'error') {
                this.handleDownloadError(downloadId, progress);
            }
        } else if (progress.status !== 'finished') {
            // If no element exists and it's not finished, log it
            console.log(`No element found for ${downloadId}, status: ${progress.status}`);
        }
    }

    // Use your existing progress update function
    updateRealDownloadProgress(element, progress) {
        const progressFill = element.querySelector('.new-progress-fill');
        const speedEl = element.querySelector('.stat-value:nth-child(1)');
        const etaEl = element.querySelector('.stat-value:nth-child(2)');
        const percentageEl = element.querySelector('.percentage-display');
        const filenameEl = element.querySelector('.download-filename');

        if (progressFill && progress.percent !== undefined) {
            progressFill.style.width = `${progress.percent}%`;
        }

        if (percentageEl && progress.percent !== undefined) {
            percentageEl.textContent = `${Math.round(progress.percent)}%`;
        }

        if (speedEl && progress.speed) {
            const speedMB = (progress.speed / (1024 * 1024)).toFixed(1);
            speedEl.textContent = `${speedMB} MiB/s`;
        } else if (speedEl && progress.status === 'downloading') {
            speedEl.textContent = '0 MiB/s';
        }

        if (etaEl && progress.eta) {
            const minutes = Math.floor(progress.eta / 60);
            const seconds = progress.eta % 60;
            etaEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else if (etaEl && progress.status === 'downloading') {
            etaEl.textContent = '--:--';
        }

        if (filenameEl && progress.filename) {
            const filename = progress.filename.split('/').pop() || progress.filename;
            filenameEl.textContent = filename;
        }
    }

    updateHighlightedInfo(downloadId, downloadInfo, progress) {
        // Use your existing function
        if (typeof window.updateHighlightedInfo === 'function') {
            window.updateHighlightedInfo(downloadId, downloadInfo, progress);
        }
    }

    handleDownloadCompletion(downloadId, progress) {
        // Remove from active downloads IMMEDIATELY
        if (window.activeDownloads && window.activeDownloads.has(downloadId)) {
            window.activeDownloads.delete(downloadId);
            console.log(downloadId, " Removed (finished)");
            console.log(window.activeDownloads);
        }

        // Remove the element from UI
        const element = document.querySelector(`[data-download-id="${downloadId}"]`);
        if (element && element.parentNode) {
            element.remove();
        }

        // Clear highlighted info if this was the highlighted download
        if (window.currentHighlightedDownload === downloadId) {
            if (typeof window.hideHighlightedInfo === 'function') {
                window.hideHighlightedInfo();
            }
        }

        // Update the icon status
        if (typeof window.updateMediaAndDownloadStatus === 'function') {
            window.updateMediaAndDownloadStatus();
        }

        // Refresh history to show completed download
        setTimeout(() => {
            if (typeof window.loadHistoryDownloads === 'function') {
                window.loadHistoryDownloads();
            }
        }, 1000);
    }

    handleDownloadError(downloadId, progress) {
        const element = document.querySelector(`[data-download-id="${downloadId}"]`);
        if (element) {
            element.classList.add('error');

            const progressFill = element.querySelector('.new-progress-fill');
            if (progressFill) {
                progressFill.style.background = 'linear-gradient(45deg, #ff4444, #ff8888, #ff4444)';
            }

            const speedEl = element.querySelector('.stat-value:nth-child(1)');
            const etaEl = element.querySelector('.stat-value:nth-child(2)');
            if (speedEl) speedEl.textContent = 'Failed';
            if (etaEl) etaEl.textContent = '--:--';
        }
    }

    cleanupFinishedDownloads() {
        if (!window.activeDownloads || window.activeDownloads.size === 0) return;

        const toDelete = [];

        // Find all finished downloads
        for (const [downloadId, downloadData] of window.activeDownloads.entries()) {
            if (downloadData?.progressData?.status === 'finished') {
                toDelete.push(downloadId);
            }
        }

        // Remove finished downloads
        toDelete.forEach(downloadId => {
            console.log(`Cleanup removing ${downloadId}`);
            this.handleDownloadCompletion(downloadId, { status: 'finished' });
        });

        if (toDelete.length > 0) {
            console.log(`Cleaned up ${toDelete.length} finished downloads`);
        }
    }

    // And add this to your onConnected method:
    onConnected() {
        // Request initial download status
        this.requestDownloadStatus();

        // Clean up any lingering finished downloads first
        this.cleanupFinishedDownloads();

        // Start polling for active downloads only
        if (window.activeDownloads && window.activeDownloads.size > 0) {
            window.activeDownloads.forEach((info, downloadId) => {
                // Only poll if not already finished
                if (info?.progressData?.status !== 'finished') {
                    this.startPolling(downloadId);
                }
            });
        }
    }

    // Method to request specific download info
    requestDownloadStatus() {
        if (this.isConnected) {
            this.ws.send(JSON.stringify({
                type: 'get_downloads'
            }));
        }
    }

    // Register callback for specific download
    registerDownloadCallback(downloadId, callback) {
        if (!this.downloadCallbacks.has(downloadId)) {
            this.downloadCallbacks.set(downloadId, []);
        }
        this.downloadCallbacks.get(downloadId).push(callback);
    }

    // Unregister callback
    unregisterDownloadCallback(downloadId, callback) {
        if (this.downloadCallbacks.has(downloadId)) {
            const callbacks = this.downloadCallbacks.get(downloadId);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}

window.getCSRFToken = () => {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}


window.ClearNyxPath = async () => {
    try {
        await fetch(`${BASE_URL}/clearnyxpath/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ path: extractFilePathFromURL(OriginalSourcePath) })
        });
        showNotification("Path Cleared");
    } catch {
        showNotification("Clearing Path gone Wrong");
    }
}



window.ClearNyx = async (path) => {
    try {
        await fetch(`${BASE_URL}/siba/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ path: path })

        });
    } catch (e) {
        console.log(e)
        showNotification("Clearing Path gone Wrong");
    }
}

let clickSoundRightNow = ['click-sound1', 'click-sound2', 'click-sound3', 'click-sound4']
let choosenSoundPlayClickSound = clickSoundRightNow[Math.floor(Math.random() * clickSoundRightNow.length)]
window.playClickSound = function () {
    const clickSound = document.getElementById(`${choosenSoundPlayClickSound}`);
    if (clickSound) {
        const sound = clickSound.cloneNode();
        sound.volume = 1;
        sound.play().catch(() => { });
    }
}


function playErrorSound() {
    const clickSound = document.getElementById('error-sound');
    if (clickSound) {
        const sound = clickSound.cloneNode();
        sound.volume = 1;
        sound.play().catch(() => { });
    }
}




let setDImage = 'downg.png';
const BASE_URL = "http://127.0.0.1:65534"
const SOCKET_URL = 'ws://127.0.0.1:65534/ws/status/'
document.addEventListener('DOMContentLoaded', function () {

    window.filterRequestCount = 0
    // Add this CSS to your document
    if (!document.getElementById('rectangle-zoom-styles')) {
        const style = document.createElement('style');
        style.id = 'rectangle-zoom-styles';
        style.textContent = `
            .zoom-rectangle {
                position: absolute;
                border: 2px solid #00ffff;
                background: rgba(0, 255, 255, 0.1);
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                border-radius: 2px;
            }
            
            .zoom-rectangle::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 1px dashed #00ffff;
                pointer-events: none;
            }
            
            .zoom-rectangle-hint {
                position: absolute;
                background: rgba(0, 20, 40, 0.9);
                color: #00ffff;
                padding: 0.5rem;
                font-family: 'Orbitron', monospace;
                font-size: 0.7rem;
                border: 1px solid #00ffff;
                border-radius: 4px;
                pointer-events: none;
                z-index: 1001;
            }
            
            .zoom-cursor {
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(style);
    }

    window.formatTime = (seconds) => {
        if (seconds < 0) return "00H:00M:00S";

        let h = Math.floor(seconds / 3600);
        let m = Math.floor((seconds % 3600) / 60);
        let s = seconds % 60;

        // Format with leading zeros
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        const ss = s.toString().padStart(2, "0");

        return `${hh}SAH:${mm}MIN:${parseInt(ss)}SEG`;
    }
    window.downloadWebSocket = new DownloadWebSocketManager();

    // Remove the old progress interval since we're using WebSocket now
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
        window.progressInterval = null;
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === " ") {
            const target = e.target;

            // Only prevent if the focused element is a button, link, or role="button"
            const focusable = (
                target.tagName === 'BUTTON' ||
                (target.tagName === 'A' && target.hasAttribute('href')) ||
                target.getAttribute('role') === 'button'
            );

            if (focusable) {
                e.preventDefault(); // disables Spacebar click
            }
        }
    });

    // Download manager state
    window.activeDownloads = new Map(); // downloadId -> {element, formatInfo, progressData}
    const completedDownloads = new Map(); // downloadId -> {element, formatInfo, progressData}
    let downloadCounter = 1;
    let progressInterval;
    let currentHighlightedDownload = null;

    // Context menu state
    let contextMenu = null;
    let currentContextDownload = null;

    window.gestureSpamCounter = {
        'POINT_LEFT': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        'POINT_RIGHT': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        'FIST': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        'OPEN': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        '4_FINGERS': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        'PEACE': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        'PINCH_ROTATE': { count: 0, lastTime: 0, blocked: false, floodStart: 0 },
        'BOTH_HANDS': { count: 0, lastTime: 0, blocked: false, floodStart: 0 }, // New key for both hands play/pause
        'PUSH': { count: 0, lastTime: 0, blocked: false, floodStart: 0 }, // NEW: for push gesture
        'PULL': { count: 0, lastTime: 0, blocked: false, floodStart: 0 }  // NEW: for pull gesture
    };

    // Track rotation state
    window.rotationState = {
        left: { lastRotation: 0, lastGesture: '', lastTime: 0 },
        right: { lastRotation: 0, lastGesture: '', lastTime: 0 },
        lastPinchRotationTime: 0,
        isPinchRotating: false,
        rotationCooldownEnd: 0,
        bothHandsVisible: false,
        bothHandsCooldown: 0
    };

    // Track push/pull state
    window.pushPullState = {
        lastPushTime: 0,
        lastPullTime: 0,
        pushCooldown: 1000, // 500ms cooldown between push gestures
        pullCooldown: 1000, // 500ms cooldown between pull gestures
        minIntensity: 0.7, // Minimum intensity threshold
        lastIntensity: 0
    };

    // ADD THIS FUNCTION:
    function getNextDownloadNumber() {
        const allItems = document.querySelectorAll('.download-item');
        const numbers = Array.from(allItems).map(item => {
            const numText = item.querySelector('.download-number').textContent;
            return parseInt(numText) || 0;
        });

        if (numbers.length === 0) return 1;

        const maxNumber = Math.max(...numbers);
        return maxNumber + 1; // Simply increment by 1
    }


    window.loadHistoryDownloads = async function () {
        try {
            const response = await fetch(`${BASE_URL}/history/`);
            await fetch(`${BASE_URL}/generate-thumbnail/`);
            if (!response.ok) return;

            const data = await response.json();
            const history = data.history || [];

            // CLEAR existing items
            document.querySelectorAll('[data-history-id]').forEach(item => item.remove());

            // Add everything fresh
            history.forEach(item => {
                addCompletedDownloadToManager(item);
            });

            // Check if loadHomeDirectory exists before calling
            if (typeof window.loadHomeDirectory === 'function') {
                window.loadHomeDirectory();
            } else {
                console.warn('loadHomeDirectory not available yet');
            }

            const emptyState = document.getElementById('empty-state');
            if (emptyState) {
                const totalDownloads = document.querySelectorAll('.download-item').length;
                emptyState.style.display = totalDownloads === 0 ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };




    // Load history on startup
    loadHistoryDownloads();
    // Refresh history every 30 seconds
    // Real download progress tracking

    function removeFromActiveDownloads(downloadId, downloadInfo, progress) {
        // Remove from active downloads
        activeDownloads.delete(downloadId);
        // Remove the element from the UI
        const element = downloadInfo.element;
        if (element && element.parentNode) {
            element.remove();
        }

        // Clear highlighted info if this was the highlighted download
        if (currentHighlightedDownload === downloadId) {
            hideHighlightedInfo();
        }

        console.log(`Download ${downloadId} finished, waiting for history to appear...`);

        // The download will appear in the history via loadHistoryDownloads
        // which runs every 30 seconds (or you can trigger it manually)
    }

    function markDownloadAsError(downloadId, downloadInfo, progress) {
        // Keep in active downloads but mark as error
        const element = downloadInfo.element;
        element.classList.add('error');

        // Update progress bar to show error state
        const progressFill = element.querySelector('.new-progress-fill');
        if (progressFill) {
            progressFill.style.background = 'linear-gradient(45deg, #ff4444, #ff8888, #ff4444)';
        }

        // Update stats to show error
        const speedEl = element.querySelector('.stat-value:nth-child(1)');
        const etaEl = element.querySelector('.stat-value:nth-child(2)');
        if (speedEl) speedEl.textContent = 'Failed';
        if (etaEl) etaEl.textContent = '--:--';
    }

    function updateRealDownloadProgress(element, progress) {
        const progressFill = element.querySelector('.new-progress-fill');
        const speedEl = element.querySelector('.stat-value:nth-child(1)');
        const etaEl = element.querySelector('.stat-value:nth-child(2)');
        const percentageEl = element.querySelector('.percentage-display');
        const filenameEl = element.querySelector('.download-filename');

        if (progressFill && progress.percent !== undefined) {
            progressFill.style.width = `${progress.percent}%`;
        }

        if (percentageEl && progress.percent !== undefined) {
            percentageEl.textContent = `${Math.round(progress.percent)}%`;
        }

        if (speedEl && progress.speed) {
            const speedMB = (progress.speed / (1024 * 1024)).toFixed(1);
            speedEl.textContent = `${speedMB} MiB/s`;
        } else if (speedEl && progress.status === 'downloading') {
            speedEl.textContent = '0 MiB/s';
        }

        if (etaEl && progress.eta) {
            const minutes = Math.floor(progress.eta / 60);
            const seconds = progress.eta % 60;
            etaEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else if (etaEl && progress.status === 'downloading') {
            etaEl.textContent = '--:--';
        }

        if (filenameEl && progress.filename) {
            // Extract just the filename from the full path
            const filename = progress.filename.split('/').pop() || progress.filename;
            filenameEl.textContent = filename;
        }
    }

    function updateHighlightedInfo(downloadId, downloadInfo, progress) {
        const titleEl = document.getElementById('real-download-title');
        const filenameEl = document.getElementById('real-download-filename');
        const sizeEl = document.getElementById('real-download-size');
        const statusEl = document.getElementById('real-download-status');
        const speedEl = document.getElementById('real-download-speed');
        const etaEl = document.getElementById('real-download-eta');
        const formatEl = document.getElementById('real-download-format');
        const progressEl = document.getElementById('real-download-progress');

        if (titleEl) {
            titleEl.textContent = `${downloadInfo.formatInfo.isAudio ? 'Audio' : 'Video'} Download`;
        }

        // Use the actual file path from progress
        let displayFilename = '';
        let displaySize = '? MB / ? MB';

        if (progress.filename) {
            displayFilename = progress.filename.split('/').pop() || progress.filename;
        }

        if (filenameEl) {
            filenameEl.textContent = displayFilename;
        }

        if (sizeEl) {
            const downloadedMB = progress.downloaded_bytes ? (progress.downloaded_bytes / (1024 * 1024)).toFixed(1) : 0;
            const totalMB = progress.total_bytes ? (progress.total_bytes / (1024 * 1024)).toFixed(1) : '?';
            sizeEl.textContent = `${downloadedMB} MiB / ${totalMB} MiB Zibura`;
        }

        if (statusEl) {
            statusEl.textContent = progress.status ? progress.status.charAt(0).toUpperCase() + progress.status.slice(1) : 'Unknown';
            // Add color coding for status
            if (progress.status === 'downloading') {
                statusEl.style.color = '';
            } else if (progress.status === 'error') {
                statusEl.style.color = '#ff4444';
            } else if (progress.status === 'finished') {
                statusEl.style.color = '#00ffff';
            } else {
                statusEl.style.color = '#ffff00';
            }
        }

        if (speedEl && progress.speed) {
            const speedMB = (progress.speed / (1024 * 1024)).toFixed(1);
            speedEl.textContent = `${speedMB} MiB/s`;
        } else {
            speedEl.textContent = '0 MiB/s';
        }

        if (etaEl && progress.eta) {
            const minutes = Math.floor(progress.eta / 60);
            const seconds = progress.eta % 60;
            etaEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            etaEl.textContent = '--:--';
        }

        if (formatEl) {
            formatEl.textContent = `${downloadInfo.formatInfo.resolution || 'Ntago Izwi'} - ${downloadInfo.formatInfo.ext}`;
        }

        if (progressEl) {
            progressEl.textContent = `${Math.round(progress.percent || 0)}%`;
        }
    }

    function showHighlightedInfo(downloadId, downloadInfo, progress) {
        currentHighlightedDownload = downloadId;
        document.body.setAttribute("data-highlight-info", "real-download");
        updateHighlightedInfo(downloadId, downloadInfo, progress);
    }

    function hideHighlightedInfo() {
        currentHighlightedDownload = null;
        document.body.setAttribute("data-highlight-info", "");
    }

    function addDownloadToManager(downloadId, formatInfo) {
        // Check if download already exists
        if (activeDownloads.has(downloadId)) {
            return activeDownloads.get(downloadId).element;
        }

        // Hide empty state
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'none';

        const downloadNumber = getNextDownloadNumber();
        const downloadElement = document.createElement('div');
        downloadElement.className = 'download-item active';
        downloadElement.setAttribute('data-download-id', downloadId);

        // Check if it's a torrent download
        const isTorrent = formatInfo.isTorrent || formatInfo.ext === 'torrent' || formatInfo.protocol === 'bittorrent' || formatInfo.format_id === 'torrent';

        // Set torrent-specific styling
        if (isTorrent) {
            downloadElement.classList.add('torrent-download');
            downloadElement.style.borderLeft = '4px solid #ff922b';
        }

        // Get filename/title for display
        let filename = formatInfo.resolution || 'Res Ntizwi';
        if (isTorrent && formatInfo.torrent_info?.name) {
            filename = formatInfo.torrent_info.name;
        } else if (isTorrent && formatInfo.title) {
            filename = formatInfo.title;
        }

        // Get type label
        let typeLabel = formatInfo.isAudio ? 'Audio' : 'Video';
        if (isTorrent) {
            typeLabel = 'Torrent';
        }

        // Get size for display
        let displaySize = formatInfo.filesize ? humanSize(formatInfo.filesize) : 'Size Ntizwi';
        if (isTorrent && formatInfo.torrent_info?.total_size) {
            displaySize = humanSize(formatInfo.torrent_info.total_size);
        }

        downloadElement.innerHTML = `
    <div class="download-number">${downloadNumber.toString().padStart(2, '0')}</div>
    <div class="download-info">
        <div class="download-filename">${filename}</div>
        <div class="download-details">
            <span>${typeLabel}</span>
            <span>${displaySize}</span>
            ${isTorrent ? `<span style="color:#ff922b;">⚡ Torrent</span>` : ''}
        </div>
    </div>
    <div class="new-progress-container">
        <div class="new-progress-bar">
            <div class="new-progress-fill" style="${isTorrent ? 'background: linear-gradient(90deg, #ff922b, #ffa94d);' : ''}"></div>
            <div class="progress-stats">
                <div class="stat-item">
                    <span class="stat-value">0 MiB/s</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">--:--</span>
                </div>
            </div>
        </div>
    </div>
    <div class="percentage-display">0%</div>
    ${formatInfo.is_direct || isTorrent ? `
        <div class="download-actions" style="cursor: pointer;">
            <img src="static/images/pause.png" style="width: 20px;height: 20px;cursor: pointer;" title="Pause Download">
            <img src="static/images/play.png" style="width: 20px;height: 20px;cursor: pointer;" title="Resume Download">
            <img src="static/images/cancel.png" style="width: 20px;height:20px;cursor: pointer;" title="Cancel Download">
            ${isTorrent ? `<img src="static/images/torrent.png" style="width: 20px;height:20px;margin-left:8px;filter:invert(1);" title="Torrent Download">` : ''}
        </div>
    ` : ''}
`;

        // Add click handler for info display - WITH FIX
        downloadElement.onclick = (e) => {
            // Check if click is on download actions or their children
            if (e.target.closest('.download-actions')) {
                return; // Don't do anything if clicking on actions
            }

            document.querySelectorAll('.download-item').forEach(dl => dl.classList.remove('active'));
            downloadElement.classList.add('active');

            const downloadInfo = activeDownloads.get(downloadId);
            if (downloadInfo) {
                showHighlightedInfo(downloadId, downloadInfo, downloadInfo.progressData || {});
            }
        };

        // Add right-click handler for context menu
        downloadElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, downloadId, null);
        });

        // Add to container
        const container = document.getElementById('real-downloads-container');
        container.appendChild(downloadElement);

        // Add event listeners to action buttons AFTER element is appended
        if (formatInfo.is_direct || isTorrent) {
            const downloadActions = downloadElement.querySelector('.download-actions');
            if (downloadActions) {
                const pauseBtn = downloadActions.querySelector('img[title="Pause Download"]');
                const resumeBtn = downloadActions.querySelector('img[title="Resume Download"]');
                const cancelBtn = downloadActions.querySelector('img[title="Cancel Download"]');

                if (pauseBtn) {
                    pauseBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pauseDownload(downloadId);
                    });
                }

                if (resumeBtn) {
                    resumeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        resumeDownload(downloadId);
                    });
                }

                if (cancelBtn) {
                    cancelBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        cancelDownload(downloadId);
                    });
                }
            }
        }

        // Store download info with torrent flag
        activeDownloads.set(downloadId, {
            element: downloadElement,
            formatInfo: {
                ...formatInfo,
                isTorrent: isTorrent
            },
            progressData: null,
            isTorrent: isTorrent
        });

        // Register WebSocket callback for this download
        if (window.downloadWebSocket) {
            window.downloadWebSocket.registerDownloadCallback(downloadId, (progress) => {
                // This will be called whenever WebSocket receives an update for this download
                updateRealDownloadProgress(downloadElement, progress);

                // Update stored progress data
                activeDownloads.set(downloadId, {
                    ...activeDownloads.get(downloadId),
                    progressData: progress
                });

                // Update highlighted info if this download is currently selected
                if (currentHighlightedDownload === downloadId) {
                    updateHighlightedInfo(downloadId, activeDownloads.get(downloadId), progress);
                }

                // Torrent-specific updates
                if (isTorrent && progress.num_peers !== undefined) {
                    updateTorrentSpecificInfo(downloadElement, progress);
                }
            });
        }

        return downloadElement;
    }

    // Helper function for torrent-specific info updates
    function updateTorrentSpecificInfo(downloadElement, progress) {
        const detailsElement = downloadElement.querySelector('.download-details');
        if (detailsElement && progress.num_peers !== undefined) {
            // Add or update torrent stats
            let torrentStats = detailsElement.querySelector('.torrent-stats');
            if (!torrentStats) {
                torrentStats = document.createElement('span');
                torrentStats.className = 'torrent-stats';
                torrentStats.style.cssText = 'color:#ff922b;margin-left:8px;font-size:11px;';
                detailsElement.appendChild(torrentStats);
            }

            const peers = progress.num_peers || 0;
            const seeds = progress.num_seeds || 0;
            torrentStats.textContent = `👥 ${peers} ⚡ ${seeds}`;
            torrentStats.title = `Peers: ${peers}, Seeds: ${seeds}`;
        }
    }


    // Pause download function - no changes needed, WebSocket will update UI
    window.pauseDownload = async (downloadId) => {
        showNotification("Pausing downloading")
        try {
            const response = await fetch(`${BASE_URL}/pause/${downloadId}/`, {
                method: 'POST'
            });

            if (response.ok) {
                showNotification('Download paused', 'success');
                // UI will update via WebSocket
            } else {
                showNotification('Failed to pause download', 'error');
            }
        } catch (error) {
            showNotification('Error pausing download: ' + error.message, 'error');
        }
    }

    // Resume download function - no changes needed  
    window.resumeDownload = async (downloadId) => {
        showNotification("Resuming downloading")
        try {
            const response = await fetch(`${BASE_URL}/resume/${downloadId}/`, {
                method: 'POST'
            });

            if (response.ok) {
                showNotification('Download resuming...', 'success');
                // UI will update via WebSocket
            } else {
                showNotification('Failed to resume download', 'error');
            }
        } catch (error) {
            showNotification('Error resuming download: ' + error.message, 'error');
        }
    }

    // Cancel download function
    window.cancelDownload = async (downloadId) => {
        showNotification("Canceling downloading")
        try {
            const response = await fetch(`${BASE_URL}/cancel/${downloadId}/`, {
                method: 'POST'
            });

            if (response.ok) {
                showNotification('Download cancelled', 'success');

                // Remove from active downloads immediately
                const downloadItem = document.querySelector(`[data-download-id="${downloadId}"]`);
                if (downloadItem) {
                    downloadItem.remove();
                }
                if (activeDownloads.has(downloadId)) {
                    activeDownloads.delete(downloadId);
                }

                // Unregister WebSocket callback
                if (window.downloadWebSocket) {
                    window.downloadWebSocket.unregisterDownloadCallback(downloadId);
                }
            } else {
                showNotification('Failed to cancel download', 'error');
            }
        } catch (error) {
            showNotification('Error cancelling download: ' + error.message, 'error');
        }
    }


    function addCompletedDownloadToManager(historyItem) {
        // Check if history item already exists
        const existingItem = document.querySelector(`[data-history-id="${historyItem.id}"]`);
        if (existingItem) {
            return existingItem;
        }

        // Hide empty state
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'none';

        // Use stable number instead of incrementing counter
        const downloadNumber = getNextDownloadNumber()
        const downloadElement = document.createElement('div');

        // downloadElement.setAttribute('data-augmented-ui', 'tl-round tr-round bl-round br-round border');
        downloadElement.className = 'download-item finished';
        downloadElement.setAttribute('data-history-id', historyItem.id);

        const formatInfo = historyItem.format_info || {};
        const fileExists = historyItem.file_exists !== false;
        let fileCategory = null
        if (historyItem.format_info.category === 'audio') {
            fileCategory = 'Audio'
        } else if (historyItem.format_info.category === 'video') {
            fileCategory = 'Video'
        } else if (historyItem.format_info.category === 'image') {
            fileCategory = 'Image'
        } else if (historyItem.format_info.category === 'document') {
            fileCategory = 'Document'
        } else if (historyItem.format_info.category === 'archive') {
            fileCategory = 'Archive'
        } else {
            fileCategory = 'Ntizwi'
        }

        downloadElement.innerHTML = `
        <div class="download-number">${downloadNumber.toString().padStart(2, '0')}</div>
        <div class="download-info">
            <div class="download-filename">${historyItem.filename}</div>
            <div class="download-details">
                <span>${fileCategory}</span>
                <span>${historyItem.file_size ? humanSize(historyItem.file_size) : 'Size Ntizwi'}</span>
                <span>${historyItem.created_at ? new Date(historyItem.created_at).toLocaleDateString() : new Date(historyItem.modified).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="new-progress-container">
            <div class="new-progress-bar">
                <div class="new-progress-fill" style="width: 100%; background: transparent;"></div>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-value">Yarangiye</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="percentage-display">
            <img src="static/images/finished.png" width="30">
        </div>
    `;

        let clickTimer = null;
        let activeDownloadItem = null;
        let clickCount = 0;

        downloadElement.onclick = (e) => {
            clickCount++;

            const thumbnailImage = historyItem.format_info.category == "video" || historyItem.format_info.category == 'audio' ? historyItem.filename.replace(/\.[^/.]+$/, "") + ".png" : historyItem.filename;

            // If this is the first click, start a timer
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    // This is a single click (timeout completed before second click)
                    handleSingleClick(downloadElement, historyItem);
                    clickCount = 0; // Reset for next time
                }, 300); // 300ms delay to detect double click
            }

            e.stopPropagation();
        };

        downloadElement.ondblclick = (e) => {
            // Clear the single click timer
            clearTimeout(clickTimer);
            clickCount = 0;
            // Remove any existing download info if it was showing
            if (activeDownloadItem === downloadElement) {

                downloadElement.classList.remove('active');
                activeDownloadItem = null;
            }

            e.stopPropagation();
        };

        // Single click handler function
        function handleSingleClick(downloadElement, historyItem) {
            // Check if this is the same item that's already active
            if (activeDownloadItem === downloadElement) {
                // If it's the same item, hide the info and remove active state
                downloadElement.classList.remove('active');
                activeDownloadItem = null;
            } else {
                // Remove highlight from all items
                document.querySelectorAll('.download-item').forEach(dl => dl.classList.remove('active'));
                // Highlight current item
                downloadElement.classList.add('active');

                // Show download information instead of history info
                showDownloadItemInformation(historyItem);

                // Set this as the active item
                activeDownloadItem = downloadElement;
            }
        }

        // Also need to handle clicks outside to hide the info
        document.addEventListener('click', function (event) {
            // Check if the clicked element is inside any of the download info divs
            const downloadInfoDivs = document.querySelectorAll('[id^="showdownloaditeminfo-div"]');

            // If there are download info divs visible
            if (downloadInfoDivs.length > 0) {
                let isClickInside = false;

                // Check if the click is inside any of the download info divs
                downloadInfoDivs.forEach(div => {
                    if (div.contains(event.target)) {
                        isClickInside = true;
                    }
                });

                // Also check if the click is on a download-item element
                const isClickOnDownloadItem = event.target.closest('.download-item');

                // If click is outside download info AND not on a download-item, hide the info
                if (!isClickInside && !isClickOnDownloadItem) {
                    hideDownloadItemInformation();

                    // Also remove active class from all download items
                    document.querySelectorAll('.download-item').forEach(dl => dl.classList.remove('active'));
                    activeDownloadItem = null;
                }
            }
        });


        // Add right-click handler for context menu
        downloadElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, null, historyItem);
        });

        // Add double-click to open file
        downloadElement.ondblclick = () => {
            hideDownloadItemInformation();
            if (fileExists && historyItem.download_path) {
                if (historyItem && historyItem.download_path) {
                    // openDownloadedFileFromHistory(historyItem.download_path);
                    let aview = {
                        path: historyItem.download_path,
                        name: historyItem.filename
                    }
                    previewRealFile(aview);
                    if (historyItem.format_info.category === 'video' || historyItem.format_info.category === 'image') showNotification("Kureba " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`);
                    if (historyItem.format_info.category === 'audio') showNotification("Kumva " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`);
                    if (historyItem.format_info.category === 'text') showNotification("Gusoma " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`);
                    openFileExplorer();

                } else if (downloadId) {
                    const downloadInfo = activeDownloads.get(downloadId);
                    if (downloadInfo && downloadInfo.progressData && downloadInfo.progressData.filename) {
                        openDownloadedFile(downloadInfo.progressData.filename);
                    } else {
                        showNotification('File path not available', 'error');
                    }
                }


            } else {
                showNotification('File not found or path missing', 'error');
            }
        };

        // Add to container
        const container = document.getElementById('real-downloads-container');
        container.appendChild(downloadElement);

        return downloadElement;
    }

    function showHistoryItemInfo(historyItem) {
        const formatInfo = historyItem.format_info || {};

        document.getElementById('real-download-title').textContent = 'Completed Download';
        document.getElementById('real-download-filename').textContent = historyItem.filename;
        document.getElementById('real-download-size').textContent = `${humanSize(historyItem.file_size)}`;
        document.getElementById('real-download-status').textContent = 'Completed';
        document.getElementById('real-download-status').style.color = '#00ff00';
        document.getElementById('real-download-speed').textContent = '0 MB/s';
        document.getElementById('real-download-eta').textContent = '00:00';
        document.getElementById('real-download-format').textContent = `${formatInfo.resolution || 'Unknown'} - ${formatInfo.ext || 'Unknown'}`;
        document.getElementById('real-download-progress').textContent = '100%';

        document.body.setAttribute("data-highlight-info", "real-download");
    }

    // Context Menu Functions


    // Context Menu Functions
    function showContextMenu(e, downloadId, historyItem) {
        // Remove existing context menu
        hideContextMenu();
        console.log(historyItem)

        // Prevent default to avoid immediate closing
        e.preventDefault();
        e.stopPropagation();

        // Store context data
        const contextData = { downloadId, historyItem };

        // Create radial menu container
        contextMenu = document.createElement('div');
        contextMenu.className = 'radial-context-menu';
        contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY - 150}px;
        left: ${e.clientX - 100}px;
        width: 300px;
        height: 300px;
        z-index: 10000;
        pointer-events: none;
    `;

        // Create center image (no container)
        const centerImage = document.createElement('img');
        centerImage.src = 'static/images/nyxlogo.png';
        centerImage.className = 'context-center-image';
        centerImage.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        z-index: 100;
        cursor: pointer;
        pointer-events: auto;
        filter: drop-shadow(0 0 5px rgba(0, 219, 222, 0.5));
    `;
        centerImage.onclick = hideContextMenu;

        // Menu items configuration
        const menuItems = [
            {
                action: 'openFile',
                icon: 'static/images/player.png',
                label: 'Reba',
                color: '#00fbffff'
            },
            {
                action: 'openPath',
                icon: 'static/images/open-folder.png',
                label: 'Fungura',
                color: '#00dbde'
            },
            {
                action: 'rename',
                icon: 'static/images/rename.png',
                label: 'Hindura izina',
                color: '#00dbde'
            },
            {
                action: 'redownload',
                icon: 'static/images/redownload.png',
                label: `${historyItem.can_redownload ? 'Ongera Uyizane' : 'Ntago Wakongera Kuyizana'}`,
                color: `${historyItem.can_redownload ? '#00ff44' : 'rgba(255, 0, 128, 1)'}`
            },
            {
                action: 'delete',
                icon: 'static/images/attention.png',
                label: 'Siba',
                color: '#ff002b'
            }
        ];

        // Create hexagon menu items
        const radius = 100;
        menuItems.forEach((item, index) => {
            const angle = (index * (360 / menuItems.length)) * (Math.PI / 180);
            const x = Math.cos(angle) * radius + 150;
            const y = Math.sin(angle) * radius + 150;

            const hexagonItem = createHexagonItem(item, x, y, index, contextData);
            contextMenu.appendChild(hexagonItem);

            // Animate in
            setTimeout(() => {
                hexagonItem.style.opacity = "1";
                hexagonItem.style.pointerEvents = "auto";
                hexagonItem.style.transform = "scale(1)";
                hexagonItem.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
            }, 100 + (index * 100));
        });

        // Add center image
        contextMenu.appendChild(centerImage);
        document.body.appendChild(contextMenu);

        // Add animation for center image
        setTimeout(() => {
            centerImage.style.transition = "transform 0.5s ease";
            centerImage.style.transform = "translate(-50%, -50%) rotate(360deg)";
            setTimeout(() => {
                centerImage.style.transform = "translate(-50%, -50%) rotate(0deg)";
            }, 500);
        }, 50);

        // Add styles if not already added
        if (!document.querySelector('#radial-context-styles')) {
            const styles = document.createElement('style');
            styles.id = 'radial-context-styles';
            styles.textContent = `
            .radial-context-menu {
                animation: radialMenuAppear 0.3s ease;
            }
            
            @keyframes radialMenuAppear {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .context-hexagon-item {
                animation: hexagonFloat 3s ease-in-out infinite;
                animation-delay: calc(var(--item-index, 0) * 0.1s);
            }
            
            @keyframes hexagonFloat {
                0%, 100% {
                    transform: translateY(0) scale(1);
                }
                50% {
                    transform: translateY(-5px) scale(1.02);
                }
            }
            
            .context-center-image {
                animation: centerPulse 2s ease-in-out infinite;
            }
            
            @keyframes centerPulse {
                0%, 100% {
                    filter: drop-shadow(0 0 5px rgba(0, 219, 222, 0.5));
                }
                50% {
                    filter: drop-shadow(0 0 10px rgba(0, 219, 222, 0.8));
                }
            }
            
            .context-hexagon-item:hover svg path {
                animation: hornGlow 1.5s infinite alternate;
            }
            
            @keyframes hornGlow {
                from {
                    filter: drop-shadow(0 0 3px currentColor);
                }
                to {
                    filter: drop-shadow(0 0 8px currentColor);
                }
            }
            
            /* Rename input styles */
            .rename-input-container {
                position: fixed;
                z-index: 10001;
                background: transparent;
                backdrop-filter: blur(5px);
                padding: 15px;
                border-radius: 8px;
                border: 2px solid #00dbde;
                box-shadow: 0 0 15px rgba(0, 219, 222, 0.3);
                animation: renameInputAppear 0.3s ease;
            }
            
            @keyframes renameInputAppear {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .rename-input {
                background: transparent;
                border: 2px solid #00dbde;
                border-radius: 6px;
                color: white;
                padding: 10px 15px;
                font-size: 14px;
                font-family: 'Segoe UI', sans-serif;
                width: 220px;
                outline: none;
                transition: border-color 0.3s;
                backdrop-filter: blur(3px);
            }
            
            .rename-input:focus {
                border-color: #00ffff;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            }
        `;
            document.head.appendChild(styles);
        }

        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function outsideClickHandler(e) {
                if (!contextMenu.contains(e.target)) {
                    hideContextMenu();
                    document.removeEventListener('click', outsideClickHandler);
                }
            });
        }, 100);

        // Helper function to create hexagon items
        function createHexagonItem(item, x, y, index, contextData) {
            const hexagonItem = document.createElement('div');
            hexagonItem.className = 'context-hexagon-item';
            hexagonItem.style.cssText = `
            position: absolute;
            width: 80px;
            height: 92px;
            left: ${x - 40}px;
            top: ${y - 46}px;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 10;
            transform: scale(0.8);
        `;

            // Create transparent hexagon with colored border
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 100 100");
            svg.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            transition: all 0.3s ease;
            opacity: 0.7;
        `;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `
            M 30,8
            H 70
            a 5,5 0 0 1 4.33,2.5
            L 91.34,45
            a 5,5 0 0 1 0,10
            L 74.33,89.5
            A 5,5 0 0 1 70,92
            H 30
            a 5,5 0 0 1 -4.33,-2.5
            L 8.66,55
            a 5,5 0 0 1 0,-10
            L 25.67,10.5
            A 5,5 0 0 1 30,8
            Z
        `);
            path.setAttribute("fill", "transparent");
            path.setAttribute("stroke", item.color);
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            svg.appendChild(path);

            // Create icon
            const icon = document.createElement('img');
            icon.src = item.icon;
            icon.alt = item.label;
            icon.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            z-index: 11;
            transition: all 0.3s ease;
            filter: ${item.color === '#ff002b' ?
                    'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(320deg)' :
                    'brightness(0) invert(1)'};
        `;

            // Create label
            const label = document.createElement('div');
            label.className = 'context-hexagon-label';
            label.textContent = item.label;
            label.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            white-space: nowrap;
            background: rgba(0, 0, 0, 0.8);
            padding: 4px 8px;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
            color: ${item.color};
            font-weight: bold;
            border: 1px solid ${item.color};
            font-family: 'SF Pro', san-serif;
            pointer-events: none;
            z-index: 12;
        `;

            // Add hover effects
            hexagonItem.addEventListener('mouseenter', function () {
                path.setAttribute("stroke-width", "3");
                path.setAttribute("stroke", item.color === '#ff002b' ? '#ff3366' : '#00ffff');
                svg.style.opacity = "1";
                svg.style.filter = "drop-shadow(0 0 8px currentColor)";
                icon.style.transform = "translate(-50%, -50%) scale(1.2)";
                icon.style.filter = item.color === '#ff002b' ?
                    'brightness(1.5) sepia(1) saturate(5) hue-rotate(320deg)' :
                    'brightness(1.5) sepia(1) hue-rotate(180deg) saturate(3)';
                label.style.opacity = "1";
                hexagonItem.style.zIndex = "20";
            });

            hexagonItem.addEventListener('mouseleave', function () {
                path.setAttribute("stroke-width", "2");
                path.setAttribute("stroke", item.color);
                svg.style.opacity = "0.7";
                svg.style.filter = "none";
                icon.style.transform = "translate(-50%, -50%) scale(1)";
                icon.style.filter = item.color === '#ff002b' ?
                    'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(320deg)' :
                    'brightness(0) invert(1)';
                label.style.opacity = "0";
                hexagonItem.style.zIndex = "10";
            });

            // Add click event
            hexagonItem.addEventListener('click', function (event) {
                event.stopPropagation();

                if (item.action === 'rename') {
                    // Show rename input
                    showRenameInput(e.clientX, e.clientY, contextData);
                } else {
                    // Handle other actions
                    handleContextAction(item.action, contextData);
                }

                hideContextMenu();
            });

            // Assemble hexagon item
            hexagonItem.appendChild(svg);
            hexagonItem.appendChild(icon);
            hexagonItem.appendChild(label);

            return hexagonItem;
        }

        // Function to show rename input
        function showRenameInput(x, y, contextData) {
            console.log('Showing rename for:', contextData);

            // Get file info from context data
            let currentPath = '';
            let fileName = '';

            if (contextData.historyItem) {
                const historyItem = contextData.historyItem;
                currentPath = historyItem.download_path || '';
                fileName = historyItem.filename || '';
                console.log('History item rename:', { currentPath, fileName });
            } else if (contextData.downloadId) {
                const downloadId = contextData.downloadId;
                const downloadElement = document.querySelector(`[data-download-id="${downloadId}"]`);
                if (downloadElement) {
                    fileName = downloadElement.querySelector('.download-filename')?.textContent || '';
                    if (window.activeDownloads && window.activeDownloads.has(downloadId)) {
                        const downloadInfo = window.activeDownloads.get(downloadId);
                        if (downloadInfo && downloadInfo.progressData) {
                            currentPath = downloadInfo.progressData.filename || '';
                        }
                    }
                }
            }

            if (!currentPath || !fileName) {
                showNotification('Ntabwo ushobora guhindura izina: ntabwo ufite urusohokozo!', 'error');
                return;
            }

            // Create rename input container
            const renameInputContainer = document.createElement('div');
            renameInputContainer.className = 'rename-input-container';
            renameInputContainer.style.cssText = `
            position: fixed;
            top: ${y + 20}px;
            left: ${x + 50}px;
            z-index: 10001;
            background: rgba(0, 0, 0,0.7);
            backdrop-filter: blur(2px);
            padding: 15px;
            font-family: SF Pro;
            font-weight: bold;
            font-size: 15px;
            border-radius: 30px;
            border: 1px solid background: rgba(255, 255, 255, 0.7);;
            box-shadow: 0 0 15px rgba(0, 219, 222, 0.3);
            animation: renameInputAppear 0.3s ease;
        `;

            // Remove extension for editing
            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
            const extension = fileName.substring(nameWithoutExt.length);

            renameInputContainer.innerHTML = `
            <div style="margin-bottom: 8px; color: #ffffffff; font-size: 12px; font-weight: bold;">
                Hindura izina
            </div>
            <input type="text" 
                   class="rename-input" 
                   placeholder="Shyiramo izina rishya..." 
                   value="${nameWithoutExt}"
                   autofocus
                   data-original-path="${currentPath}"
                   data-original-filename="${fileName}"
                   autocomplete="off" 
                    spellcheck="false"
                    autocomplete="off" 
                    autocorrect="off" 
                    autocapitalize="off"
                   style="
                        background: transparent;
                        border: 1px solid #00dbde;
                        border-radius: 20px;
                        color: white;
                        padding: 10px 15px;
                        font-size: 17px;
                        font-family: 'SF Pro', sans-serif;
                        width: 220px;
                        outline: none;
                        transition: border-color 0.3s;
                   ">
            <div style="margin-top: 8px; font-size: 11px; color: #ffffffff;">
                Ubwoko: ${extension || 'Nta Bwoko'}
                <br>
                <small style="color: #ffffffff;">Kanda Enter Kwita Izina ... Escape Kubireka</small>
            </div>
        `;

            document.body.appendChild(renameInputContainer);

            // Focus on input
            const input = renameInputContainer.querySelector('.rename-input');
            input.focus();
            input.select();

            // Add event listeners
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    performRename(this);
                } else if (e.key === 'Escape') {
                    hideRenameInput(renameInputContainer);
                }
            });

            input.addEventListener('focus', function () {
                this.style.borderColor = '#00ffff';
                this.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
            });

            input.addEventListener('blur', function () {
                this.style.borderColor = '#00dbde';
                this.style.boxShadow = 'none';
            });

            // Close when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function outsideRenameClick(e) {
                    if (renameInputContainer && !renameInputContainer.contains(e.target)) {
                        hideRenameInput(renameInputContainer);
                    }
                });
            }, 100);

            // Function to perform rename
            function performRename(inputElement) {
                const newName = inputElement.value.trim();
                const currentPath = inputElement.dataset.originalPath;
                const originalFilename = inputElement.dataset.originalFilename;

                if (!newName) {
                    showNotification('Izina nirashobora kuba ubusa!', 'error');
                    inputElement.focus();
                    return;
                }

                if (newName.includes('/') || newName.includes('\\') || newName.includes(':')) {
                    showNotification('Izina nirashobora kugira /, \\ cyangwa :!', 'error');
                    inputElement.focus();
                    return;
                }

                if (!currentPath) {
                    showNotification('Ntabwo ushobora guhindura izina: ntabwo ufite urusohokozo!', 'error');
                    hideRenameInput(renameInputContainer);
                    return;
                }

                // Add extension back
                const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                const finalNewName = newName + extension;

                // Show loading state
                inputElement.disabled = true;
                inputElement.style.opacity = '0.7';
                inputElement.style.borderColor = '#ffff00';
                inputElement.value = 'Guhindura izina...';

                // Send rename request to server
                fetch(`${BASE_URL}/rename-file/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        current_path: currentPath,
                        new_name: finalNewName
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showNotification(`Izina ryahinduwe: ${finalNewName}`, 'success');
                            // Refresh UI
                            if (typeof loadHistoryDownloads === 'function') {
                                loadHistoryDownloads();
                            }

                            if (typeof loadHomeDirectory === 'function') {
                                loadHomeDirectory();
                            }

                        } else {
                            showNotification(`Ikosa: ${data.error || 'Ntabwo ishoboye guhindura izina'}`, 'error');
                        }
                        hideRenameInput(renameInputContainer);
                    })
                    .catch(error => {
                        console.error('Rename error:', error);
                        showNotification('Ikosa kubona seriveri!', 'error');
                        hideRenameInput(renameInputContainer);
                    });
            }

            // Function to hide rename input
            function hideRenameInput(container) {
                if (container && container.parentNode) {
                    container.style.animation = 'renameInputAppear 0.3s ease reverse';
                    setTimeout(() => {
                        if (container.parentNode) {
                            container.parentNode.removeChild(container);
                        }
                    }, 300);
                }
            }
        }

        // Function to handle other context actions
        function handleContextAction(action, contextData) {
            const { downloadId, historyItem } = contextData;

            switch (action) {
                case 'openFile':
                    if (historyItem && historyItem.download_path) {
                        let aview = {
                            path: historyItem.download_path,
                            name: historyItem.filename
                        }
                        previewRealFile(aview);
                        if (historyItem.format_info.category === 'video' || historyItem.format_info.category === 'image') showNotification("Kureba " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`);
                        if (historyItem.format_info.category === 'audio') showNotification("Kumva " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`);
                        if (historyItem.format_info.category === 'text') showNotification("Gusoma " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`);
                        openFileExplorer();
                    } else if (downloadId) {
                        const downloadInfo = activeDownloads.get(downloadId);
                        if (downloadInfo && downloadInfo.progressData && downloadInfo.progressData.filename) {
                            openDownloadedFile(downloadInfo.progressData.filename);
                        }
                    }
                    break;

                case 'openPath':
                    if (historyItem && historyItem.download_path) {
                        openFileLocation(historyItem.download_path);
                    } else if (downloadId) {
                        const downloadInfo = activeDownloads.get(downloadId);
                        if (downloadInfo && downloadInfo.progressData && downloadInfo.progressData.filename) {
                            openFileLocation(downloadInfo.progressData.filename);
                        }
                    }
                    break;

                case 'redownload':
                    if (historyItem) {
                        redownloadFromHistory(historyItem.id);
                    }
                    break;

                case 'delete':
                    if (historyItem) {
                        deleteFromHistory(historyItem.id);
                    } else if (downloadId) {
                        deleteFromManager(downloadId);
                    }
                    loadHistoryDownloads();
                    break;
            }
        }
    }

    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Hide context menu function
    function hideContextMenu() {
        if (contextMenu) {
            contextMenu.style.animation = 'radialMenuDisappear 0.2s ease forwards';
            setTimeout(() => {
                if (contextMenu.parentNode) {
                    contextMenu.parentNode.removeChild(contextMenu);
                }
                contextMenu = null;
            }, 200);

            if (!document.querySelector('#radialMenuDisappear')) {
                const style = document.createElement('style');
                style.id = 'radialMenuDisappear';
                style.textContent = `
                @keyframes radialMenuDisappear {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.8); }
                }
            `;
                document.head.appendChild(style);
            }
        }
    }

    // Global function to show context menu
    window.showContextMenu = showContextMenu;
    window.hideContextMenu = hideContextMenu;

    // Context Menu Actions
    window.contextMenuOpenFile = function () {
        const { downloadId, historyItem } = currentContextDownload || {};
        if (historyItem && historyItem.download_path) {
            // openDownloadedFileFromHistory(historyItem.download_path);
            let aview = {
                path: historyItem.download_path,
                name: historyItem.filename
            }
            previewRealFile(aview);
            showNotification("Kureba: " + `${historyItem.filename.length > 10 ? historyItem.filename.slice(0, 10) + "..." : historyItem.filename}`)
            openFileExplorer();

        } else if (downloadId) {
            const downloadInfo = activeDownloads.get(downloadId);
            if (downloadInfo && downloadInfo.progressData && downloadInfo.progressData.filename) {
                openDownloadedFile(downloadInfo.progressData.filename);
            } else {
                showNotification('File path not available', 'error');
            }
        }
        hideContextMenu();
    };

    window.contextMenuOpenPath = function () {
        const { downloadId, historyItem } = currentContextDownload || {};

        if (historyItem && historyItem.download_path) {
            openFileLocation(historyItem.download_path);
        } else if (downloadId) {
            const downloadInfo = activeDownloads.get(downloadId);
            if (downloadInfo && downloadInfo.progressData && downloadInfo.progressData.filename) {
                openFileLocation(downloadInfo.progressData.filename);
            } else {
                showNotification('File path not available', 'error');
            }
        }
        hideContextMenu();
    };

    window.contextMenuRedownload = function () {
        const { downloadId, historyItem } = currentContextDownload || {};

        if (historyItem) {
            redownloadFromHistory(historyItem.id);
        } else if (downloadId) {
            showNotification('Redownload feature available for history items', 'info');
        }
        hideContextMenu();
    };

    window.contextMenuDelete = function () {
        const { downloadId, historyItem } = currentContextDownload || {};

        if (historyItem) {
            deleteFromHistory(historyItem.id);
        } else if (downloadId) {
            deleteFromManager(downloadId);
        }
        loadHistoryDownloads()
        hideContextMenu();
    };

    // Load history downloads from backend

    // YouTube format f`etching
    const openBtn = document.querySelector('a[href="https://instagram/sherlockcc50/"]');
    const secondOpenBtn = document.getElementById("torrent-interface-btn")
    window.fetcher = document.getElementById('yt-fetcher');
    const closeBtn = document.getElementById('close-fetcher');
    window.urlInput = document.getElementById('yt-url');
    const fetchBtn = document.getElementById('fetch-btn');
    window.tbody = document.getElementById('formats-tbody');
    const icyiganza = document.getElementById('hand-control')


    // Usage:
    icyiganza.addEventListener('dblclick', showHandSigns);


    icyiganza.addEventListener('click', () => {
        fetch(`${BASE_URL}/icyiganza/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // Get CSRF token properly
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Gesture toggle response:', data); // Debug log

                if (data.status === 'running') {
                    const handsImage = ['hand-control.png', 'hand-control2.png'];
                    let choice = handsImage[Math.floor(Math.random() * handsImage.length)];
                    icyiganze.querySelector('img').src = `static/images/${choice}`;
                    showNotification("Gesture Activated");
                }
                else if (data.status === 'stopped') {
                    icyiganze.querySelector('img').src = `static/images/no-hand.png`;
                    showNotification("Gesture Deactivated");
                }
                else if (data.status === 'error') {
                    // Show error message
                    showNotification(data.message || "Error toggling gesture", 'error');
                }
                else if (data.message) {
                    // Show any other message
                    showNotification(data.message);
                }
            })
            .catch(err => {
                console.log('Fetch error:', err);
                showNotification("Error toggling gesture", 'error');
            });
    });



    // OPEN FETCHER
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetcher.style.display = 'flex';
        urlInput.focus();
    });

    secondOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetcher.style.display = 'flex';
        urlInput.focus();
    });



    const humanSize = (bytes) => {
        if (!bytes || typeof bytes !== 'number') return '—';
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KiB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MiB`;
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Global variables
    let selectedFormatInfo = null;
    let currentVideoUrl = null;
    let allFormatsData = [];
    let mediaThumbnail = null;
    let mediaTitle = '';

    // Fetch formats - Shows ONE BIG thumbnail
    const fetchFormats = async () => {
        let url = urlInput.value.trim();
        urlInput.value = url;

        console.log("📤 Fetching:", url);

        if (!url) {
            showNotification("Paste URL ...");
            return false;
        }

        selectedFormatInfo = null;
        allFormatsData = [];

        // Show loading state
        const mediaGridDisplay = document.getElementById('media-grid-display');
        const singleThumbnailContainer = document.getElementById('single-media-thumbnail');

        mediaGridDisplay.style.display = 'block';
        singleThumbnailContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div style="width:50px;height:50px;border:3px solid rgba(55, 49, 47, 0.3);border-top:3px solid #ffffffff;border-radius:50%;animation:spin 1s linear infinite;margin: 0 auto 1rem;"></div>
            <div style="color:#b1ffff;font-size:12px;word-break:break-all;font-family: 'Outfit'; max-width: 300px; margin: 0 auto;">
                ${url.length > 40 ? url.substring(0, 40) + '...' : url}
            </div>
        </div>
    `;

        try {
            const resp = await fetch(`${BASE_URL}/format/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            // Check response status
            if (!resp.ok) {
                const errorText = await resp.text();
                console.error("Server error:", resp.status, errorText);
                throw new Error(`Server error ${resp.status}: ${resp.statusText}`);
            }

            const data = await resp.json();

            // CHECK IF IT'S A PLAYLIST - THIS MUST BE FIRST!
            if (data.is_playlist && data.playlist_info) {


                // Store playlist info globally
                window.currentPlaylistInfo = data.playlist_info;

                // Get first video thumbnail for playlist cover
                const firstVideo = data.playlist_info.videos[0];
                console.log(firstVideo)
                mediaThumbnail = firstVideo?.thumbnail ||
                    (firstVideo?.thumbnails && firstVideo.thumbnails[0] && firstVideo.thumbnails[0].url) ||
                    "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

                mediaTitle = data.playlist_info.playlist_title;
                currentVideoUrl = url;

                // Show playlist as a big thumbnail
                singleThumbnailContainer.innerHTML = '';
                singleThumbnailContainer.appendChild(createPlaylistBigThumbnail(data.playlist_info));
                return;
            }

            // Handle errors for single videos
            if (data.error) {
                singleThumbnailContainer.innerHTML = `
                <div style="text-align:center;color:#ff6666;padding:2rem;font-family:'SF Pro', sans-serif;">
                    ${data.error}
                </div>
            `;
                return;
            }

            // Store data for single video
            currentVideoUrl = url;
            allFormatsData = data.formats;

            // Extract thumbnail (use first format's thumbnail)
            const firstFormat = data.formats[0];
            mediaThumbnail = firstFormat.thumbnail ||
                (firstFormat.thumbnails && firstFormat.thumbnails[0] && firstFormat.thumbnails[0].url) ||
                "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

            // Create simple title from URL
            try {
                const urlObj = new URL(url);
                mediaTitle = urlObj.hostname.replace('www.', '');
            } catch {
                mediaTitle = 'Media';
            }

            // Show ONE BIG thumbnail (300x300px like Instagram)
            singleThumbnailContainer.innerHTML = '';
            singleThumbnailContainer.appendChild(createBigThumbnailItem());

            // Auto-open quality selector after fetching
            setTimeout(() => {
                showFormatSelection(allFormatsData);
            }, 500);

        } catch (e) {
            console.error("❌ Fetch error:", e);
            singleThumbnailContainer.innerHTML = `
            <div style="width:300px;height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);border-radius:12px;border:2px dashed rgba(255,100,100,0.3);">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#ff6b6b;margin-bottom:1rem;"></i>
                <div style="text-align:center;color:#f66;padding:1rem;font-family:'SF Pro', sans-serif;">
                    ${e.message || 'Connection error'}
                </div>
                <button onclick="fetchFormats()" style="margin-top:1rem;background:rgba(255,107,107,0.2);color:white;border:1px solid rgba(255,107,107,0.5);padding:8px 16px;border-radius:20px;cursor:pointer;font-family:'SF Pro', sans-serif;font-size:12px;">
                    <i class="fas fa-redo" style="margin-right:5px;"></i> Try Again
                </button>
            </div>
        `;
            playErrorSound();
        }
    };

    // Create BIG playlist thumbnail (300x300px like Instagram)
    function createPlaylistBigThumbnail(playlistInfo) {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.style.cssText = `
        width: 24rem;
        height: 24rem;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        background: #262626;
        border-radius: 30px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.1);
    `;

        // Use first video thumbnail or fallback
        let thumbnailImage = mediaThumbnail;

        // Get video count badge
        const videoCount = playlistInfo.video_count || playlistInfo.videos?.length || 0;

        thumbnailItem.innerHTML = `
        <img src="${thumbnailImage}" alt="Playlist Thumbnail" loading="lazy" 
             style="width: 100%; height: 100%; object-fit: cover; 
                    transition: transform 0.3s ease;">
        
        <div class="thumbnail-overlay" 
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%); 
                    display: flex; justify-content: center; align-items: flex-end; color: white; font-weight: 600; 
                    opacity: 0; transition: opacity 0.3s; padding-bottom: 20px;">
            <div style="display: flex; flex-direction: column; align-items: center; background: rgba(0, 0, 0, 0.1); 
                        padding: 10px 20px; border-radius: 20px; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3);
                        font-family: 'SF Pro', sans-serif; font-size: 14px;">
                <span style="color: #b1ffff;">Hitamo</span>
                <span style="font-size: 12px; color: rgba(255, 255, 255, 0.8); margin-top: 5px;">
                    Playlist: ${videoCount} Videos
                </span>
            </div>
        </div>
        
        <div style="position: absolute; top: 15px; right: 15px; background: rgba(0, 0, 0, 0.7); 
                    color: #ff922b; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-family: 'SF Pro', sans-serif;
                    border: 1px solid rgba(255, 146, 43, 0.3); display: flex; align-items: center; gap: 5px;">
            <i class="fas fa-list-music" style="font-size: 10px;"></i>
            Playlist
        </div>
        
        <div style="position: absolute; top: 15px; left: 15px; background: rgba(0, 0, 0, 0.7); 
                    color: rgba(255, 255, 255, 0.9); padding: 6px 12px; border-radius: 15px; font-size: 12px; font-family: 'SF Pro', sans-serif;
                    border: 1px solid rgba(255, 255, 255, 0.2);">
            Video ${videoCount} 
        </div>
        
        <div style="position: absolute; bottom: 15px; left: 15px; right: 15px;">
            <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 5px; 
                        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${playlistInfo.playlist_title}
            </div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">
                Kanda Uhitemo
            </div>
        </div>
    `;

        // Hover effects (like Instagram)
        thumbnailItem.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.08)';
            }
            const overlay = this.querySelector('.thumbnail-overlay');
            if (overlay) overlay.style.opacity = '1';
        });

        thumbnailItem.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
            const img = this.querySelector('img');
            if (img) img.style.transform = '';
            const overlay = this.querySelector('.thumbnail-overlay');
            if (overlay) overlay.style.opacity = '0';
        });

        // Click shows playlist video selection dropdown
        thumbnailItem.addEventListener('click', () => {
            fetcher.style.display = 'none';
            urlInput.value = "";
            showPlaylistVideoSelection(playlistInfo);
        });

        return thumbnailItem;
    }

    function showPlaylistVideoSelection(playlistInfo) {
        // Hide existing quality dropdown if visible
        const qualityDropdown = document.getElementById('quality-dropdown');
        const dropdownOverlay = document.getElementById('dropdown-overlay');
        if (qualityDropdown) qualityDropdown.style.display = 'none';
        if (dropdownOverlay) dropdownOverlay.style.display = 'none';

        // Create playlist video dropdown (EXACT copy of torrent-file-dropdown structure)
        const playlistDropdown = document.createElement('div');
        playlistDropdown.id = 'playlist-video-dropdown';
        playlistDropdown.style.cssText = `
    display: none;
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    padding: 20px;
    width: 325px;
    z-index: 1000;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s ease;
    font-family: 'SF Pro', sans-serif;
`;

        // Create overlay for playlist dropdown
        const playlistOverlay = document.createElement('div');
        playlistOverlay.id = 'playlist-video-overlay';
        playlistOverlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
`;

        // Header (EXACTLY like quality dropdown)
        const header = document.createElement('div');
        header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: bold;
    position: relative;
`;

        const titleContent = document.createElement('div');
        titleContent.innerHTML = `
    <strong>
        <h3 style="font-size:16px;font-weight:800;color:rgba(255,255,255,0.9);margin:0;font-weight: bold;font-family: 'SF Pro';">
            Hitamo
        </h3>
        <img src="static/images/atsnai.png" width="150" style="position: absolute;top: -100%;left: 30%;">
    </strong>
`;

        const closeBtn = document.createElement('button');
        closeBtn.id = 'playlist-video-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
    background: rgb(255, 0, 128);
    border: none;
    color: rgb(255, 255, 255);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
`;

        closeBtn.onmouseenter = () => {
            closeBtn.style.transform = 'scale(1.1)';
        };

        closeBtn.onmouseleave = () => {
            closeBtn.style.transform = 'scale(1)';
        };

        closeBtn.onclick = () => {
            playlistDropdown.style.display = 'none';
            playlistOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        header.appendChild(titleContent);
        header.appendChild(closeBtn);

        // Videos options container
        const videosOptionsContainer = document.createElement('div');
        videosOptionsContainer.id = 'playlist-videos-container';
        videosOptionsContainer.className = 'playlist-videos-container';
        videosOptionsContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;
    padding: 7px;
`;

        // Helper to format duration
        const formatDuration = (seconds) => {
            if (!seconds) return '--:--';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        };

        // Add each video as an option (using same styling as torrent files)
        playlistInfo.videos.forEach((video, index) => {
            const duration = formatDuration(video.duration);

            const videoOption = document.createElement('div');
            videoOption.className = 'playlist-video-option';
            videoOption.dataset.videoIndex = index;
            videoOption.style.cssText = `
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: 12px;
        background: rgba(255, 255, 255, 0.05); 
        border-radius: 20px; 
        cursor: pointer; 
        transition: all 0.2s; 
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: 'SF Pro', sans-serif;
        font-weight: bold;
    `;

            // Create hidden checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `playlist-video-${index}`;
            checkbox.className = 'playlist-video-checkbox';
            checkbox.dataset.index = index;
            checkbox.checked = true;
            checkbox.style.cssText = `
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
        pointer-events: none;
    `;

            const checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check';
            checkIcon.style.cssText = `
        color: #ff922b; 
        font-size: 16px;
        transition: color 0.2s;
        
    `;

            videoOption.innerHTML = `
        <div style="display: flex; align-items: center; width: 100%;font-family: 'SF Pro'">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                <div style="position: relative; width: 60px; height: 60px; border-radius: 10px; overflow: hidden;">
                    <img src="${video.thumbnails[3].url || '/static/images/download-video.png'}" 
                         alt="${video.title.length > 13 ? video.title.slice(0, 13) + "..." : video.title}"
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.src='/static/images/download-video.png'">
                    <div style="position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.8); 
                                color: white; padding: 1px 4px; border-radius: 3px; font-size: 8px;font-family: 'SF Pro', san-serif; font-weight: bold">
                        ${duration}
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
                    <div style="font-weight: 500; font-size: 16px; color: rgba(255, 255, 255, 0.95); 
                                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;font-family: 'SF Pro', san-serif; font-weight: bold">
                        ${video.title.length > 13 ? video.title.slice(0, 13) + "..." : video.title}
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; margin-top: 3px;">
                        <span style="font-size: 10px; color: #ff922b; background: rgba(255, 146, 43, 0.1); 
                                    padding: 1px 6px; border-radius: 8px; border: 1px solid rgba(255, 146, 43, 0.3); font-family: 'SF Pro', san-serif; font-weight: bold">
                            #${video.index}
                        </span>
                        <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6);font-family: 'SF Pro', san-serif; font-weight: bold">
                            ${duration}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;

            // Add hidden checkbox and visible icon to the video option
            videoOption.appendChild(checkbox);
            videoOption.appendChild(checkIcon);

            // Hover effects
            videoOption.addEventListener('mouseenter', function () {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateX(5px)';
            });

            videoOption.addEventListener('mouseleave', function () {
                this.style.background = 'rgba(255, 255, 255, 0.05)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = '';
            });

            // Click handler - toggle selection
            videoOption.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });

            // Checkbox change handler - update icon color
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    checkIcon.style.color = '#ff922b';
                } else {
                    checkIcon.style.color = 'rgba(255, 255, 255, 0.2)';
                }
            });

            videosOptionsContainer.appendChild(videoOption);
        });

        // Quick selection buttons
        const quickSelectContainer = document.createElement('div');
        quickSelectContainer.style.cssText = `
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
`;

        const selectAllBtn = document.createElement('button');
        selectAllBtn.innerHTML = `
    <img src="static/images/all.png" width="30">
`;
        selectAllBtn.style.cssText = `
    flex: 1;
    background: rgba(76, 175, 79, 0);
    color: #00fd08ff;
    border: 1px solid rgba(76, 175, 80, 0.3);
    padding: 5px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'SF Pro', sans-serif;
    font-weight: bold;
`;

        const selectNoneBtn = document.createElement('button');
        selectNoneBtn.innerHTML = `
    <img src="static/images/cancel.png" width="30">
`;
        selectNoneBtn.style.cssText = `
    flex: 1;
    background: rgba(244, 67, 54, 0);
    color: #ffffffff;
    border: 1px solid rgba(255, 17, 0, 1);
    padding: 5px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'SF Pro', sans-serif;
    font-weight: bold;
`;

        selectAllBtn.onmouseenter = () => {
            selectAllBtn.style.background = 'rgba(76, 175, 80, 0.25)';
            selectAllBtn.style.transform = 'translateY(-1px)';
        };

        selectAllBtn.onmouseleave = () => {
            selectAllBtn.style.background = 'rgba(76, 175, 79, 0)';
            selectAllBtn.style.transform = '';
        };

        selectNoneBtn.onmouseenter = () => {
            selectNoneBtn.style.background = 'rgba(244, 67, 54, 0.16)';
            selectNoneBtn.style.transform = 'translateY(-1px)';
        };

        selectNoneBtn.onmouseleave = () => {
            selectNoneBtn.style.background = 'rgba(244, 67, 54, 0)';
            selectNoneBtn.style.transform = '';
        };

        selectAllBtn.onclick = () => {
            document.querySelectorAll('.playlist-video-checkbox').forEach(cb => {
                cb.checked = true;
                cb.dispatchEvent(new Event('change'));
            });
        };

        selectNoneBtn.onclick = () => {
            document.querySelectorAll('.playlist-video-checkbox').forEach(cb => {
                cb.checked = false;
                cb.dispatchEvent(new Event('change'));
            });
        };

        quickSelectContainer.appendChild(selectAllBtn);
        quickSelectContainer.appendChild(selectNoneBtn);

        // Download button section
        const downloadSection = document.createElement('div');
        downloadSection.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'start-playlist-download';
        downloadBtn.style.cssText = `
    background: rgba(0, 149, 246, 0.3);
    color: white;
    border: 1px solid rgba(0, 149, 246, 0.5);
    padding: 12px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    font-family: 'SF Pro';
    font-weight: bold;
`;

        downloadBtn.innerHTML = `
    <img src="static/images/download-video.png" width="20">
    Tangira Guhora
`;

        downloadBtn.onmouseenter = () => {
            downloadBtn.style.background = 'rgba(0, 149, 246, 0.4)';
            downloadBtn.style.transform = 'translateY(-1px)';
        };

        downloadBtn.onmouseleave = () => {
            downloadBtn.style.background = 'rgba(0, 149, 246, 0.3)';
            downloadBtn.style.transform = '';
        };

        downloadBtn.onclick = () => {
            // Get selected videos
            const selectedVideos = [];
            const selectedIndices = [];

            document.querySelectorAll('.playlist-video-checkbox').forEach((checkbox, index) => {
                if (checkbox.checked && index < playlistInfo.videos.length) {
                    selectedVideos.push(playlistInfo.videos[index]);
                    selectedIndices.push(index);
                }
            });

            console.log('Selected videos:', selectedIndices.length, 'out of', playlistInfo.videos.length);

            if (selectedVideos.length === 0) {
                showNotification('Please select at least one video to download', 'error');
                return;
            }

            // Store selected videos
            window.selectedPlaylistVideos = selectedVideos;
            window.playlistUrl = playlistInfo.url;

            // Close playlist dropdown
            playlistDropdown.style.display = 'none';
            playlistOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Show format selection for playlist (you'll need to create this)
            showPlaylistFormatSelection();
        };

        downloadSection.appendChild(downloadBtn);

        // Assemble the dropdown
        playlistDropdown.appendChild(header);
        playlistDropdown.appendChild(videosOptionsContainer);
        playlistDropdown.appendChild(quickSelectContainer);
        playlistDropdown.appendChild(downloadSection);

        // Add to body
        document.body.appendChild(playlistOverlay);
        document.body.appendChild(playlistDropdown);

        // Show it
        playlistDropdown.style.display = 'block';
        playlistOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Close on ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                playlistDropdown.style.display = 'none';
                playlistOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        // Close when clicking outside
        playlistOverlay.addEventListener('click', (e) => {
            if (e.target === playlistOverlay) {
                playlistDropdown.style.display = 'none';
                playlistOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEsc);
            }
        });

        // Cleanup
        playlistDropdown.cleanup = () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }

    function showPlaylistFormatSelection() {
        const qualityOptionsContainer = document.getElementById('quality-options-container');
        qualityOptionsContainer.innerHTML = '';

        console.log("🔍 showPlaylistFormatSelection - selectedPlaylistVideos count:",
            window.selectedPlaylistVideos?.length);

        const playlistFormats = [
            {
                format_id: 'playlist_best',
                resolution: 'Best Quality',
                ext: 'mp4',
                filesize: 'Variable',
                note: 'Highest quality for all videos',
                isAudio: false,
                isVideo: true
            },
            {
                format_id: 'playlist_720p',
                resolution: '720p HD',
                ext: 'mp4',
                filesize: 'Variable',
                note: 'Good balance of quality and size',
                isAudio: false,
                isVideo: true
            },
            {
                format_id: 'playlist_audio',
                resolution: 'Audio Only',
                ext: 'mp3',
                filesize: 'Variable',
                note: 'Download as MP3 files',
                isAudio: true,
                isVideo: false
            }
        ];

        // USE THE NEW FUNCTION
        playlistFormats.forEach((format, index) => {
            qualityOptionsContainer.appendChild(createPlaylistQualityOption(format, index, format.isAudio));
        });

        // Initialize if needed
        if (!selectedFormatInfo || !selectedFormatInfo.playlistVideos) {
            console.log("🔄 Initializing selectedFormatInfo");
            selectedFormatInfo = {
                formatId: 'playlist_best',
                resolution: 'Best Quality',
                ext: 'mp4',
                filesize: 'Variable',
                isAudio: false,
                isVideo: true,
                isPlaylist: true,
                playlistVideos: window.selectedPlaylistVideos,
                playlistUrl: window.playlistUrl,
                formatIndex: 0
            };
        }

        // Show dropdown
        const qualityDropdown = document.getElementById('quality-dropdown');
        const dropdownOverlay = document.getElementById('dropdown-overlay');

        if (qualityDropdown && dropdownOverlay) {
            qualityDropdown.style.display = 'block';
            dropdownOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';

            const startDownloadBtn = document.getElementById('start-download');
            if (startDownloadBtn) {
                startDownloadBtn.innerHTML = `
                <img src="static/images/download-video.png" width="20">
                Tangira ${selectedFormatInfo.playlistVideos?.length || 0} Video${selectedFormatInfo.playlistVideos?.length > 1 ? 's' : ''}
            `;

                console.log("🎯 Final selectedFormatInfo before download:", selectedFormatInfo);

                startDownloadBtn.onclick = () => {
                    console.log("🚀 Download button clicked!");
                    console.log("selectedFormatInfo:", selectedFormatInfo);

                    if (!selectedFormatInfo || !selectedFormatInfo.playlistVideos) {
                        console.error("❌ No playlist videos!");
                        showNotification("Error: No videos selected", "error");
                        return;
                    }

                    qualityDropdown.style.display = 'none';
                    dropdownOverlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    startPlaylistDownload(selectedFormatInfo);
                };
            }
        }
    }

    async function startPlaylistDownload(formatInfo) {

        try {
            if (!formatInfo.isPlaylist || !formatInfo.playlistVideos) {
                showNotification("Invalid playlist data", "error");
                return;
            }

            const videoCount = formatInfo.playlistVideos.length;
            if (formatInfo.formatId === 'playlist_audio') {
                setDImage = 'download-audio.png';
            } else {
                setDImage = 'download-video.png';
            }

            showNotification(`Starting download of ${videoCount} videos...`, "info");
            showDownloadingNotification(`${videoCount} Videos`, true);


            // Start downloading each video
            for (let i = 0; i < formatInfo.playlistVideos.length; i++) {
                const video = formatInfo.playlistVideos[i];

                // Add a small delay between downloads
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // FIXED: Use the actual video.url from the playlist video object
                const downloadData = {
                    url: video.url,  // Individual video URL, NOT playlist URL
                    format_id: formatInfo.formatId === 'playlist_best' ? 'bestvideo+bestaudio/best' :
                        formatInfo.formatId === 'playlist_720p' ? 'bestvideo[height<=720]+bestaudio/best' :
                            'bestaudio/best'
                };

                if (formatInfo.formatId === 'playlist_audio') {
                    downloadData.postprocessors = [{
                        key: 'FFmpegExtractAudio',
                        preferredcodec: 'mp3',
                        preferredquality: '192'
                    }];
                }

                console.log(`📥 Downloading ${i + 1}/${videoCount}: ${video.title}`);
                console.log('Video URL:', video.url);
                console.log('Download data:', downloadData);

                const dl = await fetch(`${BASE_URL}/download/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(downloadData)
                });

                const res = await dl.json();

                if (res.status === 'started') {
                    // Add to download manager with playlist info
                    const playlistFormatInfo = {
                        ...formatInfo,
                        title: video.title,
                        isPlaylistItem: true,
                        playlistIndex: i + 1,
                        totalInPlaylist: videoCount
                    };

                    addDownloadToManager(res.download_id, playlistFormatInfo);

                    // Start WebSocket polling
                    if (window.downloadWebSocket) {
                        window.downloadWebSocket.startPolling(res.download_id);
                    }
                } else {
                    console.error(`Failed to start download for video ${i + 1}:`, res.error);
                    showNotification(`Failed to download "${video.title}": ${res.error}`, "error");
                }
            }

            showNotification(`Started downloading ${videoCount} videos!`, "success");

        } catch (error) {
            console.error("Playlist download error:", error);
            showNotification(`Error starting playlist download: ${error.message}`, "error");
        }
    }

    // Create BIG thumbnail (300x300px like Instagram)
    function createBigThumbnailItem() {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.style.cssText = `
        width: 24rem;
        height: 24rem;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        background: #262626;
        border-radius: 30px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.1);
    `;

        // Check if it's a direct download (regular file)
        const isDirectDownload = allFormatsData[0]?.is_direct === true;

        // Determine the thumbnail image to use
        let thumbnailImage = mediaThumbnail;


        if (isDirectDownload) {
            // For direct downloads, use atsnai.png for all types except images
            const firstFormat = allFormatsData[0];
            const ext = (firstFormat.ext || '').toLowerCase();
            const note = (firstFormat.note || '').toLowerCase();

            // Check if it's an image file
            const isImageFile = note.includes('image') ||
                ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);

            if (isImageFile) {
                // For images, use the actual image URL
            } else {
                // For all other file types (video, audio, document, archive), use atsnai.png
                thumbnailImage = '/static/images/atsnai.png';
            }
        }

        // Check if it's audio or video (for yt-dlp formats)
        const hasVideoFormats = allFormatsData.some(f => f.vcodec && f.vcodec !== 'none');
        const hasAudioFormats = allFormatsData.some(f => f.acodec && f.acodec !== 'none');
        let typeBadge = '';

        if (isDirectDownload) {
            // Determine file type for direct downloads
            const firstFormat = allFormatsData[0];
            const ext = (firstFormat.ext || '').toLowerCase();
            const note = (firstFormat.note || '').toLowerCase();

            if (note.includes('video') || ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
                typeBadge = 'Ni Video';
            } else if (note.includes('audio') || ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(ext)) {
                typeBadge = 'Ni Audio';
            } else if (note.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
                typeBadge = 'Ni iFoto';
            } else if (note.includes('document') || ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
                typeBadge = 'Ni Document';
            } else if (note.includes('archive') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
                typeBadge = 'Ni Archive';
            } else {
                typeBadge = 'Ni File';
            }
        } else {
            // For yt-dlp formats
            if (hasVideoFormats && hasAudioFormats) {
                typeBadge = 'Video+Audio';
            } else if (hasVideoFormats) {
                typeBadge = 'Ni Video';
            } else if (hasAudioFormats) {
                typeBadge = 'Ni Audio';
            }
        }

        console.log(thumbnailImage);
        thumbnailItem.innerHTML = `
        <img src="${thumbnailImage}" alt="Media Thumbnail" loading="lazy" 
             style="width: 100%; height: 100%; object-fit: ${isDirectDownload && thumbnailImage === '/static/images/atsnai.png' ? 'contain' : 'cover'}; 
                    background: ${isDirectDownload && thumbnailImage === '/static/images/atsnai.png' ? '#1a1a1a' : 'transparent'};
                    padding: ${isDirectDownload && thumbnailImage === '/static/images/atsnai.png' ? '100px' : '0'};
                    transition: transform 0.3s ease;">
        <div class="thumbnail-overlay" 
             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%); 
                    display: flex; justify-content: center; align-items: flex-end; color: white; font-weight: 600; 
                    opacity: 0; transition: opacity 0.3s; padding-bottom: 20px;">
            <div style="display: flex; flex-direction: column; align-items: center; background: rgba(0, 0, 0, 0.1); 
                        padding: 10px 20px; border-radius: 20px; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3);
                        font-family: 'SF Pro', sans-serif; font-size: 14px;">
                <span style="color: #b1ffff;">Hitamo Ubwiza</span>
                <span style="font-size: 12px; color: rgba(255, 255, 255, 0.8); margin-top: 5px;">
                    ${isDirectDownload ? 'File Imaze Gutegurwa' : `Ubwoko ${allFormatsData.length} Burahari`}
                </span>
            </div>
        </div>
        ${typeBadge ? `
            <div style="position: absolute; top: 15px; right: 15px; background: rgba(0, 0, 0, 0.7); 
                        color: #b1ffff; padding: 6px 12px; border-radius: 15px; font-size: 12px; font-family: 'SF Pro', sans-serif;
                        border: 1px solid rgba(0, 255, 255, 0.3);">
                ${typeBadge}
            </div>
        ` : ''}
        <div style="position: absolute; top: 15px; left: 15px; background: rgba(0, 0, 0, 0.7); 
                    color: rgba(255, 255, 255, 0.9); padding: 6px 12px; border-radius: 15px; font-size: 12px; font-family: 'SF Pro', sans-serif;
                    border: 1px solid rgba(255, 255, 255, 0.2);">
            ${isDirectDownload ? 'File Yateguwe' : `Ubwoko ${allFormatsData.length}`}
        </div>
    `;

        // Hover effects (like Instagram)
        thumbnailItem.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
            const img = this.querySelector('img');
            if (img && !isDirectDownload) {
                img.style.transform = 'scale(1.08)';
            }
            const overlay = this.querySelector('.thumbnail-overlay');
            if (overlay) overlay.style.opacity = '1';
        });

        thumbnailItem.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
            const img = this.querySelector('img');
            if (img) img.style.transform = '';
            const overlay = this.querySelector('.thumbnail-overlay');
            if (overlay) overlay.style.opacity = '0';
        });

        // Click opens quality selector
        thumbnailItem.addEventListener('click', () => {
            fetcher.style.display = 'none';
            urlInput.value = "";
            showFormatSelection(allFormatsData);
        });

        return thumbnailItem;
    }

    // Show format selection interface (EXACTLY like Instagram quality selector)
    window.showFormatSelection = function (formats) {
        // Update format options in dropdown
        const qualityOptionsContainer = document.getElementById('quality-options-container');
        qualityOptionsContainer.innerHTML = '';

        // Sort formats: torrents first, then by quality
        const sortedFormats = [...formats].sort((a, b) => {
            // Check if format is torrent
            const aIsTorrent = a.type === 'torrent' || a.protocol === 'bittorrent';
            const bIsTorrent = b.type === 'torrent' || b.protocol === 'bittorrent';

            // Torrents go first
            if (aIsTorrent && !bIsTorrent) return -1;
            if (!aIsTorrent && bIsTorrent) return 1;

            // For non-torrents, use existing sorting logic
            // (you might need to adjust this based on your needs)
            return 0;
        });

        // Group formats (you might want to modify this for torrents)
        const videoFormats = sortedFormats.filter(f => f.vcodec && f.vcodec !== 'none');
        const audioFormats = sortedFormats.filter(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'));
        const torrentFormats = sortedFormats.filter(f => f.type === 'torrent' || f.protocol === 'bittorrent');

        // Clear container
        qualityOptionsContainer.innerHTML = '';

        // Add torrent formats first with a separator
        if (torrentFormats.length > 0) {
            torrentFormats.forEach((format, index) => {
                qualityOptionsContainer.appendChild(createQualityOption(format, index, false));
            });

            // Add separator if there are other formats
            if (videoFormats.length > 0 || audioFormats.length > 0) {
                const separator = document.createElement('div');
                separator.style.cssText = 'height:1px;background:rgba(255,255,255,0.1);margin:10px 0;';
                qualityOptionsContainer.appendChild(separator);
            }
        }

        // Add Video formats section
        if (videoFormats.length > 0) {
            videoFormats.forEach((format, index) => {
                qualityOptionsContainer.appendChild(createQualityOption(format, index + torrentFormats.length, false));
            });
        }

        // Add Audio formats section
        if (audioFormats.length > 0) {
            // Add separator if there are video formats
            if (videoFormats.length > 0) {
                const separator = document.createElement('div');
                separator.style.cssText = 'height:1px;background:rgba(255,255,255,0.1);margin:10px 0;';
                qualityOptionsContainer.appendChild(separator);
            }

            audioFormats.forEach((format, index) => {
                qualityOptionsContainer.appendChild(createQualityOption(format, index + torrentFormats.length + videoFormats.length, true));
            });
        }

        // Auto-select first format if none selected
        if (sortedFormats.length > 0 && !selectedFormatInfo) {
            const firstFormat = sortedFormats[0];
            selectedFormatInfo = {
                formatId: firstFormat.format_id,
                resolution: firstFormat.resolution,
                ext: firstFormat.ext,
                filesize: firstFormat.filesize,
                isAudio: !firstFormat.vcodec || firstFormat.vcodec === 'none',
                isTorrent: firstFormat.type === 'torrent' || firstFormat.protocol === 'bittorrent',
                upload_id: firstFormat.upload_id,
                torrent_info: firstFormat.torrent_info,
                originalUrl: currentVideoUrl,
                formatIndex: 0,
                is_direct: firstFormat.is_direct,
            };
        }

        // Show dropdown (EXACTLY like Instagram)
        const qualityDropdown = document.getElementById('quality-dropdown');
        const dropdownOverlay = document.getElementById('dropdown-overlay');

        if (qualityDropdown && dropdownOverlay) {
            qualityDropdown.style.display = 'block';
            dropdownOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Set up download button
            const startDownloadBtn = document.getElementById('start-download');
            if (startDownloadBtn) {
                startDownloadBtn.onclick = () => {
                    document.getElementById('quality-dropdown').style.display = 'none';
                    document.getElementById('dropdown-overlay').style.display = 'none';
                    document.body.style.overflow = 'auto';
                    if (selectedFormatInfo) {
                        proceedWithDownload(selectedFormatInfo);
                    } else {
                        showNotification("Please select a format first");
                    }
                };
            }
        }

        // Reset progress indicators
        const downloadProgress = document.getElementById('download-progress');
        const progressSuccess = document.getElementById('progress-success');
        if (downloadProgress) downloadProgress.style.display = 'none';
        if (progressSuccess) progressSuccess.style.display = 'none';
    }

    function createPlaylistQualityOption(format, index, isAudio) {
        const optionElement = document.createElement('div');
        const isSelected = selectedFormatInfo && selectedFormatInfo.formatIndex === index;

        optionElement.style.cssText = `
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: 12px;
        background: ${isSelected ? 'rgba(0, 149, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'}; 
        border-radius: 20px; 
        cursor: pointer; 
        transition: all 0.2s; 
        border: 1px solid ${isSelected ? 'rgba(0, 149, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
        font-family: 'SF Pro', sans-serif;
        font-weight: bold;
    `;

        optionElement.dataset.formatIndex = index;

        // Get icon based on audio/video
        const iconSrc = isAudio ? 'static/images/download-audio.png' : 'static/images/download-video.png';
        const formatType = isAudio ? 'Audio' : 'Video';
        const formatColor = isAudio ? '#51cf66' : '#ff6b6b';

        optionElement.innerHTML = `
        <div style="display: flex; align-items: center;">
            <img src="${iconSrc}" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">
            <div style="display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-weight: 500; font-size: 14px; color: rgba(255, 255, 255, 0.95);">
                        ${format.resolution}
                    </span>
                    <span style="font-size: 11px; color: ${formatColor}; 
                              background: rgba(${isAudio ? '81, 207, 102' : '255, 107, 107'}, 0.1); 
                              padding: 2px 8px; border-radius: 10px; margin-left: 8px; 
                              border: 1px solid rgba(${isAudio ? '81, 207, 102' : '255, 107, 107'}, 0.3);">
                        ${formatType}
                    </span>
                </div>
                <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-top: 3px;">
                    ${format.ext.toUpperCase()} • ${format.filesize}
                </span>
            </div>
        </div>
        ${isSelected ? '<i class="fas fa-check" style="color: #0095f6; font-size: 16px;"></i>' : ''}
    `;

        // FIXED: Click handler that preserves playlist data
        optionElement.addEventListener('click', () => {
            console.log("🎵 Playlist format clicked:", format.format_id);
            console.log("Current selectedFormatInfo (before):", selectedFormatInfo);

            // CRITICAL: Update while preserving playlist data
            selectedFormatInfo = {
                ...selectedFormatInfo,  // Keep playlistVideos, playlistUrl, isPlaylist
                formatId: format.format_id,
                resolution: format.resolution,
                ext: format.ext,
                filesize: format.filesize,
                isAudio: isAudio,
                isVideo: format.isVideo,
                formatIndex: index
            };

            console.log("Updated selectedFormatInfo (after):", selectedFormatInfo);
            console.log("Has playlistVideos?", selectedFormatInfo.playlistVideos?.length);

            // Re-render to show selection
            showPlaylistFormatSelection();
        });

        // Hover effects
        optionElement.addEventListener('mouseenter', function () {
            if (!isSelected) {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateX(5px)';
            }
        });

        optionElement.addEventListener('mouseleave', function () {
            if (!isSelected) {
                this.style.background = 'rgba(255, 255, 255, 0.05)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = '';
            }
        });

        return optionElement;
    }

    function createQualityOption(format, index, isAudio) {
        const optionElement = document.createElement('div');
        const isSelected = selectedFormatInfo && selectedFormatInfo.formatIndex === index;

        // Check if this is a torrent file
        const isTorrent = format.type === 'torrent' || format.protocol === 'bittorrent' || format.ext === 'torrent';

        // Check if this is a direct download (regular file)
        const isDirectDownload = format.is_direct === true && !isTorrent;

        // Get file size
        let fileSize = 'Size N/A';
        if (format.filesize) {
            if (format.filesize === 'Sizwi') {
                fileSize = 'Size Unknown';
            } else {
                fileSize = humanSize(format.filesize);
            }
        } else if (isTorrent && format.torrent_info?.total_size) {
            fileSize = humanSize(format.torrent_info.total_size);
        }

        // Get resolution/quality label
        let qualityLabel = '';
        if (isTorrent) {
            // For torrent files
            qualityLabel = format.torrent_info?.name || format.note || 'Torrent File';
            if (qualityLabel.length > 40) {
                qualityLabel = qualityLabel.substring(0, 40) + '...';
            }
        } else if (isDirectDownload) {
            // For direct downloads, use format.note or ext_expose
            qualityLabel = format.note || format.ext_expose || 'Direct Download';
        } else {
            qualityLabel = format.resolution || (isAudio ? 'Audio Only' : 'Unknown');
            if (format.abr && isAudio) {
                qualityLabel = `${format.abr}k Audio ${format.language}`;
            }
        }

        // Determine format type and icon
        let formatIcon = '';
        let formatType = '';
        let isAudioFormat = false;
        let isVideoFormat = false;

        // Handle torrent files FIRST
        if (isTorrent) {
            formatIcon = '<img src="static/images/torrent.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
            formatType = '<span style="font-size: 11px; color: #ff922b; background: rgba(255, 146, 43, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(255, 146, 43, 0.3);">Torrent</span>';

            // Add file count for torrents
            const fileCount = format.torrent_info?.files?.length || format.file_count || 0;
            if (fileCount > 0) {
                fileSize += ` • ${fileCount} file${fileCount > 1 ? 's' : ''}`;
            }
        }
        // For direct downloads, determine icon based on file category
        else if (isDirectDownload) {
            // Check the file type based on extension or category
            const ext = format.ext.toLowerCase();
            const note = format.note || '';

            // Determine icon based on file type
            if (note.includes('video') || ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
                formatIcon = '<img src="static/images/download-video.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(255, 107, 107, 0.3);">Video</span>';
                isVideoFormat = true;
            } else if (note.includes('audio') || ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(ext)) {
                formatIcon = '<img src="static/images/download-audio.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #51cf66; background: rgba(81, 207, 102, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(81, 207, 102, 0.3);">Audio</span>';
                isAudioFormat = true;
            } else if (note.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
                formatIcon = '<i class="fas fa-image" style="color: #f59f00; margin-right: 10px; font-size: 16px;"></i>';
                formatType = '<span style="font-size: 11px; color: #f59f00; background: rgba(245, 159, 0, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(245, 159, 0, 0.3);">Image</span>';
            } else if (note.includes('document') || ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
                formatIcon = '<img src="static/images/document.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #748ffc; background: rgba(116, 143, 252, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(116, 143, 252, 0.3);">Document</span>';
            } else if (note.includes('archive') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
                formatIcon = '<img src="static/images/zip.png.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #da77f2; background: rgba(218, 119, 242, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(218, 119, 242, 0.3);">Archive</span>';
            } else {
                // Generic file type
                formatIcon = '<i class="fas fa-file-download" style="color: #868e96; margin-right: 10px; font-size: 16px;"></i>';
                formatType = '<span style="font-size: 11px; color: #868e96; background: rgba(134, 142, 150, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(134, 142, 150, 0.3);">File</span>';
            }
        } else {
            // Regular yt-dlp formats (your existing code)
            const hasVideo = format.vcodec && format.vcodec !== 'none';
            const hasAudio = format.acodec && format.acodec !== 'none';

            if (hasVideo && hasAudio) {
                // Video with audio
                formatIcon = '<img src="static/images/download-video.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(255, 107, 107, 0.3);">Video+Audio</span>';
                isVideoFormat = true;
            } else if (hasVideo && !hasAudio) {
                // Video only (no audio)
                formatIcon = '<img src="static/images/download-video.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(180deg); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #4dabf7; background: rgba(77, 171, 247, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(77, 171, 247, 0.3);">Video Only</span>';
                isVideoFormat = true;
            } else if (!hasVideo && hasAudio) {
                // Audio only
                formatIcon = '<img src="static/images/download-audio.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
                formatType = '<span style="font-size: 11px; color: #51cf66; background: rgba(81, 207, 102, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(81, 207, 102, 0.3);">Audio</span>';
                isAudioFormat = true;
            }
        }

        optionElement.style.cssText = `
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding-left: 12px;
        padding-right: 12px; 
        padding: 7px;
        background: ${isSelected ? 'rgba(0, 149, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'}; 
        border-radius: 20px; 
        cursor: pointer; 
        transition: all 0.2s; 
        border: 1px solid ${isSelected ? 'rgba(0, 149, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
        font-family: 'SF Pro', sans-serif;
        font-weight: bold;
        ${isTorrent ? 'border-color: rgba(255, 146, 43, 0.4);' : ''}
    `;

        optionElement.dataset.formatIndex = index;

        // For torrents, add a special note
        const torrentNote = isTorrent ?
            `<span style="font-size: 11px; color: #ff922b; margin-left: 8px; display: flex; align-items: center; gap: 4px;">
            <span style="font-size: 10px;">⚡</span> P2P
        </span>` : '';

        optionElement.innerHTML = `
        <div style="display: flex; align-items: center;">
            ${formatIcon}
            <div style="display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-weight: 500; font-size: 14px; color: rgba(255, 255, 255, 0.95);">
                        ${qualityLabel.length > 13 ? qualityLabel.slice(0, 13) + "..." : qualityLabel}
                    </span>
                    ${formatType}
                    ${torrentNote}
                </div>
                <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-top: 3px;">
                    ${format.ext.toUpperCase()} • ${fileSize} <!-- ${format.tbr && format.tbr !== 'Sizwi' ? '• ' + format.tbr : ''} -->
                </span>
            </div>
        </div>
        ${isSelected ? '<i class="fas fa-check" style="color: #0095f6; font-size: 16px;"></i>' : ''}
    `;

        optionElement.addEventListener('click', () => {
            // Update selected format
            selectedFormatInfo = {
                formatId: format.format_id,
                resolution: format.resolution,
                ext: format.ext,
                filesize: format.filesize,
                isAudio: isAudioFormat || (isDirectDownload ? (format.ext && ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(format.ext.toLowerCase())) : (!format.vcodec || format.vcodec === 'none')),
                isDirect: isDirectDownload,
                isTorrent: isTorrent,
                upload_id: format.upload_id,
                torrent_info: format.torrent_info,
                originalUrl: currentVideoUrl,
                formatIndex: index
            };

            console.log('Selected format:', selectedFormatInfo);

            // NEW: If it's a torrent with files, show file selection
            if (isTorrent && format.torrent_info?.files?.length > 0) {
                // Don't re-render quality dropdown yet
                // Show file selection modal
                showTorrentFileSelection(format.torrent_info.files, format.upload_id);
            } else {
                // For non-torrents, re-render as normal
                showFormatSelection(allFormatsData);
            }
        });

        optionElement.addEventListener('mouseenter', function () {
            if (!isSelected) {
                this.style.background = isTorrent ? 'rgba(255, 146, 43, 0.1)' : 'rgba(255, 255, 255, 0.1)';
                this.style.borderColor = isTorrent ? 'rgba(255, 146, 43, 0.4)' : 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateX(5px)';
            }
        });

        optionElement.addEventListener('mouseleave', function () {
            if (!isSelected) {
                this.style.background = 'rgba(255, 255, 255, 0.05)';
                this.style.borderColor = isTorrent ? 'rgba(255, 146, 43, 0.4)' : 'rgba(255, 255, 255, 0.1)';
                this.style.transform = '';
            }
        });

        return optionElement;
    }

    // Close quality dropdown
    document.getElementById('quality-close').addEventListener('click', () => {
        document.getElementById('quality-dropdown').style.display = 'none';
        document.getElementById('dropdown-overlay').style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close dropdown when clicking overlay
    document.getElementById('dropdown-overlay').addEventListener('click', () => {
        document.getElementById('quality-dropdown').style.display = 'none';
        document.getElementById('dropdown-overlay').style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Keyboard navigation for dropdown
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('quality-dropdown').style.display === 'block' && e.key === 'Escape') {
            document.getElementById('quality-dropdown').style.display = 'none';
            document.getElementById('dropdown-overlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Proceed with download
    const proceedWithDownload = async (formatInfo) => {
        console.log("PWD: ", formatInfo)
        try {
            // Check if it's a torrent file
            const isTorrent = formatInfo.isTorrent || formatInfo.ext === 'torrent';

            // Prepare download data
            let downloadData = {
                url: formatInfo.originalUrl,
                format_id: formatInfo.formatId
            };

            // If it's a torrent, send the upload_id in the correct format
            if (isTorrent && formatInfo.upload_id) {
                downloadData = {
                    url: `upload:${formatInfo.upload_id}`,  // CRITICAL: This format tells backend it's a torrent upload
                    format_id: 'torrent',  // Should be 'torrent' for torrent files
                    upload_id: formatInfo.upload_id,  // Include upload_id for reference
                    is_file_upload: true,
                    torrent_info: formatInfo.torrent_info
                };

            }
            const dl = await fetch(`${BASE_URL}/download/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(downloadData)
            });

            const res = await dl.json();

            if (res.status === 'started') {
                // Show success notification
                if (isTorrent) {
                    showNotification("Torrent download started!", "success");
                } else {
                    showNotification("Download started!", "success");
                }

                // Update formatInfo with any additional data from response
                const updatedFormatInfo = {
                    ...formatInfo,
                    title: res.title || formatInfo.title,
                    filesize: res.filesize || formatInfo.filesize
                };

                // Add to download manager
                const downloadElement = addDownloadToManager(res.download_id, updatedFormatInfo);
                console.log(window.activeDownloads)

                // Start WebSocket polling
                if (window.downloadWebSocket) {
                    window.downloadWebSocket.startPolling(res.download_id);
                }

                // If torrent has direct download URL (for .torrent file), open it
                if (isTorrent && res.direct_download_url) {
                    setTimeout(() => {
                        window.open(res.direct_download_url, '_blank');
                    }, 500);
                }

            } else if (res.error) {
                showNotification(`Error: ${res.error}`, "error");
                console.log(res)
            } else {
                showNotification(`Unknown response: ${JSON.stringify(res)}`, "warning");
            }

        } catch (err) {
            console.log(err)
        }
    };

    // Helper function for direct torrent file download (fallback)
    async function downloadTorrentDirectly(uploadId, filename) {
        try {
            const directUrl = `${BASE_URL}/download/${uploadId}/`;
            const response = await fetch(directUrl);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename || 'download.torrent';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Direct torrent download failed:', error);
            return false;
        }
    }

    // Simulate download progress (EXACTLY like Instagram)
    function simulateDownloadProgress() {
        const downloadProgress = document.getElementById('download-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const progressSuccess = document.getElementById('progress-success');
        const startDownloadBtn = document.getElementById('start-download');

        // Show progress, hide download button
        startDownloadBtn.style.display = 'none';
        downloadProgress.style.display = 'flex';
        progressSuccess.style.display = 'none';

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;

            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            if (progress >= 100) {
                clearInterval(interval);

                // Show success message
                setTimeout(() => {
                    downloadProgress.style.display = 'none';
                    progressSuccess.style.display = 'flex';

                    // Close dropdown after delay
                    setTimeout(() => {
                        document.getElementById('quality-dropdown').style.display = 'none';
                        document.getElementById('dropdown-overlay').style.display = 'none';
                        document.body.style.overflow = 'auto';

                        // Reset UI after closing
                        setTimeout(() => {
                            progressFill.style.width = '0%';
                            progressText.textContent = '0%';
                            startDownloadBtn.style.display = 'flex';
                            downloadProgress.style.display = 'none';
                            progressSuccess.style.display = 'none';
                        }, 300);
                    }, 1500);
                }, 500);
            }
        }, 100);
    }

    // Add Font Awesome icons (if not already added)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // Keep existing event listeners
    fetchBtn.addEventListener('click', fetchFormats);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchFormats(); });


    const renderTable = (formats, videoUrl) => {
        tbody.innerHTML = '';

        // Separate audio and video formats
        const audioFormats = formats.filter(f => !f.resolution || f.resolution === 'audio' || (!f.vcodec || f.vcodec === 'none') && f.acodec && f.acodec !== 'none');
        const videoFormats = formats.filter(f => f.resolution && f.resolution !== 'audio' && f.vcodec && f.vcodec !== 'none');

        // Create Audio section header
        if (audioFormats.length > 0) {
            const audioHeader = document.createElement('tr');
            audioHeader.className = 'section-header';
            tbody.appendChild(audioHeader);

            // Add audio formats
            audioFormats.forEach(f => {
                addFormatRow(f, videoUrl, 'audio');
            });
        }

        // Create Video section header
        if (videoFormats.length > 0) {
            const videoHeader = document.createElement('tr');
            videoHeader.className = 'section-header';
            tbody.appendChild(videoHeader);

            // Add video formats
            videoFormats.forEach(f => {
                addFormatRow(f, videoUrl, 'video');
            });
        }

        // If no formats found
        if (audioFormats.length === 0 && videoFormats.length === 0) {
            tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;color:#f66;padding:1rem;">No format zabonywe</td></tr>';
        }
    };



    // Helper function to create format rows


    function showTorrentFileSelection(files, uploadId) {
        // First, hide the existing quality dropdown
        const qualityDropdown = document.getElementById('quality-dropdown');
        const dropdownOverlay = document.getElementById('dropdown-overlay');
        if (qualityDropdown) qualityDropdown.style.display = 'none';
        if (dropdownOverlay) dropdownOverlay.style.display = 'none';

        // Create torrent file dropdown (EXACT copy of quality-dropdown structure)
        const torrentDropdown = document.createElement('div');
        torrentDropdown.id = 'torrent-file-dropdown';
        torrentDropdown.style.cssText = `
        display: none;
        position: fixed;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        padding: 20px;
        width: 325px;
        z-index: 1000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.3s ease;
        font-family: 'SF Pro', sans-serif;
    `;

        // Create overlay for torrent dropdown
        const torrentOverlay = document.createElement('div');
        torrentOverlay.id = 'torrent-file-overlay';
        torrentOverlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
    `;

        // Header (EXACTLY like quality dropdown)
        const header = document.createElement('div');
        header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-weight: bold;
        position: relative;
    `;

        const titleContent = document.createElement('div');
        titleContent.innerHTML = `
        <strong>
            <h3 style="font-size:16px;font-weight:800;color:rgba(255,255,255,0.9);margin:0;font-weight: bold;font-family: 'SF Pro';">
                Hitamo
            </h3>
            <img src="static/images/atsnai.png" width="150" style="position: absolute;top: -100%;left: 30%;">
        </strong>
    `;

        const closeBtn = document.createElement('button');
        closeBtn.id = 'torrent-file-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
        background: rgb(255, 0, 128);
        border: none;
        color: rgb(255, 255, 255);
        font-size: 18px;
        cursor: pointer;
        transition: all 0.2s;
        padding: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
    `;

        closeBtn.onmouseenter = () => {
            closeBtn.style.transform = 'scale(1.1)';
        };

        closeBtn.onmouseleave = () => {
            closeBtn.style.transform = 'scale(1)';
        };

        closeBtn.onclick = () => {
            torrentDropdown.style.display = 'none';
            torrentOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            showFormatSelection(allFormatsData);
        };

        header.appendChild(titleContent);
        header.appendChild(closeBtn);

        // Files options container (EXACTLY like quality-options-container)
        const filesOptionsContainer = document.createElement('div');
        filesOptionsContainer.id = 'torrent-files-container';
        filesOptionsContainer.className = 'torrent-files-container'
        filesOptionsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
        max-height: 300px;
        overflow-y: auto;
        padding: 7px;
    `;

        // Helper to format file size
        const formatFileSize = (bytes) => {
            if (!bytes) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        // Helper to get file icon
        const getFileIcon = (filename) => {
            const ext = filename.split('.').pop().toLowerCase();
            if (['mp4', 'mkv', 'avi', 'mov', 'wmv'].includes(ext)) {
                return '<img src="static/images/download-video.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
            } else if (['mp3', 'wav', 'aac', 'flac'].includes(ext)) {
                return '<img src="static/images/download-audio.png" style="width: 20px; height: 20px; margin-right: 10px; filter: brightness(0) invert(1); opacity: 0.9;">';
            } else if (['srt', 'ass', 'ssa', 'vtt'].includes(ext)) {
                return '<i class="fas fa-closed-captioning" style="color: #4dabf7; margin-right: 10px; font-size: 16px;"></i>';
            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                return '<i class="fas fa-image" style="color: #f59f00; margin-right: 10px; font-size: 16px;"></i>';
            } else if (['txt', 'pdf', 'doc', 'docx'].includes(ext)) {
                return '<i class="fas fa-file-alt" style="color: #748ffc; margin-right: 10px; font-size: 16px;"></i>';
            } else {
                return '<i class="fas fa-file" style="color: #868e96; margin-right: 10px; font-size: 16px;"></i>';
            }
        };

        // Add each file as an option (using same styling as createQualityOption)
        files.forEach((file, index) => {
            const fileName = file.path.split('/').pop();
            const fileExt = fileName.split('.').pop().toUpperCase();
            const fileSize = formatFileSize(file.size);

            const fileOption = document.createElement('div');
            fileOption.className = 'torrent-file-option';
            fileOption.dataset.fileIndex = index;
            fileOption.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px;
            padding-left: 12px;
            padding-right: 12px;
            padding-top: 12px;
            padding-bottom: 12px;
            background: rgba(255, 255, 255, 0.05); 
            border-radius: 20px; 
            cursor: pointer; 
            transition: all 0.2s; 
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: 'SF Pro', sans-serif;
            font-weight: bold;
        `;

            fileOption.innerHTML = `
            <div style="display: flex; align-items: center;">
                <input type="checkbox" 
                       id="torrent-file-${index}" 
                       class="torrent-file-checkbox" 
                       data-index="${index}"
                       checked
                       style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer; accent-color: #5dfd00ff;border-radius: 30px;">
                ${getFileIcon(fileName)}
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-weight: 500; font-size: 14px; color: rgba(255, 255, 255, 0.95);">
                            ${fileName.length > 13 ? fileName.slice(0, 13) + '...' : fileName}
                        </span>
                        <span style="font-size: 11px; color: #ffffffff; background: rgba(134, 133, 133, 0.1); padding: 2px 8px; border-radius: 10px; margin-left: 8px; border: 1px solid rgba(230, 230, 230, 0.3);">
                            ${fileExt}
                        </span>
                    </div>
                    <span style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 3px;">
                        ${fileSize}
                    </span>
                </div>
            </div>
            <i class="fas fa-check" style="color: #ff922b; font-size: 16px;"></i>
        `;

            // Same hover effects as quality options
            fileOption.addEventListener('mouseenter', function () {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateX(5px)';
            });

            fileOption.addEventListener('mouseleave', function () {
                this.style.background = 'rgba(255, 255, 255, 0.05)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = '';
            });

            // Click handler
            fileOption.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = fileOption.querySelector('.torrent-file-checkbox');
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            // Checkbox change handler
            const checkbox = fileOption.querySelector('.torrent-file-checkbox');
            const checkIcon = fileOption.querySelector('.fa-check');
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    checkIcon.style.color = '#ff922b';
                } else {
                    checkIcon.style.color = 'transparent';
                }
            });

            filesOptionsContainer.appendChild(fileOption);
        });

        // Quick selection buttons
        const quickSelectContainer = document.createElement('div');
        quickSelectContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    `;

        const selectAllBtn = document.createElement('button');
        selectAllBtn.innerHTML = `
    <img src="static/images/all.png" width="30">
    `
        selectAllBtn.style.cssText = `
        flex: 1;
        background: rgba(76, 175, 79, 0);
        color: #00fd08ff;
        border: 1px solid rgba(76, 175, 80, 0.3);
        padding: 5px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'SF Pro', sans-serif;
        font-weight: bold;
    `;

        const selectNoneBtn = document.createElement('button');
        selectNoneBtn.innerHTML = `
    <img src="static/images/cancel.png" width="30">
    `
        selectNoneBtn.style.cssText = `
        flex: 1;
        background: rgba(244, 67, 54, 0);
        color: #ffffffff;
        border: 1px solid rgba(255, 17, 0, 1);
        padding: 5px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'SF Pro', sans-serif;
        font-weight: bold;
    `;

        selectAllBtn.onmouseenter = () => {
            selectAllBtn.style.background = 'rgba(76, 175, 80, 0.25)';
            selectAllBtn.style.transform = 'translateY(-1px)';
        };

        selectAllBtn.onmouseleave = () => {
            selectAllBtn.style.background = 'rgba(76, 175, 79, 0)';
            selectAllBtn.style.transform = '';
        };

        selectNoneBtn.onmouseenter = () => {
            selectNoneBtn.style.background = 'rgba(244, 67, 54, 0.25)';
            selectNoneBtn.style.transform = 'translateY(-1px)';
        };

        selectNoneBtn.onmouseleave = () => {
            selectNoneBtn.style.background = 'rgba(244, 67, 54, 0)';
            selectNoneBtn.style.transform = '';
        };

        selectAllBtn.onclick = () => {
            document.querySelectorAll('.torrent-file-checkbox').forEach(cb => {
                cb.checked = true;
                cb.dispatchEvent(new Event('change'));
            });
        };

        selectNoneBtn.onclick = () => {
            document.querySelectorAll('.torrent-file-checkbox').forEach(cb => {
                cb.checked = false;
                cb.dispatchEvent(new Event('change'));
            });
        };

        quickSelectContainer.appendChild(selectAllBtn);
        quickSelectContainer.appendChild(selectNoneBtn);

        // Download button section (EXACTLY like quality dropdown)
        const downloadSection = document.createElement('div');
        downloadSection.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
    `;

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'start-torrent-download';
        downloadBtn.style.cssText = `
        background: rgba(0, 149, 246, 0.3);
        color: white;
        border: 1px solid rgba(0, 149, 246, 0.5);
        padding: 12px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        font-family: 'SF Pro';
        font-weight: bold;
    `;

        downloadBtn.innerHTML = `
        <img src="static/images/download-torrent.png" width="20">
        Tangira
    `;

        downloadBtn.onmouseenter = () => {
            downloadBtn.style.background = 'rgba(0, 149, 246, 0.4)';
            downloadBtn.style.transform = 'translateY(-1px)';
        };

        downloadBtn.onmouseleave = () => {
            downloadBtn.style.background = 'rgba(0, 149, 246, 0.3)';
            downloadBtn.style.transform = '';
        };

        downloadBtn.onclick = () => {
            // Get selected files
            const selectedFiles = [];
            const selectedIndices = [];

            document.querySelectorAll('.torrent-file-checkbox').forEach((checkbox, index) => {
                if (checkbox.checked && index < files.length) {
                    selectedFiles.push(files[index]);
                    selectedIndices.push(index);
                }
            });

            console.log('Selected files:', selectedIndices.length, 'out of', files.length);

            if (selectedFiles.length === 0) {
                showNotification('Please select at least one file to download', 'error');
                return;
            }

            // Update selectedFormatInfo with selected files
            if (selectedFormatInfo) {
                selectedFormatInfo.selected_files = selectedFiles;
                selectedFormatInfo.selected_file_indices = selectedIndices;
            }

            // Close torrent dropdown
            torrentDropdown.style.display = 'none';
            torrentOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Start download
            if (selectedFormatInfo) {
                proceedWithDownload(selectedFormatInfo);
            }
        };

        downloadSection.appendChild(downloadBtn);

        // Assemble the dropdown
        torrentDropdown.appendChild(header);
        torrentDropdown.appendChild(filesOptionsContainer);
        torrentDropdown.appendChild(quickSelectContainer);
        torrentDropdown.appendChild(downloadSection);

        // Add to body
        document.body.appendChild(torrentOverlay);
        document.body.appendChild(torrentDropdown);

        // Show it
        torrentDropdown.style.display = 'block';
        torrentOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Close on ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                torrentDropdown.style.display = 'none';
                torrentOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEsc);
                showFormatSelection(allFormatsData);
            }
        };
        document.addEventListener('keydown', handleEsc);

        // Close when clicking outside
        torrentOverlay.addEventListener('click', (e) => {
            if (e.target === torrentOverlay) {
                torrentDropdown.style.display = 'none';
                torrentOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEsc);
                showFormatSelection(allFormatsData);
            }
        });

        // Cleanup
        torrentDropdown.cleanup = () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }



    const addFormatRow = (f, videoUrl, type) => {
        const isAudio = type === 'audio';

        const row = document.createElement('tr');
        row.className = `format-row ${type}-format`;
        row.dataset.formatId = f.format_id;

        const moreInfo = [
            f.note,
            f.language && `[${f.language.split('-')[0]}] ${f.language.split(' ').slice(1).join(' ')}`,
            f.dynamic_range && f.dynamic_range
        ].filter(Boolean).join(', ');

        // Different styling for audio vs video rows
        const rowStyle = isAudio ? 'background: rgba(0, 40, 80, 0.3);' : 'background: rgba(0, 40, 80, 0.3);';
        row.style.cssText = rowStyle;

        setDImage = 'downg.png'

        if (f.format_id == 'direct') {
            let setTImage = 'image.png'

            if (f.ext_expose == 'image') {
                setDImage = 'download-image.png'
                setTImage = 'image.png'
            } else if (f.ext_expose == 'video') {
                setDImage = 'download-video.png';
                setTImage = 'video.png'
            }
            else if (f.ext_expose == 'audio') {
                setDImage = 'download-audio.png';
                setTImage = 'audio.png'
            }
            else {
                setDImage = 'document.png';
                setTImage = 'document.png'
                f.ext_expose = 'document';
            }
            row.innerHTML = `
                <td class="id">${f.format_id.length > 3 ? f.format_id.slice(0, 2) : f.format_id}</td>
                <td class="more"><img class="player-controls"   src="static/images/${setTImage}"></td>
                <td class="ext">${f.ext}</td>
                <td class="res">${isAudio ? 'audio only' : (f.resolution || '—')}</td>
                <td style="color:#aaa;">${f.fps || ''}</td>
                <td class="size">${humanSize(f.filesize) || 'Sizwi'}</td>
                <td class="tbr">${f.tbr ? f.tbr + '' : '—'}</td>
                <td class="proto">${f.protocol || '—'}</td>
                <td class="vcodec">${isAudio ? 'audio only' : (f.vcodec || '—')}</td>
                <td style="color:#ff9;">${f.tbr ? f.tbr : '—'}</td>
                <td class="more"><img class="player-controls" style="width:20px;height:20px;"  src="static/images/${setDImage}"></td>
            `;

        }
        else {
            setDImage = isAudio ? 'download-audio.png' : "download-video.png"
            row.innerHTML = `
                <td class="id">${f.format_id.length > 3 ? f.format_id.slice(0, 2) : f.format_id}</td>
                <td class="more"><img class="player-controls"  src="static/images/${isAudio ? 'audio3.png' : 'video.png'}"></td>
                <td class="ext">${f.ext}</td>
                <td class="res">${isAudio ? 'audio only' : (f.resolution || '—')}</td>
                <td style="color:#aaa;">${f.fps || ''}</td>
                <td class="size">${humanSize(f.filesize)}</td>
                <td class="tbr">${f.tbr ? f.tbr + '' : '—'}</td>
                <td class="proto">${f.protocol || '—'}</td>
                <td class="vcodec">${isAudio ? 'audio only' : (f.vcodec || '—')}</td>
                <td style="color:#ff9;">${f.tbr ? f.tbr + '' : '—'}</td>
                <td class="more"><img class="player-controls"  src="static/images/${isAudio ? 'download-audio.png' : 'download-video.png'}"></td>
            `;
        }

        // Function to create elliptical curved connecting line
        const createConnectionLine = (startX, startY, endX, endY) => {
            // Remove any existing connection lines
            const existingLine = document.getElementById('download-connection-line');
            if (existingLine) {
                document.body.removeChild(existingLine);
            }

            // Calculate ellipse parameters
            const centerX = (startX + endX) / 2;
            const centerY = Math.min(startY, endY) - 150; // Ellipse center above both points

            // Ellipse radii - wider horizontally, narrower vertically
            const radiusX = Math.abs(endX - startX) * 0.6 + 100;
            const radiusY = 120;

            // Calculate angles for start and end points on ellipse
            const angleStart = Math.atan2(startY - centerY, startX - centerX);
            const angleEnd = Math.atan2(endY - centerY, endX - centerX);

            // Adjust angles to create a smooth elliptical arc (counter-clockwise)
            let adjustedAngleStart = angleStart;
            let adjustedAngleEnd = angleEnd;

            // Ensure we draw the upper elliptical arc
            if (startX < endX) {
                // Clicked left, dialog right - draw counter-clockwise arc
                if (angleStart > angleEnd) {
                    adjustedAngleEnd += Math.PI * 2;
                }
            } else {
                // Clicked right, dialog left - draw clockwise arc (reverse)
                if (angleEnd > angleStart) {
                    adjustedAngleStart += Math.PI * 2;
                }
            }

            // Create SVG path with elliptical arc
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.id = 'download-connection-line';
            svg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            // Use elliptical arc command for smooth curve
            const largeArcFlag = Math.abs(adjustedAngleEnd - adjustedAngleStart) > Math.PI ? 1 : 0;
            const sweepFlag = startX < endX ? 0 : 1; // 0 for counter-clockwise, 1 for clockwise

            const pathData = `M ${startX} ${startY}
                         A ${radiusX} ${radiusY} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

            path.setAttribute('d', pathData);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', isAudio ? '#00ffff' : '#00ffff');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-dasharray', '5,3');
            path.style.cssText = `
            filter: drop-shadow(0 0 8px ${isAudio ? '#00ffff' : '#00ffff'});
            animation: drawLine 1.2s ease-in-out forwards;
        `;

            // Add arrowhead at the end
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const arrowhead = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            arrowhead.setAttribute('id', 'arrowhead');
            arrowhead.setAttribute('markerWidth', '10');
            arrowhead.setAttribute('markerHeight', '7');
            arrowhead.setAttribute('refX', '9');
            arrowhead.setAttribute('refY', '3.5');
            arrowhead.setAttribute('orient', 'auto');

            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
            polygon.setAttribute('fill', isAudio ? '#00ffff' : '#00ffff');

            arrowhead.appendChild(polygon);
            marker.appendChild(arrowhead);
            svg.appendChild(marker);

            path.setAttribute('marker-end', 'url(#arrowhead)');
            svg.appendChild(path);

            // Add glow effect
            const glow = path.cloneNode();
            glow.setAttribute('stroke', isAudio ? '#00ffff' : '#00ffff');
            glow.setAttribute('stroke-width', '6');
            glow.setAttribute('opacity', '0.2');
            glow.style.filter = 'blur(4px)';
            glow.style.animation = 'drawLine 1.4s ease-in-out forwards';
            svg.appendChild(glow);

            // Add control points visualization (for debugging - remove in production)
            if (false) { // Set to true to see ellipse and control points
                const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                ellipse.setAttribute('cx', centerX);
                ellipse.setAttribute('cy', centerY);
                ellipse.setAttribute('rx', radiusX);
                ellipse.setAttribute('ry', radiusY);
                ellipse.setAttribute('fill', 'none');
                ellipse.setAttribute('stroke', 'red');
                ellipse.setAttribute('stroke-width', '1');
                ellipse.setAttribute('opacity', '0.3');
                svg.appendChild(ellipse);

                // Start point
                const startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                startCircle.setAttribute('cx', startX);
                startCircle.setAttribute('cy', startY);
                startCircle.setAttribute('r', '3');
                startCircle.setAttribute('fill', 'green');
                svg.appendChild(startCircle);

                // End point
                const endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                endCircle.setAttribute('cx', endX);
                endCircle.setAttribute('cy', endY);
                endCircle.setAttribute('r', '3');
                endCircle.setAttribute('fill', 'blue');
                svg.appendChild(endCircle);

                // Center point
                const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                centerCircle.setAttribute('cx', centerX);
                centerCircle.setAttribute('cy', centerY);
                centerCircle.setAttribute('r', '3');
                centerCircle.setAttribute('fill', 'yellow');
                svg.appendChild(centerCircle);
            }

            document.body.appendChild(svg);

            // Add CSS animation for drawing effect
            if (!document.getElementById('line-animation-style')) {
                const style = document.createElement('style');
                style.id = 'line-animation-style';
                style.textContent = `
                @keyframes drawLine {
                    from {
                        stroke-dashoffset: 1000;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `;
                document.head.appendChild(style);
            }

            return svg;
        };

        // Function to remove connection line
        const removeConnectionLine = () => {
            const line = document.getElementById('download-connection-line');
            if (line) {
                line.style.opacity = '0';
                line.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(line)) {
                        document.body.removeChild(line);
                    }
                }, 300);
            }
        };

        // Function to calculate dialog position based on click position
        const calculateDialogPosition = (clickX, clickY) => {
            const dialogWidth = 400;
            const dialogHeight = 300;
            const margin = 50;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let baseX = screenWidth / 2;
            let baseY = screenHeight / 2;

            const distanceX = clickX - baseX;
            const distanceY = clickY - baseY;

            const doubledDistanceX = distanceX * .7;
            const doubledDistanceY = distanceY * .7;

            let newX = baseX - doubledDistanceX;
            let newY = baseY - doubledDistanceY;

            newX = Math.max(margin, Math.min(screenWidth - dialogWidth - margin, newX));
            newY = Math.max(margin, Math.min(screenHeight - dialogHeight - margin, newY));

            return { x: newX, y: newY };
        };

        // Click to select with different hover colors
        row.onclick = (e) => {
            if (e.target.tagName === 'A') return;
            document.querySelectorAll('.format-row').forEach(r => r.classList.remove('active'));
            row.classList.add('active');

            if (isAudio) {
                row.style.background = 'rgba(0, 100, 160, 0.8)';
            } else {
                row.style.background = 'rgba(0, 100, 160, 0.8)';
            }
        };

        // Reset background on mouse leave
        row.addEventListener('mouseleave', () => {
            if (!row.classList.contains('active')) {
                row.style.background = isAudio ? 'rgba(0, 40, 80, 0.3)' : 'rgba(0, 40, 80, 0.3)';
            }
        });

        const startDownload = (clickX, clickY) => {
            const formatInfo = {
                formatId: f.format_id,
                formatExpose: f.ext_expose,
                resolution: f.resolution,
                ext: f.ext,
                filesize: f.filesize,
                isAudio: isAudio,
                originalUrl: videoUrl
            };

            const dialogPos = calculateDialogPosition(clickX, clickY);

            const confirmDialog = document.createElement('div');
            const dialogColor = isAudio ? '#b1ffff' : '#b1ffff';

            confirmDialog.style.cssText = `
        position: fixed;
        top: ${dialogPos.y}px;
        left: ${dialogPos.x}px;
        background: #000000a5;
        padding: 2rem;
        z-index: 10000;
        color: #fffffd;
        font-family: 'Orbitron', monospace;
        text-align: center;
        min-width: 300px;
        transform: translate(0, 0);

        --aug-tl: 2rem;
        --aug-tr: 2rem;
        --aug-br: 2rem;
        --aug-bl: 2rem;
        --aug-border-all: 2px;
        --aug-border-bg: 
            radial-gradient(circle at top left, ${dialogColor}, ${dialogColor} 20%, transparent 1.75rem),
            radial-gradient(circle at top right, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, ${dialogColor}, ${dialogColor} 20%, transparent 1.75rem);
        box-shadow: 0 0 30px ${dialogColor}50;
    `;
            confirmDialog.setAttribute('data-augmented-ui', 'tl-round tr-round br-round bl-round border');

            const formatType = isAudio ? 'Audio' : 'Video';
            const resolutionInfo = isAudio ? 'audio only' : f.resolution;
            let setDImage = null;
            if (f.ext_expose == 'image') {
                setDImage = 'download-image.png'
            } else if (f.ext_expose == 'video') {
                setDImage = 'download-video.png';
            }
            else if (f.ext_expose == 'audio') {
                setDImage = 'download-audio.png';
            }
            else {
                setDImage = 'document.png';
            }

            confirmDialog.innerHTML = `
        <h3 style="color: ${dialogColor}; margin-bottom: 1rem; text-shadow: 0 0 10px ${dialogColor}70;">
             EMEZA KUZANA ${f.ext_expose ? f.ext_expose.toUpperCase() : formatType.toUpperCase()} YAWE <img style="height: 20px;width:20px;filter: drop-shadow(0 0 0.5rem rgba(0, 255, 255, 0.8)) brightness(0) invert(1);" src="static/images/${setDImage}" />
        </h3>
        <div style="margin-bottom: 1.5rem; font-size: 0.9rem;">
            <p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">Format:</span>
                <span style="color: ${dialogColor};">${f.format_id} (${f.ext})</span>
            </p>
            <p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">Type:</span>
                <span style="color: ${dialogColor};">${formatType} - ${resolutionInfo}</span>
            </p>
            <p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">Size:</span>
                <span style="color: ${dialogColor};">${humanSize(f.filesize)}</span>
            </p>
            ${f.abr ? `<p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">Bitrate:</span>
                <span style="color: ${dialogColor};">${f.abr}</span>
            </p>` : ''}
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirm-download" style="
                padding: 0.6rem 1.2rem;
                background: ${isAudio ? 'springgreen' : 'springgreen'};
                color: #fff;
                border: none;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                --aug-tl: 0.8rem;
                --aug-tr: 0.8rem;
                --aug-br: 0.8rem;
                --aug-bl: 0.8rem;
                --aug-border-all: 1px;
                --aug-border-bg: ${dialogColor}60;
                box-shadow: 0 0 12px ${dialogColor}50;
            " data-augmented-ui="tl-round tr-round br-round bl-round border">
                Zana ${formatType}
            </button>
            <button id="cancel-download" style="
                padding: 0.6rem 1.2rem;
                background: rgba(255, 0, 0, 0.9);
                color: #fff;
                border: none;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                --aug-tl: 0.8rem;
                --aug-tr: 0.8rem;
                --aug-br: 0.8rem;
                --aug-bl: 0.8rem;
                --aug-border-all: 1px;
                --aug-border-bg: rgba(255, 0, 136, 1);
                box-shadow: 0 0 12px rgba(255, 30, 180, 1);
            " data-augmented-ui="tl-round tr-round br-round bl-round border">
                Reka
            </button>
        </div>
    `;

            document.body.appendChild(confirmDialog);

            const dialogRect = confirmDialog.getBoundingClientRect();
            const endX = dialogRect.left + dialogRect.width / 2;
            const endY = dialogRect.top;

            setTimeout(() => {
                createConnectionLine(clickX, clickY, endX, endY);
            }, 1000);

            document.getElementById('confirm-download').onclick = () => {
                removeConnectionLine();
                document.body.removeChild(confirmDialog);
                proceedWithDownload(formatInfo);
            };

            document.getElementById('cancel-download').onclick = () => {
                removeConnectionLine();
                document.body.removeChild(confirmDialog);
            };

            confirmDialog.onclick = (e) => {
                if (e.target === confirmDialog) {
                    removeConnectionLine();
                    document.body.removeChild(confirmDialog);
                }
            };
        };

        const proceedWithDownload = async (formatInfo) => {
            console.log("PWD: ", formatInfo)
            try {
                const dl = await fetch(`${BASE_URL}/download/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: videoUrl, format_id: formatInfo.formatId })
                });
                const res = await dl.json();

                if (res.status === 'started') {
                    showDownloadStartedNotification(res.download_id, formatInfo);
                    showDownloadingNotification(res.download_title)

                    const downloadElement = addDownloadToManager(res.download_id, formatInfo);
                    if (window.downloadWebSocket) {
                        window.downloadWebSocket.startPolling(res.download_id);
                    }

                    document.querySelectorAll('.download-item').forEach(dl => dl.classList.remove('active'));
                    downloadElement.classList.add('active');
                    showHighlightedInfo(res.download_id, activeDownloads.get(res.download_id), {});

                } else {
                    showErrorNotification(`Error: ${res.error}`)
                }
            } catch (err) {
                showErrorNotification('Network error: ' + err.message);
            }
        };

        // Function to show type-specific download started notification
        const showDownloadStartedNotification = (downloadId, formatInfo) => {
            const isAudio = formatInfo.isAudio;
            const notificationColor = isAudio ? '#00ffff' : '#00ffff';
            const icon = isAudio ? '🎵' : '🎥';

            const notification = document.createElement('div');
            notification.style.cssText = `
        position: fixed;
        top: 70px;
        right: 200px;
        background: #000000a5;
        padding: 1.5rem;
        z-index: 10000;
        color: #fffffd;
        font-family: 'Orbitron', monospace;
        min-width: 300px;

        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: 2px;
        --aug-border-bg: 
            radial-gradient(circle at top left, ${notificationColor}, ${notificationColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at top right, ${notificationColor}, ${notificationColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, ${notificationColor}, ${notificationColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, ${notificationColor}, ${notificationColor} 1.75rem, transparent 1.75rem);
        box-shadow: 0 0 30px ${notificationColor}50;
    `;
            notification.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip bl-clip border');

            notification.innerHTML = `
        <h3 style="color: ${notificationColor}; margin-bottom: 1rem; text-shadow: 0 0 10px ${notificationColor}70;">
            KUZANA ${f.ext_expose ? f.ext_expose.toUpperCase() : `${isAudio ? 'AUDIO' : 'VIDEO'}`} YAWE  BYATANGIYE <img style="height: 20px;width:20px;filter: drop-shadow(0 0 0.5rem rgba(0, 255, 255, 0.8)) brightness(0) invert(1);" src="static/images/${setDImage}" />
        </h3>
        <div style="font-size: 0.9rem;">
            <p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">ID:</span>
                <span style="color: ${notificationColor};">${downloadId}</span>
            </p>
            <p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">Ubwoko:</span>
                ${f.ext_expose ? `<span style="color: ${notificationColor};">${f.ext_expose.toUpperCase()}</span>`
                    : `<span style="color: ${notificationColor};">${isAudio ? 'Audio' : 'Video'}</span>`
                }
            </p>
            <p style="margin: 0.5rem 0; display: flex; justify-content: space-between;">
                <span style="color: #88ffff;">Format:</span>
                <span style="color: ${notificationColor};">${formatInfo.resolution || 'Unknown'}</span>
            </p>
            <p style="margin: 1rem 0 0; padding-top: 0.5rem; border-top: 1px solid ${notificationColor}30; color: #b1ffff;">
                Yirebe Muri Download Manager ...
            </p>
        </div>
    `;

            document.body.appendChild(notification);

            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 10000);
        };

        // Function to show styled error notification
        const showErrorNotification = (message) => {
            const notification = document.createElement('div');
            notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(20, 0, 0, 0.95);
        backdrop-filter: blur(8px);
        padding: 1.5rem;
        z-index: 10000;
        color: #fffffd;
        font-family: 'Orbitron', monospace;
        min-width: 300px;

        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: 2px;
        --aug-border-bg: 
            radial-gradient(circle at top left, #ff4444, #ff4444 1.75rem, transparent 1.75rem),
            radial-gradient(circle at top right, #ff4444, #ff4444 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, #ff4444, #ff4444 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, #ff4444, #ff4444 1.75rem, transparent 1.75rem);
        box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
    `;
            notification.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip bl-clip border');

            notification.innerHTML = `
        <h3 style="color: #ff4444; margin-bottom: 1rem; text-shadow: 0 0 10px rgba(255, 0, 0, 0.7);">
            DOWNLOAD ERROR
        </h3>
        <p style="color: #ff8888; font-size: 0.9rem; margin: 0;">${message}</p>
    `;

            document.body.appendChild(notification);

            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 5000);
        };

        // Double click to download
        row.ondblclick = (e) => {
            e.stopPropagation();
            const clickX = e.clientX;
            const clickY = e.clientY;
            startDownload(clickX, clickY);
        };

        // Click on "more" column to download
        row.querySelector('.more').style.cursor = 'pointer';
        row.querySelector('.more').onclick = (e) => {
            e.stopPropagation();
            const clickX = e.clientX;
            const clickY = e.clientY;
            startDownload(clickX, clickY);
        };

        tbody.appendChild(row);
        return row;
    };

    fetchBtn.addEventListener('click', fetchFormats);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchFormats(); });

    // Sound effects
    const loadingSound = document.getElementById('loading-sound');

    let sounds = ['click-sound2', 'click-sound3', 'click-sound4', 'click-sound1']
    let choosenSound = sounds[Math.floor(Math.random() * sounds.length)]
    document.addEventListener("click", () => {
        const clickSound = document.getElementById(choosenSound);
        const sound = clickSound.cloneNode();
        sound.volume = 0.9;
        sound.play().catch(() => { });
        console.log("Playing sound: click sound add ", choosenSound)
    });

    document.addEventListener("dblclick", () => {
        const clickSound = document.getElementById(choosenSound);
        const sound = clickSound.cloneNode();
        sound.volume = 0.9;
        sound.play().catch(() => { });
        console.log("Playing sound: click sound add ", choosenSound)
    });

    const demo3d = document.querySelector('.demo-3d');
    demo3d.addEventListener('mouseenter', () => {
        const sound = loadingSound.cloneNode();
        sound.volume = 0.2;
        sound.playbackRate = .7;
        sound.play().catch(() => { });
    });

    // 3D demo interactions
    const hexItems = document.querySelectorAll('.all-hex-grid [data-augmented-ui]');

    hexItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
            this.style.filter = 'brightness(1.3) drop-shadow(0 0 15px #b1ffff))';
            this.style.boxShadow = '0 0 25px rgba(0, 255, 255, 1)';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.filter = '';
            this.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
        });
    });

    const compressGroup3d = () => {
        const el = document.getElementById("group3d");
        el && el.classList.add("compressed");
        document.body.setAttribute("data-highlight-info", "");
    };

    const expandGroup3d = () => {
        const el = document.getElementById("group3d");
        el && el.classList.remove("compressed");
        document.body.setAttribute("data-highlight-info", "");
    };

    const group3d = document.getElementById("group3d");
    if (group3d) {
        group3d.addEventListener('mouseenter', expandGroup3d);
        group3d.addEventListener('mouseleave', compressGroup3d);
    }
    setTimeout(compressGroup3d, 5000);

    const labels = {
        networks: document.getElementById('networks'),      // Network SSID
        osname: document.getElementById('osname'),       // OS name
        isonline: document.getElementById('isonline'),     // Online / Offline
        percentage: document.getElementById('percentage-battery') // Battery %
    };

    // Helper: format battery (number → string, "No battery" stays)
    const formatBattery = (val) => {
        if (typeof val === 'number') return `${val.toFixed(0)}%`;
        return val; // e.g. "No battery detected"
    };

    // Helper: online → Yes / No with colour
    const formatOnline = (online) => {
        return online
            ? '<span style="color:#0f0;">Online</span>'
            : '<span style="color:#f66;">Disconnected</span>';
    };

    // Fetch once on load + every 30 seconds (or adjus

    // Settings page functionality
    const settingsHex = document.querySelector('a[href="#"]'); // The database icon (third hexagon)
    const settingsPage = document.getElementById('settings-page');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    closeSettings.setAttribute('data-augmented-ui', 'tr-clip br-clip bl-clip border');
    saveSettings.setAttribute('data-augmented-ui', 'tr-clip br-clip bl-clip border');

    // OPEN SETTINGS
    settingsHex.addEventListener('click', (e) => {
        e.preventDefault();
        settingsPage.style.display = 'flex';
    });

    // CLOSE SETTINGS
    closeSettings.addEventListener('click', () => {
        settingsPage.style.display = 'none';
    });

    // SAVE SETTINGS
    saveSettings.addEventListener('click', () => {
        const downloadLocation = document.getElementById('download-location').value;
        const downloadTimeout = document.getElementById('download-timeout').value;

        const sendSettings = async () => {
            try {
                const resp = await fetch(`${BASE_URL}/ds/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ downloadLocation, downloadTimeout })
                });

            } catch (e) {
            }
        };

        sendSettings()

        // Show save confirmation
        showNotification("Settings Saved", "success")
    });

    // Close settings when clicking outside
    settingsPage.addEventListener('click', (e) => {
        if (e.target === settingsPage) {
            settingsPage.style.display = 'none';
        }
    });

    // Network controls
    const dec_internet = document.getElementById("decreaseinternet");
    const inc_internet = document.getElementById("increaseinternet");
    const home = document.getElementById("searchinterface");


    inc_internet.addEventListener("click", () => { fetch(`${BASE_URL}/inc/`).then(() => { showNotification("Wongereye Umuvuduko Wo Downloadinga"); }).catch(err => showNotification("Error while Increasing Speed", "error")) })
    dec_internet.addEventListener("click", () => { fetch(`${BASE_URL}/dec/`).then(() => showNotification("Ugabanyije Umuvuduko Wo Downloadinga")).catch(err => showNotification("Ikibazo Uri Ku Gabanya Umuvuduko Wo Kuzana Ibinu", "error")) })

});


window.Shaka = () => {
    document.getElementById("bottom-curved-hex-grid").style.display = 'none';
    // State
    let currentSearchType = 'all'; // videos, audios, images, all
    let originalDownloads = []; // Store original downloads before filtering
    let searchTimeout = null;

    // Create container and append to body
    const container = document.createElement('div');
    container.className = 'shaka-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 45.6%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 570px;
        z-index: 10000; /* Increased z-index to be above other elements */
    `;
    document.body.appendChild(container);
    let randomAudioIcons = ['audio.png', 'audio2.png', 'audio3.png', 'audio4.png'];
    let randomVideoIcons = ['video.png', 'video2.png', 'video3.png', 'video4.png', 'video5.png'];
    let randomImageIcons = ['image.png', 'image2.png', 'image3.png']
    let videoIconNow = randomVideoIcons[Math.floor(Math.random() * randomVideoIcons.length)];
    let audioIconNow = randomAudioIcons[Math.floor(Math.random() * randomAudioIcons.length)];
    let imageIconNow = randomImageIcons[Math.floor(Math.random() * randomImageIcons.length)];

    // Create the iMessage interface
    container.innerHTML = `
        <div class="imessage-input-container">
            <div class="input-icons">
                <div class="input-icon" data-icon="videos" title="Ama Video">
                    <img src="static/images/${videoIconNow}"  width="20" >
                </div>
                <div class="input-icon" data-icon="audios" title="Ama Audio">
                    <img src="static/images/${audioIconNow}"  width="20" >
                </div>
                <div class="input-icon" data-icon="images" title="Ama Foto">
                    <img src="static/images/${imageIconNow}"  width="20" >
                </div>
                <div class="input-icon active" data-icon="all" title="Byose">
                    <img src="static/images/snaiper.png"  width="20" >
                </div>
            </div>
            
            <div class="input-area">
                <textarea 
                    class="imessage-input" 
                    placeholder="Shaka muri zose..."
                    rows="1"
                    id="shaka-search-input"
                    autocomplete="off" 
                    spellcheck="false"
                    autocomplete="off" 
                    autocorrect="off" 
                    autocapitalize="off"

                ></textarea>
                
                <div class="input-actions">
                    <button class="close-button" id="shaka-close-button" title="Reka Gushaka">
                        <img src="static/images/cancel.png"  width="20" >
                    </button>
                </div>
            </div>
        </div>
        <div class="shaka-status" style="display:none; margin-top:10px; text-align:center; color:#88ffff; font-size:12px; font-family:'Outfit', monospace;">
            Habonywe <span id="shaka-results-count">0</span> Zihura
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#shaka-styles')) {
        const style = document.createElement('style');
        style.id = 'shaka-styles';
        style.textContent = `
            .shaka-container {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', 'Segoe UI', system-ui, sans-serif;
            }
            
            .imessage-input-container {
                background: rgba(0, 0, 0, 0.18);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                border-radius: 24px;
                padding: 16px 20px;
                border: 1px solid rgba(255, 255, 255, 0.69);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: flex-end;
                transition: all 0.3s ease;
            }
            
            .imessage-input-container:focus-within {
                background: rgba(0, 0, 0, 0.21);
                border-color: rgba(181, 184, 187, 0.65);
                box-shadow: 0 10px 40px rgba(0, 122, 255, 0.15);
            }
            
            .input-icons {
                display: flex;
                align-items: center;
                margin-right: 16px;
                padding-bottom: 10px;
            }
            
            .input-icon {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.7);
                margin-right: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .input-icon:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.05);
            }
            
            .input-icon.active {
                background: rgba(0, 122, 255, 0.2);
                color: #007AFF;
            }
            
            .input-icon[data-icon="videos"].active {
                background: rgba(255, 45, 83, 1);
                color: #fc3257ff;
            }
            
            .input-icon[data-icon="audios"].active {
                background: rgba(88, 86, 214, 1);
                color: #5856D6;
            }
            
            .input-icon[data-icon="images"].active {
                background: rgba(52, 199, 89, 1);
                color: #34C759;
            }
            
            .input-icon[data-icon="all"].active {
                background: rgba(255, 255, 255, 0.34);
                color: #FFCC00;
            }
            
            .input-area {
                flex: 1;
                display: flex;
                flex-direction: row;
                position: relative;
                left: 0%;
            }
            
            .imessage-input {
                border: none;
                background: transparent;
                font-size: 15px;
                color: #fff;
                outline: none;
                resize: none;
                font-family: inherit;
                min-height: 24px;
                max-height: 120px;
                line-height: 1.4;
                padding: 6px 0;
                width: 100%;
                font-family: 'SF Pro';
                font-weight: bold;
            }
            
            .imessage-input::placeholder {
                color: #8E8E93;
            }
            
            .input-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-top: 12px;
            }
            
            .close-button {
                background: rgba(255, 59, 48, 0.2); /* Light red background */
                border: 1px solid rgba(255, 59, 48, 0.3);
                border-radius: 50%;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(255, 59, 48, 0.8);
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(255, 59, 48, 0.15);
            }
            
            .close-button:hover {
                background: rgba(255, 45, 83, 1);
                transform: scale(1.2);
                box-shadow: 0 6px 16px rgba(255, 59, 48, 0.25);
            }
            
            .close-button:active {
                transform: scale(0.98);
            }
            
            .shaka-highlight {
                background: rgba(0, 149, 246, 0.2) !important;
                border: 1px solid rgba(0, 149, 246, 0.4) !important;
            }
            
            @media (max-width: 600px) {
                .imessage-input-container {
                    padding: 14px 18px;
                    border-radius: 22px;
                }
                
                .input-icon {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                }
                
                .close-button {
                    width: 40px;
                    height: 40px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Get DOM elements
    const messageInput = container.querySelector('.imessage-input');
    const closeButton = container.querySelector('.close-button');
    const inputIcons = container.querySelectorAll('.input-icon');
    const statusDiv = container.querySelector('.shaka-status');
    const resultsCount = document.getElementById('shaka-results-count');

    // Determine item type from element
    function getItemType(item) {
        const filename = item.querySelector('.download-filename')?.textContent || '';
        const ext = getFileExtension(filename).toLowerCase();

        // Check if it's a history item
        if (item.hasAttribute('data-history-id')) {
            // Try to get category from download details
            const details = item.querySelector('.download-details');
            if (details) {
                const spans = details.querySelectorAll('span');
                for (let span of spans) {
                    const text = span.textContent.toLowerCase();
                    if (text.includes('video')) return 'videos';
                    if (text.includes('audio')) return 'audios';
                    if (text.includes('image')) return 'images';
                }
            }
        }

        // Check file extension
        const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v', 'mpg', 'mpeg'];
        const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma', 'aiff'];
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff'];

        if (videoExts.includes(ext)) return 'videos';
        if (audioExts.includes(ext)) return 'audios';
        if (imageExts.includes(ext)) return 'images';

        // For active downloads, check the download info text
        const downloadInfo = item.querySelector('.download-info');
        if (downloadInfo) {
            const infoText = downloadInfo.textContent.toLowerCase();
            if (infoText.includes('audio')) return 'audios';
            if (infoText.includes('video')) return 'videos';
        }

        return 'other';
    }

    // Get file extension
    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    // Get all downloads from the page
    function getAllDownloads() {
        const downloadList = document.getElementById('real-downloads-container');
        if (!downloadList) return [];

        const allItems = Array.from(downloadList.querySelectorAll('.download-item'));
        return allItems.map(item => ({
            element: item,
            type: getItemType(item),
            name: item.querySelector('.download-filename')?.textContent || '',
            details: item.querySelector('.download-details')?.textContent || ''
        }));
    }

    // Filter downloads based on search
    function filterDownloads(searchTerm, type) {
        const downloadList = document.getElementById('real-downloads-container');
        if (!downloadList) return 0;

        const allDownloads = getAllDownloads();
        let visibleCount = 0;

        // If search term is empty, show all downloads
        if (!searchTerm.trim()) {
            restoreAllDownloads();
            return allDownloads.length;
        }

        // Remove highlight from all items first
        allDownloads.forEach(item => {
            item.element.classList.remove('shaka-highlight');
        });

        // Hide all items first
        allDownloads.forEach(item => {
            item.element.style.display = 'none';
        });

        // Show only matching items
        allDownloads.forEach(item => {
            const matchesType = type === 'all' || item.type === type;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.details.toLowerCase().includes(searchTerm.toLowerCase());

            if (matchesType && matchesSearch) {
                item.element.style.display = '';
                item.element.classList.add('shaka-highlight');
                visibleCount++;
            }
        });

        // Update empty state
        updateEmptyState();

        return visibleCount;
    }

    // Restore all downloads
    function restoreAllDownloads() {
        const allDownloads = getAllDownloads();
        allDownloads.forEach(item => {
            item.element.style.display = '';
            item.element.classList.remove('shaka-highlight');
        });
        updateEmptyState();
    }

    // Update empty state visibility
    function updateEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            const visibleItems = Array.from(document.querySelectorAll('.download-item'))
                .filter(item => item.style.display !== 'none');
            emptyState.style.display = visibleItems.length === 0 ? 'block' : 'none';
        }
    }

    // Auto-expand textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';

        // Debounced search (auto-search as user types)
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });

    // Perform the search
    function performSearch() {
        const searchTerm = messageInput.value.trim();
        if (!searchTerm) {
            restoreAllDownloads();
            hideStatus();
            return;
        }

        const count = filterDownloads(searchTerm, currentSearchType);

        // Update status display
        resultsCount.textContent = count;
        statusDiv.style.display = 'block';
    }

    // Hide status display
    function hideStatus() {
        statusDiv.style.display = 'none';
    }

    // Input icon interactions
    inputIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const iconType = this.getAttribute('data-icon');

            // Remove active class from all icons
            inputIcons.forEach(i => i.classList.remove('active'));
            // Add active class to clicked icon
            this.classList.add('active');

            // Update current search type
            currentSearchType = iconType;

            // Change input placeholder based on selected icon
            const placeholders = {
                audios: "Shaka Muma Audio...",
                images: "Shaka Muma Foto...",
                videos: "Shaka Muma Video...",
                all: "Shaka muri zose..."
            };

            messageInput.placeholder = placeholders[iconType] || "Shaka muri zose...";

            // If there's a search term, re-filter with new type
            if (messageInput.value.trim().length > 0) {
                performSearch();
            }
        });
    });


    // Close button click - close the search interface
    closeButton.addEventListener('click', function () {
        // Animation feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);

        // Clear search and restore all downloads
        messageInput.value = '';
        restoreAllDownloads();
        hideStatus();

        // Hide the search interface
        container.style.display = 'none';
        document.getElementById("bottom-curved-hex-grid").style.display = '';

        // Reset textarea height
        messageInput.style.height = 'auto';
    });

    // Search on Enter (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            performSearch();
        }

        // Escape key closes the search interface
        if (e.key === 'Escape') {
            e.preventDefault();
            closeButton.click();
        }
    });

    // Focus input when clicking anywhere on the input container
    container.querySelector('.imessage-input-container').addEventListener('click', function (e) {
        if (!e.target.closest('.input-icon') && e.target !== closeButton) {
            messageInput.focus();
        }
    });

    // Clear search when input is cleared
    messageInput.addEventListener('keyup', function (e) {
        if (e.key === 'Escape' || (this.value === '' && e.key === 'Backspace')) {
            restoreAllDownloads();
            hideStatus();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', function (e) {
        if (!container.contains(e.target) && messageInput.value.trim() === '') {
            // Only blur if no search term
            messageInput.blur();
        }
    });

    // Auto-focus the input
    setTimeout(() => messageInput.focus(), 100);

    // Public API methods
    const api = {
        // Set search term
        search: function (term, type = null) {
            if (type) {
                currentSearchType = type;
                // Update active icon
                inputIcons.forEach(icon => {
                    if (icon.getAttribute('data-icon') === type) {
                        icon.click();
                    }
                });
            }
            messageInput.value = term;
            messageInput.dispatchEvent(new Event('input'));
        },

        // Clear search
        clear: function () {
            messageInput.value = '';
            messageInput.dispatchEvent(new Event('input'));
            restoreAllDownloads();
            hideStatus();
        },

        // Set search type
        setType: function (type) {
            inputIcons.forEach(icon => {
                if (icon.getAttribute('data-icon') === type) {
                    icon.click();
                }
            });
        },

        // Get current search term
        getSearchTerm: () => messageInput.value,

        // Get current search type
        getSearchType: () => currentSearchType,

        // Focus input
        focus: () => messageInput.focus(),

        // Blur input
        blur: () => messageInput.blur(),

        // Destroy instance
        destroy: () => {
            // Restore original downloads before removing
            restoreAllDownloads();
            container.remove();
        },

        // Refresh search (useful when new downloads are added)
        refresh: () => {
            // Re-apply current search if any
            if (messageInput.value.trim().length > 0) {
                performSearch();
            }
        },

        // Toggle visibility
        toggle: function () {
            playClickSound()
            if (container.style.display === 'none') {
                container.style.display = 'block';
                document.getElementById("bottom-curved-hex-grid").style.display = 'none';
                messageInput.focus();
            } else {
                // When toggling off, clear search and close
                messageInput.value = '';
                restoreAllDownloads();
                hideStatus();
                container.style.display = 'none';
                document.getElementById("bottom-curved-hex-grid").style.display = '';
            }
        }
    };

    return api;
}

// Helper function to show notification (from your existing code)
function showNotification(message, type = "success") {
    // Use your existing notification system
    // You can replace this with your actual notification function
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    }
}

// Add keyboard shortcut to open/close Shaka search
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!window.shakaInstance) {
            window.shakaInstance = Shaka();
        } else {
            window.shakaInstance.toggle();
        }
    }
});

// Global functions for action buttons
async function openDownloadedFile(filename) {
    if (!filename) {
        showNotification('No file path available', 'error');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/open-file/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath: filename })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Opening file...', 'success');
        } else {
            showNotification(`Failed to open file: ${result.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showNotification('Error opening file: ' + error.message, 'error');
    }
}

async function openFileLocation(filepath) {
    if (!filepath) {
        showNotification('No file path available', 'error');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/open-file-location/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath: filepath })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Opening file location...', 'success');
        } else {
            showNotification(`Failed to open file location: ${result.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showNotification('Error opening file location: ' + error.message, 'error');
    }
}

async function openDownloadedFileFromHistory(filepath) {
    if (!filepath) {
        showNotification('No file path available', 'error');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/open-file/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath: filepath })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Opening file...', 'success');
        } else {
            showNotification(`Failed to open file: ${result.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        showNotification('Error opening file: ' + error.message, 'error');
    }
}

async function redownloadFromHistory(historyId) {
    try {
        const response = await fetch(`${BASE_URL}/history/${historyId}/redownload/`, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            showNotification('Redownload started!', 'success');
        } else {
            showNotification('Failed to start redownload', 'error');
        }
    } catch (error) {
        showNotification('Error starting redownload: ' + error.message, 'error');
    }
}

// Delete functions with custom confirmation dialogs - FIXED URLs
async function deleteFromHistory(historyId) {
    const historyItem = document.querySelector(`[data-history-id="${historyId}"]`);
    const filename = historyItem ? historyItem.querySelector('.download-filename').textContent : 'this download';

    showDeleteConfirmation(historyId, filename, 'history');
}

async function deleteFromManager(downloadId) {
    const downloadItem = document.querySelector(`[data-download-id="${downloadId}"]`);
    const filename = downloadItem ? downloadItem.querySelector('.download-filename').textContent : 'this download';

    showDeleteConfirmation(downloadId, filename, 'manager');
}

async function clearAllHistory() {
    showClearAllConfirmation();
}

function showDeleteConfirmation(targetId, filename, type) {
    const confirmDialog = document.createElement('div');
    const dialogColor = '#ff0000ff';
    const dialogBg = 'rgba(20, 0, 0, 0.76)';

    confirmDialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${dialogBg};
        padding: 2rem;
        z-index: 10000;
        color: #fffffd;
        font-family: 'Orbitron', monospace;
        text-align: center;
        min-width: 400px;
        max-width: 500px;

        --aug-tl: 2rem;
        --aug-tr: 2rem;
        --aug-br: 2rem;
        --aug-bl: 2rem;
        --aug-border-all: 2px;
        --aug-border-bg: 
            radial-gradient(circle at top left, ${dialogColor}, ${dialogColor} 20%, transparent 1.75rem),
            radial-gradient(circle at top right, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, ${dialogColor}, ${dialogColor} 20%, transparent 1.75rem);
        box-shadow: 0 0 30px ${dialogColor}50;
    `;
    confirmDialog.setAttribute('data-augmented-ui', 'tl-round tr-round br-round bl-round border');

    const isHistory = type === 'history';
    const title = isHistory ? 'SIBA MUZO UBITSE' : 'SIBA MUZO WA DOWNLOADINZE';

    confirmDialog.innerHTML = `
        <h3 style="color: ${dialogColor}; margin-bottom: 1rem; text-shadow: 0 0 10px ${dialogColor}70;">
            <img style="height: 20px;width:20px;filter: drop-shadow(0 0 0.5rem #b1ffff) brightness(0) invert(1);" src="static/images/attention.png" /> ${title}
        </h3>
        <div style="margin-bottom: 1.5rem; font-size: 0.9rem; text-align: left;">
            <p style="margin: 0.5rem 0; color: #ff0000ff;">
                U Jyiye Gusiba: <span style="color: #fffffd;">${filename.length > 35 ? filename.slice(0, 35) + "..." : filename}</span>
            </p>
            ${isHistory ? `
            <div style="background: rgba(255, 0, 0, 0.1); padding: 1rem; margin: 1rem 0; border-radius: 0.5rem;">
                <label style="display: flex; align-items: center; cursor: pointer; color: #ff0000ff;">
                    <input type="checkbox" id="delete-file-checkbox" style="margin-right: 0.5rem;accent-color: #ff0000ff;">
                    Siba no kuri disk
                </label>
            </div>
            ` : ''}
            <p style="color: #ff0000ff; font-size: 0.8rem; margin-top: 1rem;">
                <strong> Icyi Gikorwa nago gisubizwa inyuma </strong>
            </p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirm-delete" style="
                padding: 0.6rem 1.2rem;
                background: rgba(120, 0, 0, 0.9);
                color: #fff;
                border: none;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                --aug-tl: 0.8rem;
                --aug-tr: 0.8rem;
                --aug-br: 0.8rem;
                --aug-bl: 0.8rem;
                --aug-border-all: 1px;
                --aug-border-bg: ${dialogColor};
                box-shadow: 0 0 12px ${dialogColor}50;
            " data-augmented-ui="tl-round tr-round br-round bl-round border">
                SIBA
            </button>
            <button id="cancel-delete" style="
                padding: 0.6rem 1.2rem;
                background: rgba(0, 40, 80, 0.9);
                color: #fff;
                border: none;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                --aug-tl: 0.8rem;
                --aug-tr: 0.8rem;
                --aug-br: 0.8rem;
                --aug-bl: 0.8rem;
                --aug-border-all: 1px;
                --aug-border-bg: rgba(0, 255, 255, 0.6);
                box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
            " data-augmented-ui="tl-round tr-round br-round bl-round border">
                REKA
            </button>
        </div>
    `;

    document.body.appendChild(confirmDialog);

    // Handle confirmation
    document.getElementById('confirm-delete').addEventListener("click", async () => {
        const sibanokuridisk = document.getElementById("delete-file-checkbox");
        document.body.removeChild(confirmDialog);
        try {
            // Always delete from history first
            await fetch(`${BASE_URL}/history/${targetId}/delete/`);

            if (sibanokuridisk.checked) {
                await fetch(`delete-download/${encodeURIComponent(filename)}/`, {
                    method: 'DELETE'
                });

                showNotification(`${filename.length > 0 ? filename.slice(0, 30) + "..." : filename} Irasibwe!`);
                playErrorSound();
            }

            performManagerDelete(targetId);
            loadHistoryDownloads();

        } catch (err) {
            showNotification(`Biranze Gusiba ${filename}!`);
        }
    });

    // Handle cancellation
    document.getElementById('cancel-delete').onclick = () => {
        document.body.removeChild(confirmDialog);
    };

    // Close on outside click
    confirmDialog.onclick = (e) => {
        if (e.target === confirmDialog) {
            document.body.removeChild(confirmDialog);
        }
    };
}

function showClearAllConfirmation() {
    const confirmDialog = document.createElement('div');
    const dialogColor = '#ff4444';
    const dialogBg = 'rgba(20, 0, 0, 0.95)';

    confirmDialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${dialogBg};
        backdrop-filter: blur(8px);
        padding: 2rem;
        z-index: 10000;
        color: #fffffd;
        font-family: 'Orbitron', monospace;
        text-align: center;
        min-width: 400px;
        max-width: 500px;

        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: 2px;
        --aug-border-bg: 
            radial-gradient(circle at top left, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at top right, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, ${dialogColor}, ${dialogColor} 1.75rem, transparent 1.75rem);
        box-shadow: 0 0 30px ${dialogColor}50;
    `;
    confirmDialog.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip bl-clip border');

    confirmDialog.innerHTML = `
        <h3 style="color: ${dialogColor}; margin-bottom: 1rem; text-shadow: 0 0 10px ${dialogColor}70;">
            ⚠️ CLEAR ALL HISTORY
        </h3>
        <div style="margin-bottom: 1.5rem; font-size: 0.9rem; text-align: left;">
            <p style="margin: 0.5rem 0; color: #ff8888;">
                You are about to delete <span style="color: #fffffd;">ALL</span> download history
            </p>
            <div style="background: rgba(255, 0, 0, 0.1); padding: 1rem; margin: 1rem 0; border-radius: 0.5rem;">
                <label style="display: flex; align-items: center; cursor: pointer; color: #ff8888;">
                    <input type="checkbox" id="delete-all-files-checkbox" style="margin-right: 0.5rem;">
                    Also delete all actual files from disk
                </label>
            </div>
            <p style="color: #ff6666; font-size: 0.8rem; margin-top: 1rem;">
                This action cannot be undone and will remove all download records!
            </p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirm-clear-all" style="
                padding: 0.6rem 1.2rem;
                background: rgba(120, 0, 0, 0.9);
                color: #fff;
                border: none;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                --aug-tl: 0.8rem;
                --aug-tr: 0.8rem;
                --aug-br: 0.8rem;
                --aug-bl: 0.8rem;
                --aug-border-all: 1px;
                --aug-border-bg: ${dialogColor};
                box-shadow: 0 0 12px ${dialogColor}50;
            " data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
                CLEAR ALL
            </button>
            <button id="cancel-clear-all" style="
                padding: 0.6rem 1.2rem;
                background: rgba(0, 40, 80, 0.9);
                color: #fff;
                border: none;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                --aug-tl: 0.8rem;
                --aug-tr: 0.8rem;
                --aug-br: 0.8rem;
                --aug-bl: 0.8rem;
                --aug-border-all: 1px;
                --aug-border-bg: rgba(0, 255, 255, 0.6);
                box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
            " data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
                CANCEL
            </button>
        </div>
    `;

    document.body.appendChild(confirmDialog);

    // Handle confirmation
    document.getElementById('confirm-clear-all').onclick = async () => {
        document.body.removeChild(confirmDialog);
        const deleteFiles = document.getElementById('delete-all-files-checkbox').checked;
        await performClearAllHistory(deleteFiles);
    };

    // Handle cancellation
    document.getElementById('cancel-clear-all').onclick = () => {
        document.body.removeChild(confirmDialog);
    };

    // Close on outside click
    confirmDialog.onclick = (e) => {
        if (e.target === confirmDialog) {
            document.body.removeChild(confirmDialog);
        }
    };
}


async function performHistoryDelete(historyId, deleteFile) {
    try {
        // SIMPLE RAW DELETE REQUEST - NO FANCY ERROR CHECKING
        const url = `${BASE_URL}/history/${historyId}/`;

        // Just send the raw request
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                delete_file: deleteFile
            })
        });

        // Remove from UI immediately without waiting for response
        const downloadItem = document.querySelector(`[data-history-id="${historyId}"]`);
        if (downloadItem) {
            downloadItem.remove();
        }

        showNotification('Download deleted', 'success');

        // Update empty state if needed
        const container = document.getElementById('real-downloads-container');
        const totalDownloads = container.querySelectorAll('.download-item').length;
        const emptyState = document.getElementById('empty-state');
        if (emptyState && totalDownloads === 0) {
            emptyState.style.display = 'block';
        }

    } catch (error) {
        // Just show basic error, no fancy handling
        showNotification('Deleted from UI', 'success');
    }
}

async function performManagerDelete(downloadId) {
    try {
        // SIMPLE DELETE - JUST REMOVE FROM UI
        const downloadItem = document.querySelector(`[data-download-id="${downloadId}"]`);
        if (downloadItem) {
            downloadItem.remove();
            showNotification("Irasibwe")
        }

        // Remove from activeDownloads map
        if (typeof activeDownloads !== 'undefined') {
            activeDownloads.delete(downloadId);
        }

        // Update empty state if needed
        const container = document.getElementById('real-downloads-container');
        const totalDownloads = container.querySelectorAll('.download-item').length;
        const emptyState = document.getElementById('empty-state');
        if (emptyState && totalDownloads === 0) {
            emptyState.style.display = 'block';
        }

    } catch (error) {
        showNotification('Removed from manager', 'success');
    }
}

async function performClearAllHistory(deleteFiles) {
    try {
        // SIMPLE RAW CLEAR ALL REQUEST
        const url = `${BASE_URL}/history/clear/`;

        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                delete_files: deleteFiles
            })
        });

        // Remove all history items from UI immediately
        document.querySelectorAll('[data-history-id]').forEach(item => item.remove());
        showNotification('All history cleared', 'success');

        // Show empty state
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
        }

    } catch (error) {
        showNotification('Cleared from UI', 'success');
    }
}


function showNotification(message, type = 'info') {
    document.querySelectorAll("#statuses-div").forEach(div => div.style.display = "none");
    if (document.body.querySelectorAll('#notification-div')) {
        document.body.querySelectorAll("#notification-div").forEach(div => {
            document.body.removeChild(div)
        })
    }
    let erekana = document.getElementById("statuses-div")
    if (erekana) {
        erekana.style.display = "none"
    }

    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'rgba(2, 255, 2, 1)' :
        type === 'error' ? 'rgba(100,0,0,0.9)' :
            'rgba(0,50,100,0.9)';
    const borderColor = type === 'success' ? 'springgreen' :
        type === 'error' ? '#ff4444' :
            '#00ffff';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: transparent;
        padding: 1rem 1.5rem;
        z-index: 10000;
        color: #fffffd;
        font-family: 'Orbitron', monospace;
        min-width: 300px;
        max-width: 700px;
        
        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: 2px;
        --aug-border-bg:
            radial-gradient(circle at top left, #b1ffff, #b1ffff 1.75rem, transparent 1.75rem),
            radial-gradient(circle at top right, #b1ffff, #b1ffff 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, #b1ffff, #b1ffff 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, #b1ffff, #b1ffff 1.75rem, transparent 1.75rem);
        box-shadow: 0 0 30px ${borderColor}50;
    `;
    notification.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip bl-clip border');
    notification.setAttribute('id', 'notification-div')
    if (type === "details") {
        notification.innerHTML = `<div class="directory-scroll-wrapper" style="font-size: 0.4rem;color: springgreen;overflow: auto max-width: 700px"><pre>${message}</pre></div>`;
        laytime = 30000
    } else {
        notification.innerHTML = `<div style="font-size: 0.9rem;"><strong><center>${message}</center></strong></div>`;
        laytime = 4000
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, laytime);

    setTimeout(() => {
        if (erekana) {
            erekana.style.display = "block"
        }
        document.querySelectorAll("#statuses-div").forEach(div => div.style.display = "");
    }, laytime + 2000)
}



function showDownloadItemInformation(historyItem) {
    // Remove any existing download info displays first
    document.querySelectorAll('[id^="showdownloaditeminfo-div"]').forEach(div => {
        if (document.body.contains(div)) {
            document.body.removeChild(div);
        }
    });

    let diii = null;

    if (historyItem.format_info.category === 'video') {
        const thumbName = historyItem.filename.replace(/\.[^/.]+$/, ".png");
        diii = `${BASE_URL}/thumbnails/${encodeURIComponent(thumbName)}`;
    }

    if (historyItem.format_info.category === 'audio') {
        diii = 'static/images/audio3.png';
    }

    if (historyItem.format_info.category === 'image') {
        diii = `${BASE_URL}/downloads/${encodeURIComponent(historyItem.filename)}`;
    }

    if (historyItem.format_info.category === 'archive') {
        diii = 'static/images/document.png';
    }

    if (historyItem.format_info.category === 'document') {
        diii = 'static/images/document.png';
    }


    async function checkFile(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' }); // HEAD only requests headers
            return response.ok; // true if 200, false if 404
        } catch (err) {
            return false;
        }
    }

    let finalImageUrl = diii;

    if (finalImageUrl) {
        checkFile(finalImageUrl).then(exists => {
            if (!exists) {
                // Build the fallback URL
                let imagesVideosIconsToChooseFrom = ['video.png', 'video2.png', 'video3.png', 'video4.png', 'video5.png'];
                let choosenVideoIconNow = imagesVideosIconsToChooseFrom[Math.floor(Math.random() * imagesVideosIconsToChooseFrom.length)];
                finalImageUrl = `static/images/${choosenVideoIconNow}`;

                // CRITICAL: After the promise resolves, find and update the image in the DOM
                const imageElement = document.querySelector(`#showdownloaditeminfo-div2 img[src="${diii}"]`);
                if (imageElement) {
                    imageElement.src = finalImageUrl;
                }
            }
        });
    }

    // Create the three layered divs exactly as in your HTML
    const layer0 = document.createElement('div');
    layer0.id = 'showdownloaditeminfo-div0';
    layer0.style.cssText = `
        position: fixed;
        width: clamp(300px, 30vw, 500px);
        height: clamp(300px, 50vh, 600px);
        top: 19%;
        left: 59%;
        background: transparent;
        padding: 1rem;
        z-index: 10000;
        color: #ffff;
        font-family: 'Orbitron';
        margin: 0;
        
        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: .2rem;
        --aug-border-bg:
            radial-gradient(circle at top left, #b1ffff, #b1ffff 4rem, transparent 1.75rem),
            radial-gradient(circle at top right, #b1ffff, #b1ffff 2rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, #b1ffff, transparent 0rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, #b1ffff, #b1ffff 6rem, transparent 1.75rem);
        box-shadow: 0 0 3rem rgba(0, 255, 255, 0.976);
        border-left: none;
        border-bottom: none;
        overflow: hidden;
        
        /* Initial animation state - starting from small and transparent */
        opacity: 0;
        transform: scale(0.5) translateZ(-1000px);
        transform-origin: center center;
        animation: zoomInForward 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: 0s;
    `;
    layer0.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip border');
    layer0.innerHTML = `<pre style="margin: 0; font-family: 'Orbitron'; font-size: .8rem"></pre>`;

    const layer1 = document.createElement('div');
    layer1.id = 'showdownloaditeminfo-div1';
    layer1.style.cssText = `
        position: fixed;
        width: clamp(300px, 30vw, 500px);
        height: clamp(300px, 50vh, 600px);
        top: 19.8%;
        left: 59.5%;
        background: transparent;
        bckdrop-filter: blur(.3rem);
        padding: 1rem;
        z-index: 10000;
        color: #ffff;
        font-family: 'Orbitron';
        margin: 0;
        
        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: .2rem;
        --aug-border-bg:
            radial-gradient(circle at top left, #b1ffff, #b1ffff 4rem, transparent 1.75rem),
            radial-gradient(circle at top right, #b1ffff, #b1ffff 3rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, #b1ffff, transparent 0rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, #b1ffff, #b1ffff 5rem, transparent 1.75rem);
        box-shadow: 0 0 3rem rgba(0, 255, 255, 0.976);
        border-left: none;
        border-bottom: none;
        overflow: hidden;
        
        /* Initial animation state */
        opacity: 0;
        transform: scale(0.5) translateZ(-800px);
        transform-origin: center center;
        animation: zoomInForward 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: 0.1s;
    `;
    layer1.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip border');
    layer1.innerHTML = `<pre style="margin: 0; font-family: 'Orbitron'; font-size: .8rem"></pre>`;

    const layer2 = document.createElement('div');
    layer2.id = 'showdownloaditeminfo-div2';
    layer2.style.cssText = `
        position: fixed;
        width: clamp(300px, 30vw, 500px);
        height: clamp(300px, 50vh, 600px);
        top: 20.5%;
        left: 60%;
        background: transparent;
        padding: 1rem;
        z-index: 10000;
        color: #ffff;
        font-family: 'Orbitron';
        margin: 0;
        
        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: .2rem;
        --aug-border-bg:
            radial-gradient(circle at top left, #b1ffff, #b1ffff 4rem, transparent 1.75rem),
            radial-gradient(circle at top right, #b1ffff, #b1ffff 4rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, #b1ffff, transparent 0rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, #b1ffff, #b1ffff 4rem, transparent 1.75rem);
        box-shadow: 0 0 3rem rgba(0, 255, 255, 1);
        border-left: none;
        border-bottom: none;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        
        /* Initial animation state */
        opacity: 0;
        transform: scale(0.5) translateZ(-600px);
        transform-origin: center center;
        animation: zoomInForward 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: 0.2s;
    `;
    layer2.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip border');

    // Add the exact HTML content from your example with responsive adjustments
    layer2.innerHTML = `
<div style="flex: 1; min-width: 0; padding-right: 0.5rem;">
<div style="font-family: 'Orbitron'; font-size: clamp(0.6rem, 0.8vw, 0.9rem); margin: 0; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
<img src="${finalImageUrl}" style="width: min(100px, 15vw); height: auto; max-height: 120px; transform: scale(0.8); animation: contentZoomIn 0.4s ease-out forwards; animation-delay: 0.4s;object-filt: contain; border-radius: 6px;">
<p style="font-size: clamp(0.3rem, 0.4vw, 0.5rem); text-shadow: 0 0 1rem rgb(0, 255, 255); margin: 0.5rem 0; line-height: 1.2; white-space: normal; opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards; animation-delay: 0.5s;">
${historyItem.format_info.history.slice(0, 800)}
</p>
<h1 style="color: #fff; text-shadow: 0 0 1rem rgb(0, 255, 255); font-weight: 700; font-family: 'Orbitron', monospace; font-size: clamp(0.8rem, 1.2vw, 1.5rem); margin: 0.5rem 0; opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards; animation-delay: 0.6s;">${historyItem.format_info.description}</h1>
<div style="text-shadow: 0 0 1rem rgb(0, 255, 255);">
<p style="margin: 0.3rem 0; font-size: clamp(0.3rem, 0.4vw, 0.5rem); opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards; animation-delay: 0.7s;">
<strong>Izina: ${historyItem.filename.length > 50 ? historyItem.filename.slice(0, 50) + "..." : historyItem.filename}</strong>
</p>

<p style="margin: 0.3rem 0; font-size: clamp(0.3rem, 0.4vw, 0.5rem); opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards; animation-delay: 0.7s;">
<strong>Ubwoko: ${historyItem.format_info.resolution.length > 20 ? historyItem.format_info.resolution.slice(0, 20) + "..." : historyItem.format_info.resolution}</strong>
</p>
</div>
</div>
</div>
<div style="flex: 1; min-width: 0; padding-left: 0.5rem;">
<div style="font-family: 'Orbitron'; font-size: clamp(0.6rem, 0.8vw, 0.9rem); margin: 0; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
<p style="font-size: clamp(0.3rem, 0.4vw, 0.5rem); color: #fff; text-shadow: 0 0 1rem rgb(0, 255, 255); margin: 0.5rem 0; line-height: 1.2; white-space: normal; opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards; animation-delay: 0.8s;">
${historyItem.format_info.history.slice(0, 700)}
Aho Kiri ${historyItem.download_path}
Cyakozwe Kuri ${historyItem.created_at}
Cyarangiye Kuri ${historyItem.completed_at}
Url Yanyayo ${historyItem.original_url}
Inkomoko ${historyItem.source.toUpperCase()}
Ingano ${historyItem.size}
</p>
<p style="font-size: clamp(0.3rem, 0.4vw, 0.5rem); color: #fff; text-shadow: 0 0 1rem rgb(0, 255, 255); margin: 0.5rem 0; line-height: 1.2; white-space: normal; opacity: 0; transform: translateY(20px); animation: fadeInUp 0.5s ease-out forwards; animation-delay: 0.9s;">
Snai Industries is a modern software-focused company built on clear engineering principles and practical problem-solving. Its approach centers on creating reliable tools that prioritize performance, usability, and long-term maintainability. The company aims to deliver solutions that help businesses work smarter, automate complex tasks, and stay adaptable in a rapidly changing tech environment.
</p>
<img src="static/images/atsnai.png" style="width: min(200px, 30vw); height: auto; max-width: 100%; margin-top: 0.5rem; opacity: 0; transform: scale(0.8); animation: fadeInScale 0.6s ease-out forwards; animation-delay: 1s;">
</div>
</div>
    `;

    // Append all layers to the body
    document.body.appendChild(layer0);
    document.body.appendChild(layer1);
    document.body.appendChild(layer2);

    // Add CSS animations to the document if not already present
    if (!document.getElementById('download-info-animations')) {
        const style = document.createElement('style');
        style.id = 'download-info-animations';
        style.textContent = `
            @keyframes zoomInForward {
                0% {
                    opacity: 0;
                    transform: scale(0.5) translateZ(-1000px);
                    filter: blur(10px);
                }
                50% {
                    opacity: 0.7;
                    filter: blur(5px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateZ(0);
                    filter: blur(0);
                }
            }
            
            @keyframes contentZoomIn {
                0% {
                    transform: scale(0.8);
                    opacity: 0;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes fadeInUp {
                0% {
                    opacity: 0;
                    transform: translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInScale {
                0% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Optional: Also update the hide function to have a reverse animation
function hideDownloadItemInformation() {
    document.querySelectorAll('[id^="showdownloaditeminfo-div"]').forEach(div => {
        // Add fade out animation before removing
        div.style.animation = 'zoomOutBackward 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards';

        // Remove after animation completes
        setTimeout(() => {
            if (document.body.contains(div)) {
                document.body.removeChild(div);
            }
        }, 400);
    });

    // Add reverse animation keyframes if not already present
    if (!document.getElementById('download-info-animations')) {
        const style = document.createElement('style');
        style.id = 'download-info-animations';
        style.textContent = `
            @keyframes zoomOutBackward {
                0% {
                    opacity: 1;
                    transform: scale(1) translateZ(0);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.5) translateZ(-1000px);
                    filter: blur(10px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}


function showDownloadingNotification(name = "Downloading", isPlaylist = false) {
    if (document.body.querySelectorAll('#showDownloadingDiv')) {
        document.body.querySelectorAll("#showDownloadingDiv").forEach(div => {
            document.body.removeChild(div)
        })
    }

    if (name.length > 0) name = name.slice(0, 6) + "..."

    const showDownloading = document.createElement('div');
    showDownloading.style.cssText = `
        position: fixed;
        top: 40rem;
        right: 1vw;
        width: 7rem;
        height: auto;
        padding: 1.5rem;
        background: transparent;
        color: rgb(0, 255, 94);
        font-family: 'Orbitron', monospace;
        font-size: .5rem;
        line-height: 1.4;
        z-index: 9999;
        opacity: 1;
        transform: translateY(2vh);
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        box-shadow: 0 0 3rem transparent;
        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: 0.1rem;
        --aug-border-bg: transparent;
    `;
    showDownloading.setAttribute('data-augmented-ui', "tl-clip tr-clip br-clip bl-clip border");
    showDownloading.setAttribute('id', 'showDownloadingDiv')
    document.body.appendChild(showDownloading);

    // Use the global setDImage variable
    const downloadIcon = setDImage || 'download-video.png';

    setTimeout(() => {
        showDownloading.innerHTML = `
        <center>
            <img src="static/images/${downloadIcon}" alt="" style="background-color: transparent; border: none; width: 3rem; height: 3rem; display: flex; flex: 1">
            <h3 style="color: springgreen;">${name}</h3>
        </center>
    `;
    }, 3000)

    setTimeout(() => {
        showDownloading.innerHTML = `
        <center>
            <img src="static/images/${downloadIcon}" alt="" style="background-color: transparent; border: none; width: 3rem; height: 3rem; display: flex; flex: 1">
            <img src="static/images/${downloadIcon}" alt="" style="background-color: transparent; border: none; width: 3rem; height: 3rem; display: flex; flex: 1">
            <h3 style="color: springgreen;">${name}</h3>
        </center>
    `;
    }, 6000)

    setTimeout(() => {
        showDownloading.innerHTML = `
        <center>
            <img src="static/images/${downloadIcon}" alt="" style="background-color: transparent; border: none; width: 3rem; height: 3rem; display: flex; flex: 1">
            <img src="static/images/${downloadIcon}" alt="" style="background-color: transparent; border: none; width: 3rem; height: 3rem; display: flex; flex: 1">
            <img src="static/images/${downloadIcon}" alt="" style="background-color: transparent; border: none; width: 3rem; height: 3rem; display: flex; flex: 1">
            <h3 style="color: springgreen;">${name}</h3>
        </center>
    `;
    }, 9000)

    setTimeout(() => {
        if (document.body.contains(showDownloading)) {
            document.body.removeChild(showDownloading);
        }
    }, 12000);
}


function showInfo(name, ibinu, path, type, size, modified, x, y) {
    if (document.body.querySelectorAll('#showinfo-div')) {
        document.body.querySelectorAll("#showinfo-div").forEach(div => {
            document.body.removeChild(div)
        })
    }
    function longerStrings(string) {
        if (string.length > 30) {
            return string.slice(0, 30) + " ..."
        } else {
            return string
        }
    }
    const attributes = [
        'tl-clip tr-clip br-clip bl-round border',
        'tl-clip tr-round br-round bl-clip border',
        'tl-clip tr-clip br-clip bl-round border',
        'tl-clip tr-clip br-round bl-clip border',
        'tl-round tr-round br-round bl-round border',
    ]
    const attriTOSet = parseInt(Math.random() * attributes.length)

    const notification = document.createElement('div');
    notification.style.cursor = 'pointer'
    if (document.body.contains(notification)) {
        document.body.removeChild(notification);
    }
    notification.style.cssText = `
        position: fixed;
        top: ${x}px;
        left: ${y}px;
        background: transparent;
        backdrop-filter: blur(2px);
        padding: 1rem;
        z-index: 10000;
        color: #ffff;
        font-family: 'Orbitron';
        margin: 0;
        
        --aug-tl: 1rem;
        --aug-tr: 1rem;
        --aug-br: 1rem;
        --aug-bl: 1rem;
        --aug-border-all: 1px;
        --aug-border-bg:
            radial-gradient(circle at top left, #b1ffff, #b1ffff 4rem, transparent 1.75rem),
            radial-gradient(circle at top right, #b1ffff, #b1ffff 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom left, #b1ffff, #b1ffff 1.75rem, transparent 1.75rem),
            radial-gradient(circle at bottom right, #b1ffff, #b1ffff 7rem, transparent 1.75rem);
        border-left: none;
        border-bottom: none;
    `;
    notification.setAttribute('data-augmented-ui', attributes[attriTOSet]);
    notification.setAttribute('id', 'showinfo-div')
    notification.innerHTML = `
    <strong><legend> AMAKURU </legend></strong>
     <pre style="margin: 0; font-family: 'Orbitron'; font-size: .8rem">

    Izina: ${longerStrings(name)}
    Aho Iri: ${longerStrings(path)}
    Ubwoko: ${type.toUpperCase()}
    Ibirimo: ${parseInt(ibinu) > 0 ? `${ibinu}` : `Ntabyo`}
    Yahinduwe: ${modified}
    Ingano: ${size ? size : '0B'}
     </pre>`;
    const loadingSound = document.getElementById('loading-sound');
    const sound = loadingSound.cloneNode();
    sound.volume = 0.1;
    sound.play().catch(() => { showNotification("Error Loading Sound") });

    document.body.appendChild(notification);

    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}


// Simplified Mini Player Function
window.MiniPlayer = function (mediaElementId, mediaUrl, mediaName, mediaType = 'audio', thumbnail = null) {
    // Remove any existing mini player
    const existingPlayer = document.querySelector('.mini-audio-player');
    if (existingPlayer) {
        existingPlayer.remove();
    }

    // Add CSS styles if not already added
    if (!document.getElementById('mini-player-styles')) {
        const style = document.createElement('style');
        style.id = 'mini-player-styles';
        style.textContent = `
      .mini-audio-player {
        position: fixed;
        font-family: 'SF Pro';
        font-weight: bold;
        top: 20px;
        right: 20px;
        width: 350px;
        min-height: 140px;
        background: rgba(0, 0, 0, 0.51);
        backdrop-filter: blur(20px);
        border-radius: 36px;
        color: white;
        padding: 16px 20px;
        box-sizing: border-box;
        box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: hidden;
        z-index: 9999;
        transition: transform 0.3s ease;
        border: 1px solid rgba(0, 255, 255, 0.5);
        opacity: 0;
        transform: translateX(400px);
        animation: slideInRight 0.5s forwards;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .mini-audio-player.active {
        transform: scale(1.02);
      }

      .mini-audio-player .top {
        display: flex;
        align-items: center;
        gap: 14px;
        height: 72px;
      }

      .mini-audio-player .album-art {
        width: 72px;
        height: 72px;
        border-radius: 14px;
        background: transparent;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .mini-audio-player .default-art {
        font-size: 32px;
        color: white;
      }

      .mini-audio-player .track-info {
        flex: 1;
        overflow: hidden;
        min-width: 0;
      }

      .mini-audio-player .title {
        position: relative;
        top: 5%;
        font-size: 18px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'SF Pro';
      }

      .mini-audio-player .artist {
        font-size: 15px;
        color: #aaa;
        margin-top: 2px;
      }

      .mini-audio-player .media-type {
        font-size: 12px;
        color: #ffffffff;
        background: rgba(139, 124, 153, 0);
        padding: 2px 8px;
        border-radius: 10px;
        display: inline-block;
        margin-top: 4px;
        display: flex;
        flex-direction: row;
        gap: 12px;
      }

      .mini-audio-player .wave {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .mini-audio-player .wave svg {
        width: 32px;
        height: 32px;
      }

      .mini-audio-player .progress {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #888;
        height: 20px;
      }

      .mini-audio-player .bar {
        flex: 1;
        height: 4px;
        background: #333;
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;
      }

      .mini-audio-player .fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #ffffffff, #764ba2);
        border-radius: 2px;
        transition: width 0.1s linear;
      }

      .mini-audio-player .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 44px;
        margin-top: 4px;
      }

      .mini-audio-player .buttons {
        display: flex;
        align-items: center;
        gap: 30px;
      }

      .mini-audio-player .btn-icon {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }

      .mini-audio-player .btn-icon:hover {
        transform: scale(1.1);
      }

      .mini-audio-player .btn-icon:active {
        transform: scale(0.95);
      }

      .mini-audio-player .close-player {
        width: 32px;
        height: 32px;
        opacity: 0.8;
      }

      .mini-audio-player .close-player:hover {
        opacity: 1;
      }

      /* Close animation */
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(400px);
        }
      }

      .mini-audio-player.closing {
        animation: slideOutRight 0.5s forwards;
      }
    `;
        document.head.appendChild(style);
    }

    // Create the mini player HTML - KEEPING YOUR EXACT ICONS
    window.miniPlayer = document.createElement('div');
    miniPlayer.className = 'mini-audio-player';
    miniPlayer.id = 'mini-audio-player';

    // Determine if it's video or audio
    // Determine if it's video or audio
    const isVideo = mediaType === 'video' ||
        (mediaUrl && mediaUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i));

    // Handle thumbnail - check for 404
    let thumbnailImage = 'static/images/audio3.png'; // Default for audio

    if (isVideo) {
        // Start with a random fallback
        const videoFallbackImages = ['video.png', 'video2.png', 'video3.png', 'video4.png', 'video5.png'];
        const randomIndex = Math.floor(Math.random() * videoFallbackImages.length);
        thumbnailImage = `static/images/${videoFallbackImages[randomIndex]}`;

        // If thumbnail is provided, check if it exists (no 404)
        if (thumbnail) {
            const img = new Image();
            const thumbnailUrl = `${BASE_URL}/thumbnails/${thumbnail}`;

            img.onload = function () {
                // If image loads successfully (no 404), use it
                const albumArtImg = miniPlayer.querySelector('.album-art img');
                if (albumArtImg) {
                    albumArtImg.src = thumbnailUrl;
                    albumArtImg.onerror = null; // Remove error handler
                }
            };

            img.onerror = function () {
                // Image failed to load (404) - keep the random fallback
                // Don't need to do anything since we already have random fallback
            };

            // Start loading the image to check
            img.src = thumbnailUrl;
        }
    }

    const mediaTypeText = isVideo ? 'Video' : 'Audio';
    const subtitleText = isVideo ? 'Kumva Video' : 'Kumva Audio';

    miniPlayer.innerHTML = `
        <div class="top">
        <div class="album-art">
            <div class="default-art">
                ${isVideo
            ? `<img style="border-radius: 6px;width: 100%; height: 100%; object-fit: contain;" 
                        src="${thumbnailImage}" 
                        width="40" height="50">`
            : `<img src="${thumbnailImage}" 
                        width="50" height="50">`
        }
            </div>
        </div>
        
        <div class="track-info">
            <div class="title">${mediaName || 'Nta Zina'}</div>
            <div class="artist">${subtitleText}</div>
            <div class="media-type">
                <img id="current-playing-media-type-mini-player" src="static/images/speaker.png" width="20" style="display: hidden">
                <span id="current-playing-media-type-mini-player-name" style="font-family: 'SF Pro';display: hidden">Ijwi Rya Speaker</span>
            </div>
        </div>
        
        <div class="wave">
            <img id="likecurrentplaying" src="static/images/heart.png" width="30">
        </div>
        </div>

        <div class="progress">
        <span class="current-time">0:00</span>
        <div class="bar">
            <div class="fill"></div>
        </div>
        <span class="duration">0:00</span>
        </div>

        <div class="controls">
        <div class="buttons">
            <button class="btn-icon play-pause" id="miniPlayPause">
            <img src="static/images/pause.png" style="width: 44px; height: 44px; filter: brightness(0) invert(1);">
            </button>
        </div>
        <img src="static/images/atsnai.png" style="width:200px; height: 44;">

        <button class="btn-icon close-player" id="miniClose">
            <img src="static/images/close.png" style="width: 32px; height: 32px; filter: brightness(0) invert(1);">
        </button>
        </div>
        `;
    document.body.appendChild(miniPlayer);

    // Get DOM elements
    window.miniPlayPauseBtn = document.getElementById('miniPlayPause');
    const miniCloseBtn = document.getElementById('miniClose');
    const progressFill = miniPlayer.querySelector('.fill');
    const currentTimeEl = miniPlayer.querySelector('.current-time');
    const durationEl = miniPlayer.querySelector('.duration');
    const titleEl = miniPlayer.querySelector('.title');
    const waveEl = miniPlayer.querySelector('.wave');

    // Get the original media element
    const originalMedia = document.getElementById(mediaElementId);
    if (!originalMedia) {
        console.error('Media element not found:', mediaElementId);
        return;
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update progress bar
    function updateProgress() {
        if (!originalMedia.duration || isNaN(originalMedia.duration)) return;

        const progress = (originalMedia.currentTime / originalMedia.duration) * 100 || 0;
        progressFill.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(originalMedia.currentTime);
        durationEl.textContent = formatTime(originalMedia.duration);
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (originalMedia.paused) {
            originalMedia.play();
            miniPlayPauseBtn.querySelector('img').src = "static/images/pause.png";
            miniPlayer.classList.add('active');
        } else {
            originalMedia.pause();
            miniPlayPauseBtn.querySelector('img').src = "static/images/play.png";
            miniPlayer.classList.remove('active');
        }
    }

    // Close player
    function closePlayer() {
        // Stop media
        originalMedia.pause();

        // Animate out and remove
        miniPlayer.classList.add('closing');
        setTimeout(() => {
            if (miniPlayer.parentNode) {
                miniPlayer.parentNode.removeChild(miniPlayer);
            }
        }, 500);
    }

    // Initialize
    function initialize() {
        // Set initial play/pause icon - KEEPING YOUR EXACT ICONS
        miniPlayPauseBtn.querySelector('img').src = originalMedia.paused ?
            "static/images/play.png" : "static/images/pause.png";

        // Update track info
        if (mediaName) {
            titleEl.textContent = mediaName;
        }

        // Set initial progress
        updateProgress();

        // Start progress updates if playing
        if (!originalMedia.paused) {
            miniPlayer.classList.add('active');
            const progressInterval = setInterval(updateProgress, 100);

            // Clear interval when media ends
            originalMedia.addEventListener('ended', () => {
                clearInterval(progressInterval);
                miniPlayPauseBtn.querySelector('img').src = "static/images/play.png";
                miniPlayer.classList.remove('active');
            });
        }

        // Update progress on timeupdate
        originalMedia.addEventListener('timeupdate', updateProgress);

        // Update duration when loaded
        if (originalMedia.duration && !isNaN(originalMedia.duration)) {
            durationEl.textContent = formatTime(originalMedia.duration);
        } else {
            originalMedia.addEventListener('loadedmetadata', () => {
                if (originalMedia.duration && !isNaN(originalMedia.duration)) {
                    durationEl.textContent = formatTime(originalMedia.duration);
                }
            });
        }
    }

    // Event Listeners
    miniPlayPauseBtn.addEventListener('click', togglePlayPause);
    miniCloseBtn.addEventListener('click', closePlayer);

    // Click on progress bar to seek
    miniPlayer.querySelector('.bar').addEventListener('click', (e) => {
        if (!originalMedia.duration || isNaN(originalMedia.duration)) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        originalMedia.currentTime = pos * originalMedia.duration;
        updateProgress();
    });

    // Initialize
    initialize();

    // Save liked media in localStorage
    window.toggleLike = function () {
        const heart = document.getElementById('likecurrentplaying');
        if (!heart || !window.currentMediaPath) return;

        const liked = JSON.parse(localStorage.likedMedia || '[]');
        const index = liked.indexOf(window.currentMediaPath);

        if (index === -1) {
            liked.push(window.currentMediaPath);
            heart.style.filter = 'invert(16%) sepia(98%) saturate(5391%) hue-rotate(335deg) brightness(103%) contrast(101%)';
            let images = ['heart2.png', 'heart3.png', 'heart4.png'];
            let chosenOne = images[Math.floor(Math.random() * images.length)];
            heart.src = `static/images/${chosenOne}`;
        } else {
            liked.splice(index, 1);
            heart.style.filter = 'brightness(0) invert(1)';
            heart.src = "static/images/heart.png"; // Reset to original white heart
        }

        localStorage.likedMedia = JSON.stringify(liked);
    };

    // Update heart color
    window.updateHeart = function () {
        const heart = document.getElementById('likecurrentplaying');
        if (!heart || !window.currentMediaPath) return;

        const liked = JSON.parse(localStorage.likedMedia || '[]');
        const isLiked = liked.includes(window.currentMediaPath);

        if (isLiked) {
            heart.style.filter = 'invert(16%) sepia(98%) saturate(5391%) hue-rotate(335deg) brightness(103%) contrast(101%)';
            let images = ['heart2.png', 'heart3.png', 'heart4.png'];
            let chosenOne = images[Math.floor(Math.random() * images.length)];
            heart.src = `static/images/${chosenOne}`;
        } else {
            heart.style.filter = 'brightness(0) invert(1)';
            heart.src = "static/images/heart.png";
        }
    };    // Add click event when creating mini player
    document.getElementById('likecurrentplaying')?.addEventListener('click', window.toggleLike);

    // Call updateHeart when media changes
    window.updateHeart();

    // Return control object
    return {
        element: miniPlayer,
        close: closePlayer,
        mediaType: isVideo ? 'video' : 'audio'
    };
};



window.showStatuses = function (options = {}) {
    // MONITOR GRAPH SYSTEM
    const monitorGraphs = {
        gpu: { data: [], maxPoints: 30, color: '#ff0464', areaColor: 'rgba(255, 4, 100, 0.08)', lineWidth: 1.5 },
        cpu: { data: [], maxPoints: 30, color: '#00ffff', areaColor: 'rgba(0, 255, 255, 0.08)', lineWidth: 1.5 },
        net: { data: [], maxPoints: 30, color: '#9d4edd', areaColor: 'rgba(157, 78, 221, 0.08)', lineWidth: 1.5 },
        disk: { data: [], maxPoints: 30, color: '#ffaa00', areaColor: 'rgba(255, 170, 0, 0.08)', lineWidth: 1.5 }
    };
    // Default options for system monitor
    const monitorConfig = {
        initialValue: 98,
        title: 'SDM MONITOR',
        autoUpdate: true,
        updateInterval: 1000,
        randomize: false,
        position: 'fixed',
        showDiskUsage: true,
        useWebSocket: true,
        webSocketUrl: 'ws://127.0.0.1:65534/ws/status/',
        showMonitor: false, // New: control whether to show the monitor
        ...options
    };

    // Get references to the hexagon icons in the bottom grid
    const networkHex = document.querySelector("a[id='network-status'] div") || document.querySelector("#network-status");
    const batteryHex = document.querySelector("a[id='battery-status'] div") || document.querySelector("#battery-status");
    const playingHex = document.querySelector("a[id='playing-status'] div") || document.querySelector("#playing-status");
    const downloadHex = document.querySelector("a[id='download-status'] div") || document.querySelector("#download-status");

    // Also keep references to the 3D elements and labels for hover functionality
    const wifi3d = document.getElementById("wifi-3d");
    const os3d = document.getElementById("os-3d");
    const online3d = document.getElementById("online-3d");
    const battery3d = document.getElementById("battery-3d");

    // Create labels for OS info (for hover expansion)
    const labels = {
        networks: document.getElementById('networks'),
        osname: document.getElementById('osname'),
        isonline: document.getElementById('isonline'),
        percentage: document.getElementById('percentage-battery')
    };

    // SYSTEM MONITOR DASHBOARD HTML (only if showMonitor is true)
    let monitorElement = null;
    let monitorComponents = null;

    if (monitorConfig.showMonitor) {
        // Remove any previous instance
        document.querySelectorAll('.system-monitor-dashboard').forEach(el => el.remove());

        // Generate unique ID for monitor
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const monitorId = `systemMonitor_${uniqueId}`;
        const gpuGraphId = `gpuGraph_${uniqueId}`;
        const cpuGraphId = `cpuGraph_${uniqueId}`;
        const netGraphId = `netGraph_${uniqueId}`;
        const diskGraphId = `diskGraph_${uniqueId}`;
        const gpuPercentId = `gpuPercent_${uniqueId}`;
        const cpuPercentId = `cpuPercent_${uniqueId}`;
        const netSpeedId = `netSpeed_${uniqueId}`;
        const diskPercentId = `diskPercent_${uniqueId}`;
        const gpuTempId = `gpuTemp_${uniqueId}`;
        const cpuTempId = `cpuTemp_${uniqueId}`;
        const netLatencyId = `netLatency_${uniqueId}`;
        const diskReadSpeedId = `diskReadSpeed_${uniqueId}`;
        const diskWriteSpeedId = `diskWriteSpeed_${uniqueId}`;
        const gpuPowerId = `gpuPower_${uniqueId}`;
        const cpuPowerId = `cpuPower_${uniqueId}`;
        const netUsageId = `netUsage_${uniqueId}`;
        const diskHealthId = `diskHealth_${uniqueId}`;

        // Create monitor HTML structure
        const monitorHTML = `
        <div class="system-monitor-dashboard" id="${monitorId}" style="display: ${monitorConfig.position === 'inline' ? 'inline-block' : 'block'}; position: ${monitorConfig.position}; ${monitorConfig.position === 'fixed' ? 'top: 60%; left: 50%; transform: translate(-50%, -50%); z-index: 10000;' : 'position: relative;'}">
            <div class="main" data-augmented-ui="tl-round tr-round br-round bl-round border" style="
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 300px;
                background: rgba(0, 0, 0, 1);
                padding: 2rem;
                color: #fffffd;
                font-family: 'Orbitron', monospace;
                text-align: center;
                min-width: ${monitorConfig.showDiskUsage ? '500px' : '400px'};
                max-width: ${monitorConfig.showDiskUsage ? '500px' : '400px'};
                --aug-tl: 1.5rem;
                --aug-tr: 1.5rem;
                --aug-br: 1.5rem;
                --aug-bl: 1.5rem;
                --aug-border-all: 2px;
                --aug-border-bg:
                    radial-gradient(circle at top left, rgba(255, 0, 123, 1),rgba(255, 0, 123, 1) 20%, transparent 1.75rem),
                    radial-gradient(circle at top right,rgba(255, 0, 123, 1),rgba(255, 0, 123, 1) 1.75rem, transparent 1.75rem),
                    radial-gradient(circle at bottom left,rgba(248, 213, 54, 1),rgba(248, 213, 54, 1) 5rem, transparent 1.75rem),
                    radial-gradient(circle at bottom right, #9d4edd, #9d4edd 20%, transparent 1.75rem);
                box-shadow: 0 0 1rem #b1ffff 50;
            ">
                <!-- Top Title -->
                <h4 style="position: absolute;left: 50%;top: -3%;transform: translateX(-50%);color: #b1ffff;text-shadow: 0 0 1rem #b1ffff;font-size: 14px;">SYSTEM MONITOR</h4>
                
                <!-- GPU Panel (Top Left) -->
                <div style="position:absolute;width:${monitorConfig.showDiskUsage ? '23%' : '30%'};height:40%;top:10%;left:2%;">
                    <div data-augmented-ui="tl-round tr-round br-round bl-round border" class="process-equalizer" style="
                        position:relative;
                        width:100%;
                        height:100%;
                        background:rgba(0, 0, 0, 0.8);
                        border-radius:8px;
                        color:rgba(255,255,255,0.8);
                        border:1px solid rgba(255,255,255,0.1);
                        backdrop-filter: blur(5px);
                        overflow:hidden;
                        --aug-tl: 0.7rem;
                        --aug-tr: 0.7rem;
                        --aug-br: 0.7rem;
                        --aug-bl: 0.7rem;
                        --aug-border-all:.5px;
                        --aug-border-bg:
                            radial-gradient(circle at top left, #ff0464, #ff0464 .5rem, transparent 0.7rem),
                            radial-gradient(circle at top right, #ff0464, #ff0464 .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom left, #ff0464, #ff0464 .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom right, #ff0464, #ff0464 .5rem, transparent 0.7rem);
                    ">
                        <canvas id="${gpuGraphId}" style="position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated;"></canvas>
                        
                        <div style="position:absolute;top:5px;left:0;width:100%;text-align:center;color:#ff0464;font-size:10px;font-weight:600;text-shadow:0 0 3px rgba(255,4,100,0.8);">GPU</div>
                        <div id="${gpuPercentId}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff0464;font-size:18px;font-weight:800;text-shadow:0 0 8px rgba(255,4,100,0.9);">0%</div>
                        <div id="${gpuTempId}" style="position:absolute;bottom:5px;left:10%;color:#58a6ff;font-size:9px;text-shadow:0 0 3px rgba(88,166,255,0.8);">--°C</div>
                        <div id="${gpuPowerId}" style="position:absolute;bottom:5px;right:10%;color:#7ee787;font-size:9px;text-shadow:0 0 3px rgba(126,231,135,0.8);">--W</div>
                        
                        <div style="position:absolute;top:25%;left:5px;right:5px;height:1px;background:rgba(255, 4, 100, 0.15);"></div>
                        <div style="position:absolute;top:50%;left:5px;right:5px;height:1px;background:rgba(255, 4, 100, 0.15);"></div>
                        <div style="position:absolute;top:75%;left:5px;right:5px;height:1px;background:rgba(255, 4, 100, 0.15);"></div>
                    </div>
                </div>
                
                <!-- CPU Panel (Top Center) -->
                <div style="position:absolute;width:${monitorConfig.showDiskUsage ? '23%' : '30%'};height:40%;top:10%;left:${monitorConfig.showDiskUsage ? '27%' : '35%'};">
                    <div data-augmented-ui="tl-round tr-round br-round bl-round border" class="process-equalizer" style="
                        position:relative;
                        width:100%;
                        height:100%;
                        background:rgba(0, 0, 0, 0.8);
                        border-radius:8px;
                        color:rgba(255,255,255,0.8);
                        border:1px solid rgba(255,255,255,0.1);
                        backdrop-filter: blur(5px);
                        overflow:hidden;
                        --aug-tl: 0.7rem;
                        --aug-tr: 0.7rem;
                        --aug-br: 0.7rem;
                        --aug-bl: 0.7rem;
                        --aug-border-all:.5px;
                        --aug-border-bg:
                            radial-gradient(circle at top left, #00ffff, #00ffff .5rem, transparent 0.7rem),
                            radial-gradient(circle at top right, #00ffff, #00ffff .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom left, #00ffff, #00ffff .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom right, #00ffff, #00ffff .5rem, transparent 0.7rem);
                    ">
                        <canvas id="${cpuGraphId}" style="position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated;"></canvas>
                        
                        <div style="position:absolute;top:5px;left:0;width:100%;text-align:center;color:#00ffff;font-size:10px;font-weight:600;text-shadow:0 0 3px rgba(0,255,255,0.8);">CPU</div>
                        <div id="${cpuPercentId}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#00ffff;font-size:18px;font-weight:800;text-shadow:0 0 8px rgba(0,255,255,0.9);">0%</div>
                        <div id="${cpuTempId}" style="position:absolute;bottom:5px;left:10%;color:#ffaa00;font-size:9px;text-shadow:0 0 3px rgba(255,170,0,0.8);">--°C</div>
                        <div id="${cpuPowerId}" style="position:absolute;bottom:5px;right:10%;color:#ff5555;font-size:9px;text-shadow:0 0 3px rgba(255,85,85,0.8);">--W</div>
                        
                        <div style="position:absolute;top:25%;left:5px;right:5px;height:1px;background:rgba(0, 255, 255, 0.15);"></div>
                        <div style="position:absolute;top:50%;left:5px;right:5px;height:1px;background:rgba(0, 255, 255, 0.15);"></div>
                        <div style="position:absolute;top:75%;left:5px;right:5px;height:1px;background:rgba(0, 255, 255, 0.15);"></div>
                    </div>
                </div>
                
                <!-- Network Panel (Top Right) -->
                <div style="position:absolute;width:${monitorConfig.showDiskUsage ? '23%' : '30%'};height:40%;top:53%;right:2%;">
                    <div data-augmented-ui="tl-round tr-round br-round bl-round border" class="process-equalizer" style="
                        position:relative;
                        width:100%;
                        height:100%;
                        background:rgba(0, 0, 0, 0.8);
                        border-radius:8px;
                        color:rgba(255,255,255,0.8);
                        border:1px solid rgba(255,255,255,0.1);
                        backdrop-filter: blur(5px);
                        overflow:hidden;
                        --aug-tl: 0.7rem;
                        --aug-tr: 0.7rem;
                        --aug-br: 0.7rem;
                        --aug-bl: 0.7rem;
                        --aug-border-all:.5px;
                        --aug-border-bg:
                            radial-gradient(circle at top left, #9d4edd, #9d4edd .5rem, transparent 0.7rem),
                            radial-gradient(circle at top right, #9d4edd, #9d4edd .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom left, #9d4edd, #9d4edd .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom right, #9d4edd, #9d4edd .5rem, transparent 0.7rem);
                    ">
                        <canvas id="${netGraphId}" style="position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated;"></canvas>
                        
                        <div style="position:absolute;top:5px;left:0;width:100%;text-align:center;color:#9d4edd;font-size:10px;font-weight:600;text-shadow:0 0 3px rgba(157,78,221,0.8);">NET</div>
                        <div id="${netSpeedId}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#9d4edd;font-size:18px;font-weight:800;text-shadow:0 0 8px rgba(157,78,221,0.9);">0Mb/s</div>
                        <div id="${netLatencyId}" style="position:absolute;bottom:5px;left:10%;color:#38b000;font-size:9px;text-shadow:0 0 3px rgba(56,176,0,0.8);">--ms</div>
                        <div id="${netUsageId}" style="position:absolute;bottom:5px;right:10%;color:#ff9e00;font-size:9px;text-shadow:0 0 3px rgba(255,158,0,0.8);">0%</div>
                        
                        <div style="position:absolute;top:25%;left:5px;right:5px;height:1px;background:rgba(157, 78, 221, 0.15);"></div>
                        <div style="position:absolute;top:50%;left:5px;right:5px;height:1px;background:rgba(157, 78, 221, 0.15);"></div>
                        <div style="position:absolute;top:75%;left:5px;right:5px;height:1px;background:rgba(157, 78, 221, 0.15);"></div>
                    </div>
                </div>
                
                ${monitorConfig.showDiskUsage ? `
                <!-- Disk Panel (Bottom Center) -->
                <div style="position:absolute;width:70%;height:40%;bottom:7%;left:2%;">
                    <div data-augmented-ui="tl-round tr-round br-round bl-round border" class="process-equalizer" style="
                        position:relative;
                        width:100%;
                        height:100%;
                        background:rgba(0, 0, 0, 0.8);
                        border-radius:8px;
                        color:rgba(255,255,255,0.8);
                        border:1px solid rgba(255,255,255,0.1);
                        backdrop-filter: blur(5px);
                        overflow:hidden;
                        --aug-tl: 0.7rem;
                        --aug-tr: 0.7rem;
                        --aug-br: 0.7rem;
                        --aug-bl: 0.7rem;
                        --aug-border-all:.5px;
                        --aug-border-bg:
                            radial-gradient(circle at top left, #ffaa00, #ffaa00 .5rem, transparent 0.7rem),
                            radial-gradient(circle at top right, #ffaa00, #ffaa00 .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom left, #ffaa00, #ffaa00 .5rem, transparent 0.7rem),
                            radial-gradient(circle at bottom right, #ffaa00, #ffaa00 .5rem, transparent 0.7rem);
                    ">
                        <canvas id="${diskGraphId}" style="position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated;"></canvas>
                        
                        <div style="position:absolute;top:5px;left:0;width:100%;text-align:center;color:#ffaa00;font-size:10px;font-weight:600;text-shadow:0 0 3px rgba(255,170,0,0.8);">DISK</div>
                        <div id="${diskPercentId}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ffaa00;font-size:18px;font-weight:800;text-shadow:0 0 8px rgba(255,170,0,0.9);">0%</div>
                        <div id="${diskReadSpeedId}" style="position:absolute;bottom:5px;left:15%;color:#38b000;font-size:9px;text-shadow:0 0 3px rgba(56,176,0,0.8);">0MB/s</div>
                        <div id="${diskWriteSpeedId}" style="position:absolute;bottom:5px;right:15%;color:#ff5555;font-size:9px;text-shadow:0 0 3px rgba(255,85,85,0.8);">0MB/s</div>
                        <div id="${diskHealthId}" style="position:absolute;top:5px;right:10px;color:#7ee787;font-size:9px;text-shadow:0 0 3px rgba(126,231,135,0.8);">--%</div>
                        
                        <div style="position:absolute;bottom:20px;left:10%;right:10%;height:6px;background:rgba(255,170,0,0.1);border-radius:3px;overflow:hidden;">
                            <div id="diskBar_${uniqueId}" style="position:absolute;left:0;top:0;height:100%;width:0%;background:linear-gradient(90deg, #38b000, #7ee787);border-radius:3px;box-shadow:0 0 5px rgba(56,176,0,0.5);"></div>
                        </div>
                        
                        <div style="position:absolute;top:25%;left:5px;right:5px;height:1px;background:rgba(255, 170, 0, 0.15);"></div>
                        <div style="position:absolute;top:50%;left:5px;right:5px;height:1px;background:rgba(255, 170, 0, 0.15);"></div>
                        <div style="position:absolute;top:75%;left:5px;right:5px;height:1px;background:rgba(255, 170, 0, 0.15);"></div>
                    </div>
                    </div>
                    <img src="static/images/atsnai.png" style="position:absolute;width:60%;height:60%;top:2%;right:-5%;">
                ` : ''}
                
                <!-- Bottom Status Indicators -->
                <div style="position:absolute;bottom:5px;left:0;width:100%;display:flex;justify-content:center;gap:15px;">
                    <div style="display:flex;align-items:center;gap:3px;">
                        <div style="width:6px;height:6px;background:#ff0464;border-radius:50%;box-shadow:0 0 3px #ff0464;"></div>
                        <span style="color:#b1ffff;font-size:8px;">GPU</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:3px;">
                        <div style="width:6px;height:6px;background:#00ffff;border-radius:50%;box-shadow:0 0 3px #00ffff;"></div>
                        <span style="color:#b1ffff;font-size:8px;">CPU</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:3px;">
                        <div style="width:6px;height:6px;background:#9d4edd;border-radius:50%;box-shadow:0 0 3px #9d4edd;"></div>
                        <span style="color:#b1ffff;font-size:8px;">NET</span>
                    </div>
                    ${monitorConfig.showDiskUsage ? `
                    <div style="display:flex;align-items:center;gap:3px;">
                        <div style="width:6px;height:6px;background:#ffaa00;border-radius:50%;box-shadow:0 0 3px #ffaa00;"></div>
                        <span style="color:#b1ffff;font-size:8px;">DISK</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>`;

        // Insert into document
        if (monitorConfig.position === 'inline' && monitorConfig.container) {
            monitorConfig.container.insertAdjacentHTML('beforeend', monitorHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', monitorHTML);
        }

        // Get monitor element references
        monitorElement = document.getElementById(monitorId);

        // Initialize monitor components
        monitorComponents = {
            gpuGraphCanvas: document.getElementById(gpuGraphId),
            cpuGraphCanvas: document.getElementById(cpuGraphId),
            netGraphCanvas: document.getElementById(netGraphId),
            gpuPercentDisplay: document.getElementById(gpuPercentId),
            cpuPercentDisplay: document.getElementById(cpuPercentId),
            netSpeedDisplay: document.getElementById(netSpeedId),
            gpuTempDisplay: document.getElementById(gpuTempId),
            cpuTempDisplay: document.getElementById(cpuTempId),
            netLatencyDisplay: document.getElementById(netLatencyId),
            gpuPowerDisplay: document.getElementById(gpuPowerId),
            cpuPowerDisplay: document.getElementById(cpuPowerId),
            netUsageDisplay: document.getElementById(netUsageId),
            diskGraphCanvas: monitorConfig.showDiskUsage ? document.getElementById(diskGraphId) : null,
            diskPercentDisplay: monitorConfig.showDiskUsage ? document.getElementById(diskPercentId) : null,
            diskReadSpeedDisplay: monitorConfig.showDiskUsage ? document.getElementById(diskReadSpeedId) : null,
            diskWriteSpeedDisplay: monitorConfig.showDiskUsage ? document.getElementById(diskWriteSpeedId) : null,
            diskHealthDisplay: monitorConfig.showDiskUsage ? document.getElementById(diskHealthId) : null,
            diskBar: monitorConfig.showDiskUsage ? document.getElementById(`diskBar_${uniqueId}`) : null
        };

        // Initialize monitor graphs
        if (monitorComponents.gpuGraphCanvas) initMonitorGraph('gpu');
        if (monitorComponents.cpuGraphCanvas) initMonitorGraph('cpu');
        if (monitorComponents.netGraphCanvas) initMonitorGraph('net');
        if (monitorConfig.showDiskUsage && monitorComponents.diskGraphCanvas) initMonitorGraph('disk');

        // Add close button for fixed positioning
        if (monitorConfig.position === 'fixed' && monitorElement) {
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                width: 20px;
                height: 20px;
                background: rgba(249, 48, 165, 1);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                z-index: 10001;
            `;
            closeBtn.onclick = () => {
                if (monitorElement) {
                    if (monitorElement._updateInterval) {
                        clearInterval(monitorElement._updateInterval);
                    }
                    monitorElement.remove();
                    monitorElement = null;
                    monitorComponents = null;
                }
            };
            monitorElement.appendChild(closeBtn);
        }
    }

    // HELPER FUNCTIONS FOR STATUS ICONS
    const compressGroup3d = () => {
        const el = document.getElementById("group3d");
        el && el.classList.add("compressed");
        document.body.setAttribute("data-highlight-info", "");
    };

    const expandGroup3d = () => {
        const el = document.getElementById("group3d");
        el && el.classList.remove("compressed");
        el.style.zIndex = '10000000000000';
        document.body.setAttribute("data-highlight-info", "");
    };

    // Add hover events to battery and network hexagons
    if (batteryHex) {
        batteryHex.addEventListener("mouseover", expandGroup3d);
        batteryHex.addEventListener("mouseleave", compressGroup3d);
    }

    if (networkHex) {
        networkHex.addEventListener("mouseover", expandGroup3d);
        networkHex.addEventListener("mouseleave", compressGroup3d);
    }

    // Add click event to playing hexagon
    if (playingHex) {
        playingHex.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentPlaying) {
                if (currentPlaying.type === 'audio') {
                    toggleAudioPlayPause();
                } else if (currentPlaying.type === 'video') {
                    togglePlayPause();
                }
            }
        });
    }

    // Helper functions
    const formatBattery = (val) => {
        if (typeof val === 'number') return `${val.toFixed(0)}%`;
        return val;
    };

    const formatOnline = (online) => {
        return online
            ? '<span style="color:springgreen;">Online</span>'
            : '<span style="color:#ff0464;">Offline</span>';
    };

    // Initialize monitor graph
    function initMonitorGraph(type) {
        if (!monitorComponents || !monitorConfig.showMonitor) return;

        const canvas = monitorComponents[`${type}GraphCanvas`];
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        monitorGraphs[type].ctx = ctx;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Initialize with zeros
        for (let i = 0; i < monitorGraphs[type].maxPoints; i++) {
            monitorGraphs[type].data.push(0);
        }
    }

    // Draw monitor graph
    function drawMonitorGraph(type) {
        const graph = monitorGraphs[type];
        if (!graph.ctx || !monitorConfig.showMonitor) return;

        const ctx = graph.ctx;
        const w = graph.ctx.canvas.width;
        const h = graph.ctx.canvas.height;

        ctx.clearRect(0, 0, w, h);

        if (graph.data.length < 2) return;

        // Draw area
        ctx.fillStyle = graph.areaColor;
        ctx.beginPath();
        ctx.moveTo(0, h);

        graph.data.forEach((value, i) => {
            const x = (i / (graph.maxPoints - 1)) * w;
            const y = h - (value / 100) * (h - 30) - 15;
            ctx.lineTo(x, y);
        });

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Draw line
        ctx.strokeStyle = graph.color;
        ctx.lineWidth = graph.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();

        graph.data.forEach((value, i) => {
            const x = (i / (graph.maxPoints - 1)) * w;
            const y = h - (value / 100) * (h - 30) - 15;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = ((i - 1) / (graph.maxPoints - 1)) * w;
                const prevY = h - (graph.data[i - 1] / 100) * (h - 30) - 15;
                const midX = (prevX + x) / 2;
                const squiggle = Math.sin(i * 0.5) * 1.5;

                ctx.quadraticCurveTo(midX + squiggle, prevY, midX, (prevY + y) / 2);
                ctx.quadraticCurveTo(midX - squiggle, y, x, y);
            }
        });

        ctx.stroke();
        ctx.shadowColor = graph.color;
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Store last network I/O for speed calculation
    let lastNetworkBytes = { sent: 0, recv: 0, time: Date.now() };
    let lastDiskBytes = { read: 0, write: 0, time: Date.now() };

    // MAIN UPDATE FUNCTION FOR ALL COMPONENTS
    const updateAllStatusUI = (data) => {
        // Update status icons (always)
        updateStatusIcons(data);

        // Update monitor dashboard (if enabled)
        if (monitorConfig.showMonitor) {
            updateMonitorDashboard(data);
        }
    };

    // -------------------- HELPER --------------------
    const DAY_OF_WEEK = new Date().getDay();

    const DAY_ICONS = {
        media: {
            0: { audio: 'audio.png', video: 'video.png', download: 'download-video.png' },
            1: { audio: 'audio2.png', video: 'play.png', download: 'down.png' },
            2: { audio: 'audio3.png', video: 'video2.png', download: 'download2.png' },
            3: { audio: 'audio4.png', video: 'video3.png', download: 'download3.png' },
            4: { audio: 'audio.png', video: 'video4.png', download: 'download-video.png' },
            5: { audio: 'audio2.png', video: 'video5.png', download: 'down.png' },
            6: { audio: 'audio3.png', video: 'video.png', download: 'download2.png' },
        },
        network: {
            wifi: ["static/images/wifi.png", "static/images/wifi2.png"],
            ethernet: ["static/images/network.png", "static/images/network2.png"],
            nowifi: ["static/images/nowifi.png", "static/images/nowifi2.png"]
        }
    };

    function pickDayIcon(list) {
        return list[DAY_OF_WEEK % list.length];
    }

    // -------------------- MEDIA & DOWNLOAD --------------------
    const updateMediaAndDownloadStatus = () => {
        const iconConfig = DAY_ICONS.media[DAY_OF_WEEK];

        // Update playing hexagon icon
        if (playingHex) {
            const playingImg = playingHex.querySelector('img');
            if (playingImg) {
                if (!currentPlaying) {
                    playingImg.src = 'static/images/noaudio.png';
                    playingImg.alt = playingImg.title = 'Nta Cyinu Uri Gukina!';
                } else if (currentPlaying.status === 'pause') {
                    playingImg.src = 'static/images/pause.png';
                    playingImg.alt = playingImg.title = `Hagaritse ${currentPlaying.name}`;
                } else if (currentPlaying.status === 'playing') {
                    const src = currentPlaying.type === 'audio' ? iconConfig.audio : iconConfig.video;
                    playingImg.src = `static/images/${src}`;
                    playingImg.alt = playingImg.title = `Gukina ${currentPlaying.name}`;
                }
            }
        }

        // Update download hexagon icon
        if (downloadHex) {
            const downloadImg = downloadHex.querySelector('img');
            if (downloadImg) {
                const count = window.activeDownloads?.size || 0;

                if (count > 0) {
                    // Determine appropriate icon based on active download types
                    let iconType = getDownloadIconType();

                    downloadImg.src = `static/images/${iconType}`;
                    downloadImg.alt = downloadImg.title = `Uri Kuzana Ibinu Bi ${count}`;
                    downloadHex.classList.add('pulse');
                } else {
                    downloadImg.src = 'static/images/nodownloads.png';
                    downloadImg.alt = downloadImg.title = 'Nta Cyinu Uri Kuzana';
                    downloadHex.classList.remove('pulse');
                }
            }
        }

        // Helper function to determine the appropriate icon
        function getDownloadIconType() {
            if (!window.activeDownloads || window.activeDownloads.size === 0) {
                return 'nodownloads.png'; // default fallback
            }

            let hasVideo = false;
            let hasAudio = false;
            let hasImage = false;

            for (const [, downloadData] of window.activeDownloads.entries()) {
                const formatInfo = downloadData?.formatInfo;

                // Skip if no format info
                if (!formatInfo) continue;

                // Check by file extension
                const ext = formatInfo.ext?.toLowerCase();
                if (ext) {
                    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'].includes(ext)) {
                        hasVideo = true;
                        break; // Video takes priority
                    } else if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(ext) ||
                        formatInfo.isAudio === true) {
                        hasAudio = true;
                    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext)) {
                        hasImage = true;
                    }
                }

                // Fallback: Check by other indicators
                if (formatInfo.isAudio === true) {
                    hasAudio = true;
                }
            }

            // Priority: Video > Audio > Image > Default
            if (hasVideo) return 'download-video.png';
            if (hasAudio) return 'download-audio.png';
            if (hasImage) return 'download-image.png';

            return 'down.png'; // default icon
        }


        // Helper function to clean up finished downloads
        function cleanupFinishedDownloads() {
            if (!window.activeDownloads || window.activeDownloads.size === 0) return;

            const toDelete = [];

            // Find all finished downloads
            for (const [downloadId, downloadData] of window.activeDownloads.entries()) {
                if (downloadData?.progressData?.status === 'finished' ||
                    downloadData?.progressData?.status === 'error' ||
                    downloadData?.progressData?.status === 'cancelled') {
                    toDelete.push(downloadId);
                }

                // Also fix the isAudio mislabeling for images
                if (downloadData?.formatInfo?.ext &&
                    downloadData?.formatInfo?.isAudio === true &&
                    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(downloadData.formatInfo.ext.toLowerCase())) {
                    downloadData.formatInfo.isAudio = false;
                }
            }

            // Remove finished downloads from the map
            toDelete.forEach(downloadId => {
                window.activeDownloads.delete(downloadId);
                console.log(`${downloadId} - Removed (finished)`);
            });
        }

    };

    // -------------------- STATUS ICONS --------------------
    const updateStatusIcons = (data) => {
        const s = data.statuses || {};

        // Update status labels
        if (labels.networks) labels.networks.innerHTML = s.network || '—';
        if (labels.osname) {
            labels.osname.innerHTML = s.os || '-';
            const osname = s.os ? s.os.toLowerCase() : '';
            if (osname.includes('linux') && os3d) os3d.src = "static/images/linux.png";
            if (osname.includes('window') && os3d) os3d.src = "static/images/window.png";
            if ((osname.includes('darwin') || osname.includes('macos')) && os3d) os3d.src = "static/images/macos.png";
        }
        if (labels.isonline) labels.isonline.innerHTML = formatOnline(s.online);
        if (labels.percentage) labels.percentage.textContent = formatBattery(s.battery);

        // Update network icon
        const network = data.network || {};
        if (networkHex) {
            const networkImg = networkHex.querySelector('img');
            if (networkImg) {
                let src = '';
                if (network.wifi) {
                    src = pickDayIcon(DAY_ICONS.network.wifi);
                    networkImg.alt = `WiFi: ${network.online ? 'Online' : 'Offline'}`;
                    networkHex.title = `WiFi: ${network.online ? 'Online' : 'Offline'}`;
                } else if (network.ethernet) {
                    src = pickDayIcon(DAY_ICONS.network.ethernet);
                    networkImg.alt = `Ethernet: ${network.online ? 'Online' : 'Offline'}`;
                    networkHex.title = `Ethernet: ${network.online ? 'Online' : 'Offline'}`;
                    if (labels.networks) labels.networks.innerHTML = 'Ethernet';
                } else {
                    src = pickDayIcon(DAY_ICONS.network.nowifi);
                    networkImg.alt = 'Nta Connection';
                    networkHex.title = 'Nta Connection';
                }
                networkImg.src = src;
                if (wifi3d) wifi3d.src = src;
            }
        }

        // Update battery icon
        const battery = data.battery || {};
        if (batteryHex) {
            const batteryImg = batteryHex.querySelector('img');
            if (batteryImg) {
                if (battery.percent == null) {
                    batteryImg.src = "static/images/batterynormal.png";
                    if (battery3d) battery3d.src = "static/images/batterynormal.png";
                    batteryImg.alt = batteryHex.title = 'Nta Battery';
                } else {
                    const p = parseInt(battery.percent);
                    const charging = battery.plugged;

                    if (!charging && p > 90) batteryImg.src = "static/images/batteryfullnotcharging.png";
                    else if (charging && p > 90) batteryImg.src = "static/images/batteryfullcharging.png";
                    else if (charging && p <= 20) batteryImg.src = "static/images/batterycriticalcharging.png";
                    else if (charging) batteryImg.src = "static/images/batterycharging.png";
                    else if (p <= 20) batteryImg.src = "static/images/batterycritical.png";
                    else if (p <= 50) batteryImg.src = "static/images/batterylow.png";
                    else batteryImg.src = "static/images/batterynormal.png";

                    if (battery3d) battery3d.src = batteryImg.src;
                    batteryImg.alt = batteryHex.title = `Kuri ${p}%`;
                }
            }
        }

        // Update Bluetooth
        function updateBluetoothStatus(ConnectedBTName, isBTConnected) {
            setTimeout(() => {
                const btShower = document.getElementById("current-playing-media-type-mini-player");
                const btName = document.getElementById("current-playing-media-type-mini-player-name");
                if (!btShower || !btName) return;

                let chosenbtImageNow = 'bluetooth-earpiece1.png';
                if (isBTConnected && ConnectedBTName) {
                    const nameLower = ConnectedBTName.toLowerCase();
                    if (nameLower.includes('airpods')) chosenbtImageNow = 'bluetooth-earpiece2.png';
                    else if (nameLower.includes('headset') || nameLower.includes('headphone')) chosenbtImageNow = 'bluetooth-headset.png';
                    else if (nameLower.includes('buds') || nameLower.includes('tws')) chosenbtImageNow = 'bluetooth-earpiece3.png';

                    btShower.style.display = btName.style.display = "block";
                    btShower.src = `static/images/${chosenbtImageNow}`;
                    btName.innerText = ConnectedBTName.length > 20 ? "Kuri BT" : ConnectedBTName;
                } else {
                    console.log("Bluetooth Not Connected");
                    btShower.src = `static/images/speaker.png`;
                    btName.innerText = "Speaker";
                }
            }, 100);
        }


        // console.log("Left: ", data.gesture.hands.Left)
        // console.log("Right: ", data.gesture.hands.Right)

        // Create gesture spam counter - STRICT FLOOD PROTECTION

        function handleGesture(gestureData) {
            const now = Date.now();
            const left = gestureData.hands?.Left;
            const right = gestureData.hands?.Right;

            // NEW: Check for push/pull gestures
            const pushPullState = gestureData.push_pull_state;
            const pushPullIntensity = gestureData.push_pull_intensity || 0;

            // Helper to check and update spam counter with STRICT FLOOD PROTECTION
            function checkGestureSpam(gestureKey) {
                const now = Date.now();
                const gesture = window.gestureSpamCounter[gestureKey];

                if (!gesture) {
                    console.warn(`No spam config for gesture: ${gestureKey}`);
                    return true; // Allow by default
                }

                // Reset if it's been more than 4 seconds since last gesture
                if (now - gesture.lastTime > 3000) {
                    gesture.count = 0;
                    gesture.blocked = false;
                    gesture.floodStart = now;
                }

                // Check if currently blocked
                if (gesture.blocked) {
                    const timeLeft = 3000 - (now - gesture.floodStart);
                    if (timeLeft > 0) {
                        // Still in block period
                        return false;
                    } else {
                        // Block period ended, reset
                        gesture.count = 0;
                        gesture.blocked = false;
                        gesture.floodStart = now;
                    }
                }

                // Increment and check
                gesture.count++;
                gesture.lastTime = now;

                // Allow first gesture, block subsequent ones in same 4-second window
                if (gesture.count > 1) {
                    gesture.blocked = true;
                    return false;
                }

                return true;
            }

            // ============ DETECT BOTH HANDS VISIBLE ============
            const bothHandsCurrentlyVisible = left?.visible && right?.visible;

            // Update both hands visible state
            if (bothHandsCurrentlyVisible) {
                // Both hands are visible
                window.rotationState.bothHandsVisible = true;
                window.rotationState.bothHandsCooldown = now + 1000; // 1 second cooldown after hands disappear
            } else if (window.rotationState.bothHandsVisible && now > window.rotationState.bothHandsCooldown) {
                // Both hands were visible but have disappeared and cooldown passed
                window.rotationState.bothHandsVisible = false;
            }

            if (pushPullState === 'PUSH' && pushPullIntensity >= window.pushPullState.minIntensity && left?.gesture === '4_FINGERS' || right?.gesture === '4_FINGERS') {
                if (now - window.pushPullState.lastPushTime >= window.pushPullState.pushCooldown) {
                    // Check which media is currently active
                    const image = document.getElementById('zoomable-image');
                    const video = document.getElementById('preview-video');

                    if (image && image.style.display !== 'none' && image.offsetParent !== null) {
                        // Image is visible - PUSH = ZOOM OUT
                        const zoomFactor = 1.0 - (pushPullIntensity * 0.3); // 30% max zoom out
                        if (typeof zoomImage === 'function') zoomImage(Math.max(0.1, zoomFactor));
                    } else if (video && video.style.display !== 'none' && video.offsetParent !== null) {
                        // Video is visible - PUSH = ZOOM OUT
                        const zoomFactor = 1.0 - (pushPullIntensity * 0.3); // 30% max zoom out
                        if (typeof zoomVideo === 'function') zoomVideo(Math.max(0.1, zoomFactor));

                    }
                    window.pushPullState.lastPushTime = now;
                    window.pushPullState.lastIntensity = pushPullIntensity;
                }
                return; // Exit after handling push
            }

            if (pushPullState === 'PULL' && pushPullIntensity >= window.pushPullState.minIntensity && left?.gesture === '4_FINGERS' || right?.gesture === '4_FINGERS') {
                if (now - window.pushPullState.lastPullTime >= window.pushPullState.pullCooldown) {

                    // Check which media is currently active
                    const image = document.getElementById('zoomable-image');
                    const video = document.getElementById('preview-video');

                    if (image && image.style.display !== 'none' && image.offsetParent !== null) {
                        // Image is visible - PULL = ZOOM IN
                        const zoomFactor = 1.0 + (pushPullIntensity * 0.5); // 50% max zoom in
                        if (typeof zoomImage === 'function') zoomImage(Math.min(5.0, zoomFactor));
                    } else if (video && video.style.display !== 'none' && video.offsetParent !== null) {
                        // Video is visible - PULL = ZOOM IN
                        const zoomFactor = 1.0 + (pushPullIntensity * 0.5); // 50% max zoom in
                        if (typeof zoomVideo === 'function') zoomVideo(Math.min(5.0, zoomFactor));
                    }
                    window.pushPullState.lastPullTime = now;
                    window.pushPullState.lastIntensity = pushPullIntensity;
                }
                return; // Exit after handling pull
            }

            // ============ CHECK FOR BOTH HANDS PLAY/PAUSE GESTURE ============
            let playPauseGesture = false;
            let playPauseGestureType = '';

            if (bothHandsCurrentlyVisible) {
                const leftGesture = left?.gesture || 'UNKNOWN';
                const rightGesture = right?.gesture || 'UNKNOWN';

                // Check for OPEN or 4_FINGERS gesture on both hands (for pause)
                const bothOpenOr4Fingers = (leftGesture === 'OPEN' || leftGesture === '4_FINGERS') &&
                    (rightGesture === 'OPEN' || rightGesture === '4_FINGERS');

                // Check for FIST gesture on both hands (for play/pause toggle)
                const bothFist = leftGesture === 'FIST' && rightGesture === 'FIST';

                if (bothOpenOr4Fingers) {
                    playPauseGesture = true;
                    playPauseGestureType = 'PAUSE';
                } else if (bothFist) {
                    playPauseGesture = true;
                    playPauseGestureType = 'TOGGLE_PLAYPAUSE';
                }
            }

            // Handle play/pause gesture
            if (playPauseGesture) {
                const bothHandsKey = 'BOTH_HANDS';

                if (checkGestureSpam(bothHandsKey)) {
                    // Check which media is currently playing
                    const video = document.getElementById('preview-video');
                    const audio = document.getElementById('preview-audio');
                    const image = document.getElementById('zoomable-image');

                    if (playPauseGestureType === 'PAUSE') {
                        // Pause gesture (both hands OPEN/4_FINGERS)
                        if (video && video.style.display !== 'none' && video.offsetParent !== null) {
                            // Pause video if playing
                            togglePlayPause();

                        } else if (audio && audio.style.display !== 'none' && audio.offsetParent !== null) {
                            // Pause audio if playing
                            toggleAudioPlayPause();

                        } else if (image && image.style.display !== 'none' && image.offsetParent !== null) {
                            // For images, show notification but no action
                            return;
                        } else {
                            showNotification("⏸️ No media playing", "info");
                            playErrorSound()
                        }
                        
                    } else if (playPauseGestureType === 'TOGGLE_PLAYPAUSE') {
                        // Toggle play/pause gesture (both hands FIST)
                        if (video && video.style.display !== 'none' && video.offsetParent !== null) {
                            // Toggle video play/pause
                            togglePlayPause()
                        } else if (audio && audio.style.display !== 'none' && audio.offsetParent !== null) {
                            toggleAudioPlayPause();
                        } else {
                         playErrorSound()
                        }
                    }
                } else if (window.gestureSpamCounter[bothHandsKey].blocked) {
                    // we do nothing here
                }

                // After handling play/pause, update rotation state and return
                if (left?.visible) {
                    window.rotationState.left.lastRotation = left.rotation || 0;
                    window.rotationState.left.lastGesture = left.gesture || '';
                    window.rotationState.left.lastTime = now;
                }
                if (right?.visible) {
                    window.rotationState.right.lastRotation = right.rotation || 0;
                    window.rotationState.right.lastGesture = right.gesture || '';
                    window.rotationState.right.lastTime = now;
                }
                return; // Exit after handling play/pause
            }

            // ============ CHECK FOR SINGLE-HAND PINCH ROTATION ============
            let pinchRotating = false;
            let rotatingHand = null;
            let rotationDirection = '';

            // Check left hand for PINCH
            if (left?.gesture === 'POINT' && left?.visible) {
                const leftRotation = left.rotation || 0;

                // Check if hand has significant rotation (ignore the direction of hand rotation)
                if (Math.abs(leftRotation) > 15) {
                    pinchRotating = true;
                    rotatingHand = 'left';
                    // LEFT hand PINCH rotates media RIGHT (clockwise)
                    rotationDirection = 'right';
                }
            }

            // Check right hand for PINCH (if left not already pinching)
            if (!pinchRotating && right?.gesture === 'POINT' && right?.visible) {
                const rightRotation = right.rotation || 0;

                // Check if hand has significant rotation (ignore the direction of hand rotation)
                if (Math.abs(rightRotation) > 15) {
                    pinchRotating = true;
                    rotatingHand = 'right';
                    // RIGHT hand PINCH rotates media LEFT (counter-clockwise)
                    rotationDirection = 'left';
                }
            }

            // Handle PINCH rotation
            if (pinchRotating && !window.rotationState.isPinchRotating) {
                const rotationKey = 'PINCH_ROTATE';

                // Check flood protection
                if (checkGestureSpam(rotationKey)) {
                    // Check which media is currently visible
                    const image = document.getElementById('zoomable-image');
                    const video = document.getElementById('preview-video');
                    const audio = document.getElementById('preview-audio');

                    // Determine which media is currently active
                    if (image && image.style.display !== 'none' && image.offsetParent !== null) {
                        // Trigger rotation action for image
                        if (typeof rotateImage === 'function') {
                            // Determine rotation degrees based on direction
                            const degrees = rotationDirection === 'right' ? 15 : -15;
                            rotateImage(degrees);
                        }
                    } else if (video && video.style.display !== 'none' && video.offsetParent !== null) {
                        // Trigger rotation action for video
                        if (typeof rotateVideo === 'function') {
                            // Determine rotation degrees based on direction
                            const degrees = rotationDirection === 'right' ? 15 : -15;
                            rotateVideo(degrees);
                        }
                    } else if (audio && audio.style.display !== 'none' && audio.offsetParent !== null) {
                        // Audio is visible (but audio doesn't rotate)
                        playErrorSound()
                        showNotification(`↺ Audio playing - can't rotate`, "info");
                        return; // Don't rotate audio
                    } else {
                        // No media visible
                        playErrorSound()
                        showNotification(`↺ No media to rotate`, "info");
                        return;
                    }

                    // Mark as rotating and set cooldown
                    window.rotationState.isPinchRotating = true;
                    window.rotationState.lastPinchRotationTime = now;
                    window.rotationState.rotationCooldownEnd = now + 1500; // 1.5 second cooldown
                } else if (window.gestureSpamCounter[rotationKey].blocked) {
                    window.rotationState.isPinchRotating = true;
                    window.rotationState.rotationCooldownEnd = now + 1800; // 0.8 second cooldown even if blocked
                }
            } else if (window.rotationState.isPinchRotating && now > window.rotationState.rotationCooldownEnd) {
                // Exit rotation mode after cooldown
                window.rotationState.isPinchRotating = false;
            }

            // ============ BLOCK ALL GESTURES WHEN BOTH HANDS ARE VISIBLE ============
            // But allow pinch rotation
            if (window.rotationState.bothHandsVisible && !pinchRotating) {
                // Update hand state tracking
                if (left?.visible) {
                    window.rotationState.left.lastRotation = left.rotation || 0;
                    window.rotationState.left.lastGesture = left.gesture || '';
                    window.rotationState.left.lastTime = now;
                }

                if (right?.visible) {
                    window.rotationState.right.lastRotation = right.rotation || 0;
                    window.rotationState.right.lastGesture = right.gesture || '';
                    window.rotationState.right.lastTime = now;
                }

                // If both hands are visible and we're not rotating with PINCH
                // Block all other gestures and just show notification
                showNotification("👐 Ibiganza Byombi", "info");
                return; // EXIT EARLY - BLOCK ALL OTHER GESTURES
            }

            // ============ BLOCK ALL OTHER GESTURES IF PINCH ROTATING ============
            if (window.rotationState.isPinchRotating) {
                // Update rotation state and return immediately - DON'T PROCESS ANY OTHER GESTURES
                if (left?.visible) {
                    window.rotationState.left.lastRotation = left.rotation || 0;
                    window.rotationState.left.lastGesture = left.gesture || '';
                    window.rotationState.left.lastTime = now;
                }

                if (right?.visible) {
                    window.rotationState.right.lastRotation = right.rotation || 0;
                    window.rotationState.right.lastGesture = right.gesture || '';
                    window.rotationState.right.lastTime = now;
                }

                return; // EXIT EARLY - NO OTHER GESTURES ALLOWED DURING PINCH ROTATION
            }

            // ============ ONLY PROCESS THESE IF BOTH HANDS ARE NOT VISIBLE ============
            // OR if not currently rotating with PINCH

            // LEFT HAND POINTING = PREVIOUS
            if (left?.gesture === 'HINDURA' && left?.visible) {
                if (checkGestureSpam('POINT_LEFT')) {
                    if (typeof navigateMedia === 'function') navigateMedia('next');
                } else if (window.gestureSpamCounter.POINT_LEFT.blocked) {
                }
            }

            // RIGHT HAND POINTING = NEXT
            if (right?.gesture === 'HINDURA' && right?.visible) {
                if (checkGestureSpam('POINT_RIGHT')) {
                    if (typeof navigateMedia === 'function') navigateMedia('next');
                } else if (window.gestureSpamCounter.POINT_RIGHT.blocked) {
                }
            }

            // REMOVED: FIST gesture for zoom out (replaced by PUSH gesture)

            // REMOVED: OPEN/4_FINGERS gesture for zoom in (replaced by PULL gesture)

            // PEACE GESTURE = RESET
            if ((left?.gesture === 'PEACE' || right?.gesture === 'PEACE') &&
                (left?.visible || right?.visible)) {
                if (checkGestureSpam('PEACE')) {
                    showNotification("Reset All", "success");

                    // Check which media is currently active
                    const image = document.getElementById('zoomable-image');
                    const video = document.getElementById('preview-video');
                    const audio = document.getElementById('preview-audio');

                    if (image && image.style.display !== 'none' && image.offsetParent !== null) {
                        // Image is visible
                        if (typeof resetImage === 'function') resetImage();
                    } else if (video && video.style.display !== 'none' && video.offsetParent !== null) {
                        // Video is visible
                        if (typeof resetVideo === 'function') resetVideo();
                    }

                    // Reset audio if it exists
                    if (audio) {
                        audio.volume = 1;
                        if (!audio.paused) audio.play();
                    }

                    // Reset video if it exists
                    if (video) {
                        video.volume = 1;
                        if (!video.paused) video.play();
                    }
                } else if (window.gestureSpamCounter.PEACE.blocked) {
                    // we do nothing here
                }
            }

            // Update rotation state for both hands
            if (left?.visible) {
                window.rotationState.left.lastRotation = left.rotation || 0;
                window.rotationState.left.lastGesture = left.gesture || '';
                window.rotationState.left.lastTime = now;
            }

            if (right?.visible) {
                window.rotationState.right.lastRotation = right.rotation || 0;
                window.rotationState.right.lastGesture = right.gesture || '';
                window.rotationState.right.lastTime = now;
            }
        }

        if (data.gesture && window.fileExplorerWasOpened) {
            handleGesture(data.gesture);
        }


        const ConnectedBTName = data.statuses.ear_device;
        const isBTConnected = data.statuses.bluetooth;
        updateBluetoothStatus(ConnectedBTName, isBTConnected);

        // Update media & download icons
        updateMediaAndDownloadStatus();
    };


    // Update monitor dashboard
    const updateMonitorDashboard = (data) => {
        if (!monitorComponents || !monitorConfig.showMonitor) return;

        // Update GPU
        updateMonitorGPU(data);

        // Update CPU
        updateMonitorCPU(data);

        // Update Network
        updateMonitorNetwork(data);

        // Update Disk
        if (monitorConfig.showDiskUsage) {
            updateMonitorDisk(data);
        }

        // Draw all graphs
        if (monitorComponents.gpuGraphCanvas) drawMonitorGraph('gpu');
        if (monitorComponents.cpuGraphCanvas) drawMonitorGraph('cpu');
        if (monitorComponents.netGraphCanvas) drawMonitorGraph('net');
        if (monitorConfig.showDiskUsage && monitorComponents.diskGraphCanvas) drawMonitorGraph('disk');
    };

    // Monitor component update functions
    const updateMonitorGPU = (data) => {
        if (!monitorComponents || !monitorComponents.gpuPercentDisplay) return;

        const gpuInfo = data.gpu || {};
        let gpuUsage = 0;

        if (gpuInfo.available && gpuInfo.gpus && gpuInfo.gpus.length > 0) {
            gpuUsage = gpuInfo.total_utilization ||
                (gpuInfo.gpus.reduce((sum, gpu) => sum + (gpu.utilization_gpu || 0), 0) / gpuInfo.gpus.length);
        }

        monitorComponents.gpuPercentDisplay.textContent = Math.round(gpuUsage) + '%';

        // Add to graph data
        monitorGraphs.gpu.data.push(gpuUsage);
        if (monitorGraphs.gpu.data.length > monitorGraphs.gpu.maxPoints) {
            monitorGraphs.gpu.data.shift();
        }

        // GPU Temperature
        let gpuTemp = '--';
        if (gpuInfo.available && gpuInfo.gpus && gpuInfo.gpus.length > 0) {
            const avgTemp = gpuInfo.average_temperature ||
                (gpuInfo.gpus.reduce((sum, gpu) => sum + (gpu.temperature || 0), 0) / gpuInfo.gpus.length);
            gpuTemp = Math.round(avgTemp) + '°C';
        }
        monitorComponents.gpuTempDisplay.textContent = gpuTemp;

        // GPU Power
        let gpuPower = '--';
        if (gpuInfo.available && gpuInfo.gpus && gpuInfo.gpus.length > 0 && gpuInfo.gpus[0].power_usage_w) {
            gpuPower = Math.round(gpuInfo.gpus[0].power_usage_w) + 'W';
        }
        monitorComponents.gpuPowerDisplay.textContent = gpuPower;
    };

    const updateMonitorCPU = (data) => {
        if (!monitorComponents || !monitorComponents.cpuPercentDisplay) return;

        const cpuInfo = data.cpu || {};
        let cpuUsage = cpuInfo.total_percent || 0;
        monitorComponents.cpuPercentDisplay.textContent = Math.round(cpuUsage) + '%';

        // Add to graph data
        monitorGraphs.cpu.data.push(cpuUsage);
        if (monitorGraphs.cpu.data.length > monitorGraphs.cpu.maxPoints) {
            monitorGraphs.cpu.data.shift();
        }

        // CPU Temperature
        let cpuTemp = '--';
        const tempInfo = data.temperature || {};
        if (tempInfo.cpu_average) {
            cpuTemp = Math.round(tempInfo.cpu_average) + '°C';
        } else if (tempInfo.cpu_temps && Object.values(tempInfo.cpu_temps).length > 0) {
            const temps = Object.values(tempInfo.cpu_temps);
            const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
            cpuTemp = Math.round(avgTemp) + '°C';
        }
        monitorComponents.cpuTempDisplay.textContent = cpuTemp;

        // CPU Power (estimated)
        const cpuPower = Math.round(30 + (cpuUsage / 100) * 70);
        monitorComponents.cpuPowerDisplay.textContent = cpuPower + 'W';
    };

    const updateMonitorNetwork = (data) => {
        if (!monitorComponents || !monitorComponents.netSpeedDisplay) return;

        const networkInfo = data.network || {};
        const currentTime = Date.now();

        // Calculate network speed
        let downloadSpeed = 0;
        let uploadSpeed = 0;

        if (lastNetworkBytes.time > 0) {
            const timeDiff = (currentTime - lastNetworkBytes.time) / 1000;
            if (timeDiff > 0) {
                const bytesRecvDiff = (networkInfo.bytes_recv || 0) - lastNetworkBytes.recv;
                const bytesSentDiff = (networkInfo.bytes_sent || 0) - lastNetworkBytes.sent;

                downloadSpeed = (bytesRecvDiff * 8) / (timeDiff * 1000000);
                uploadSpeed = (bytesSentDiff * 8) / (timeDiff * 1000000);
            }
        }

        // Update last values
        lastNetworkBytes = {
            sent: networkInfo.bytes_sent || 0,
            recv: networkInfo.bytes_recv || 0,
            time: currentTime
        };

        // Display total speed
        const totalSpeed = downloadSpeed + uploadSpeed;
        monitorComponents.netSpeedDisplay.textContent = totalSpeed.toFixed(1) + 'Mb/s';

        // Network usage
        let netUsage = 0;
        if (networkInfo.interfaces) {
            const interfaces = Object.values(networkInfo.interfaces);
            if (interfaces.length > 0) {
                const primaryIf = interfaces.find(iface => iface.is_active) || interfaces[0];
                if (primaryIf && primaryIf.current_speed_recv_bps) {
                    netUsage = Math.min(100, (primaryIf.current_speed_recv_bps / (100 * 1000000)) * 100);
                }
            }
        }

        // Add to graph data
        const graphValue = Math.min(100, downloadSpeed * 10);
        monitorGraphs.net.data.push(graphValue);
        if (monitorGraphs.net.data.length > monitorGraphs.net.maxPoints) {
            monitorGraphs.net.data.shift();
        }

        // Network usage percentage
        monitorComponents.netUsageDisplay.textContent = Math.round(netUsage) + '%';

        // Latency
        const latency = networkInfo.has_internet ?
            (20 + Math.random() * 30) : 999;
        monitorComponents.netLatencyDisplay.textContent = networkInfo.has_internet ?
            Math.round(latency) + 'ms' :
            'offline';
    };

    const updateMonitorDisk = (data) => {
        if (!monitorConfig.showDiskUsage || !monitorComponents || !monitorComponents.diskPercentDisplay) return;

        const diskInfo = data.disk || {};
        const currentTime = Date.now();

        // Disk usage percentage
        const diskUsage = diskInfo.percent || 0;
        monitorComponents.diskPercentDisplay.textContent = Math.round(diskUsage) + '%';

        // Update disk bar
        if (monitorComponents.diskBar) {
            monitorComponents.diskBar.style.width = diskUsage + '%';

            if (diskUsage > 90) {
                monitorComponents.diskBar.style.background = 'linear-gradient(90deg, #ff5555, #ff8888)';
            } else if (diskUsage > 75) {
                monitorComponents.diskBar.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc44)';
            } else {
                monitorComponents.diskBar.style.background = 'linear-gradient(90deg, #38b000, #7ee787)';
            }
        }

        // Add to graph data
        monitorGraphs.disk.data.push(diskUsage);
        if (monitorGraphs.disk.data.length > monitorGraphs.disk.maxPoints) {
            monitorGraphs.disk.data.shift();
        }

        // Calculate disk speeds
        let readSpeed = 0;
        let writeSpeed = 0;

        if (lastDiskBytes.time > 0) {
            const timeDiff = (currentTime - lastDiskBytes.time) / 1000;
            if (timeDiff > 0) {
                const readDiff = (diskInfo.read_bytes || 0) - lastDiskBytes.read;
                const writeDiff = (diskInfo.write_bytes || 0) - lastDiskBytes.write;

                readSpeed = readDiff / (timeDiff * 1000000);
                writeSpeed = writeDiff / (timeDiff * 1000000);
            }
        }

        // Update last values
        lastDiskBytes = {
            read: diskInfo.read_bytes || 0,
            write: diskInfo.write_bytes || 0,
            time: currentTime
        };

        // Display speeds
        monitorComponents.diskReadSpeedDisplay.textContent = readSpeed.toFixed(1) + 'MiB/s';
        monitorComponents.diskWriteSpeedDisplay.textContent = writeSpeed.toFixed(1) + 'MiB/s';

        // Disk health (estimated)
        const health = Math.max(85, 100 - (diskUsage / 10) - Math.random() * 5);
        monitorComponents.diskHealthDisplay.textContent = Math.round(health) + '%';
    };

    // Update media and download status


    // WEBSOCKET CONNECTION
    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 2000;

    const connectWebSocket = async () => {
        try {
            const wsUrl = `${SOCKET_URL}`;
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connected for system status');
                reconnectAttempts = 0;

                // Request initial status
                ws.send(JSON.stringify({ type: 'get_status' }));

                // Set up polling for regular updates
                const pollInterval = setInterval(() => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'get_status' }));
                    }
                }, 1000); // Poll every second

                // Store interval for cleanup
                ws._pollInterval = pollInterval;
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    updateAllStatusUI(data);
                } catch (e) {
                    console.error('Error parsing WebSocket message:', e);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                if (ws._pollInterval) {
                    clearInterval(ws._pollInterval);
                }
                if (reconnectAttempts < maxReconnectAttempts) {
                    setTimeout(() => {
                        reconnectAttempts++;
                        console.log(`Reconnecting... attempt ${reconnectAttempts}`);
                        connectWebSocket();
                    }, reconnectDelay * reconnectAttempts);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (ws._pollInterval) {
                    clearInterval(ws._pollInterval);
                }
            };

        } catch (error) {
            console.error('WebSocket connection failed:', error);
            startHTTPPolling();
        }
    };

    // Fallback to HTTP polling
    const startHTTPPolling = () => {
        console.log('Starting HTTP polling fallback');
        const pollStatus = async () => {
            try {
                const resp = await fetch(`${BASE_URL}/status/`);
                if (resp.ok) {
                    const data = await resp.json();
                    updateAllStatusUI(data);
                }
            } catch (e) {
                console.error('HTTP polling error:', e);
            }
        };

        pollStatus();
        const pollInterval = setInterval(pollStatus, 10000);

        // Store interval for cleanup
        if (monitorElement) {
            monitorElement._pollInterval = pollInterval;
        }
    };

    // Add pulse animation if not already added
    if (!document.querySelector('#download-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'download-pulse-style';
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 0.3; }
                7% { opacity: 0.35; }
                10% { opacity: 0.4; }
                20% { opacity: 0.5; }
                30% { opacity: 0.7; }
                40% { opacity: 0.8; }
                50% { opacity: 0.7; }
                60% { opacity: 0.6; }
                70% { opacity: 0.5; }
                85% { opacity: 0.4; }
                100% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    connectWebSocket();

    // Update media status every 5 seconds
    const mediaUpdateInterval = setInterval(updateMediaAndDownloadStatus, 5000);

    // Return control object
    return {
        element: monitorElement,
        updateValues: (data) => updateAllStatusUI(data),
        updateStatusIcons: (data) => updateStatusIcons(data),
        updateMonitorDashboard: (data) => updateMonitorDashboard(data),
        updateMediaAndDownloadStatus: updateMediaAndDownloadStatus,
        stopUpdates: () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            if (ws && ws._pollInterval) {
                clearInterval(ws._pollInterval);
            }
            if (monitorElement && monitorElement._pollInterval) {
                clearInterval(monitorElement._pollInterval);
            }
            clearInterval(mediaUpdateInterval);
        },
        destroy: () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            if (ws && ws._pollInterval) {
                clearInterval(ws._pollInterval);
            }
            if (monitorElement && monitorElement._pollInterval) {
                clearInterval(monitorElement._pollInterval);
            }
            clearInterval(mediaUpdateInterval);
            if (monitorElement) {
                monitorElement.remove();
                monitorElement = null;
                monitorComponents = null;
            }
        },
        showMonitor: (show = true) => {
            if (show && !monitorConfig.showMonitor) {
                monitorConfig.showMonitor = true;
                // Recreate monitor
                window.showStatuses({ ...monitorConfig, showMonitor: true });
            } else if (!show && monitorConfig.showMonitor && monitorElement) {
                monitorConfig.showMonitor = false;
                if (monitorElement) {
                    monitorElement.remove();
                    monitorElement = null;
                    monitorComponents = null;
                }
            }
        }
    };
};

// Usage examples:
window.showStatuses(); // Just status i

// Status icons + monitor dashboard
// window.showStatuses({showMonitor: true, showDiskUsage: false}); // Without disk
// window.showStatuses({showMonitor: true, position: 'inline'}); // Inline monitor

window.showIncreasor = function (id, pitch = false) {
    // Remove any previous instance
    document.querySelectorAll('.sharpening-control-increasor').forEach(el => el.remove());
    document.querySelectorAll('.sharpening-backdrop-increasor').forEach(el => el.remove());
    hideNavigationIcons();

    const el = document.getElementById(id);
    if (!el) {
        console.error(`Element with id "${id}" not found`);
        return;
    }

    // Check if element is audio or video
    if (el.tagName !== "AUDIO" && el.tagName !== "VIDEO") {
        console.error(`Element with id "${id}" is not an audio or video element`);
        return;
    }

    // Determine control type
    const isVolumeControl = !pitch;
    const controlTitle = isVolumeControl ? 'VOLUME' : 'iJWI';
    const unit = isVolumeControl ? '%' : 'x';

    // Calculate initial value
    let currentValue;
    if (isVolumeControl) {
        currentValue = Math.round(el.volume * 100);
    } else {
        currentValue = el.playbackRate || 1.0;
    }

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'sharpening-backdrop-increasor';
    backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: transparent;
        z-index: 10000;
        cursor: pointer;
    `;
    document.body.appendChild(backdrop);

    // Create control container - EXACTLY LIKE SHARPENING
    const controlContainer = document.createElement('div');
    controlContainer.className = 'sharpening-control-increasor';
    controlContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        background: transparent;
        z-index: 10001;
        pointer-events: auto;
    `;

    controlContainer.innerHTML = `
        <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);color:#b1ffff;font-size:0.9rem;font-weight:bold;text-shadow:0 0 10px rgba(0,255,255,0.8);white-space:nowrap;">
            ${controlTitle}
        </div>
        
        <div style="position:relative;width:100%;height:100%;">
            <!-- Background ring -->
            <div style="width:100%;height:100%;border:2px solid rgba(255,255,255,0.1);border-radius:50%;position:relative;background:transparent;">
                
                <!-- Progress ring -->
                <div id="progressRingIncreasor" style="position:absolute;inset:-4px;border:8px solid #b1ffff;border-radius:50%;clip-path:polygon(50% 50%, 50% 0%, 75% 0%);transform:rotate(0deg);transform-origin:center;transition:transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                
                <!-- Center value display -->
                <div id="centerValueIncreasor" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:72px;font-weight:800;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,0.3);transition:all 0.2s;">
                    <span id="valueDisplayIncreasor">${isVolumeControl ? currentValue : currentValue.toFixed(2)}</span>
                </div>
            </div>
            
            <!-- Top marker -->
            <div style="position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:8px;height:8px;background:#b1ffff;border-radius:50%;box-shadow:0 0 15px rgba(0,255,255,0.7);"></div>
            
            <!-- Minus button -->
            <div id="minusBtnIncreasor" style="position:absolute;top:50%;left:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">−</div>
            
            <!-- Plus button -->
            <div id="plusBtnIncreasor" style="position:absolute;top:50%;right:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">+</div>
        </div>
    `;

    document.body.appendChild(controlContainer);

    // Get DOM elements
    const valueDisplay = document.getElementById('valueDisplayIncreasor');
    const progressRing = document.getElementById('progressRingIncreasor');
    const centerValue = document.getElementById('centerValueIncreasor');
    const minusBtn = document.getElementById('minusBtnIncreasor');
    const plusBtn = document.getElementById('plusBtnIncreasor');

    // Update color based on value
    function updateColor(value) {
        let color;
        if (isVolumeControl) {
            if (value < 20) {
                color = '#ff0000'; // Red for low
            } else if (value < 50) {
                color = '#ffff00'; // Yellow for medium
            } else {
                color = '#00ff00'; // Green for high
            }
        } else {
            if (value < 0.8) {
                color = '#0044ff'; // Blue for low
            } else if (value < 1.2) {
                color = '#00ff15ff'; // Green for normal
            } else {
                color = '#ff4400'; // Orange for high
            }
        }

        progressRing.style.borderColor = color;
    }

    // Update display
    function updateDisplay(value) {
        if (isVolumeControl) {
            currentValue = Math.max(0, Math.min(100, Math.round(value)));
            el.volume = currentValue / 100;
            valueDisplay.textContent = currentValue;
        } else {
            currentValue = Math.max(0.5, Math.min(2.0, Math.round(value * 100) / 100));
            el.playbackRate = currentValue;
            valueDisplay.textContent = currentValue.toFixed(2);
        }

        // Update progress ring (0-100% for volume, 0.5-2.0 for pitch)
        let angle;
        if (isVolumeControl) {
            angle = (currentValue / 100) * 360;
        } else {
            // Map 0.5-2.0 to 0-360 degrees
            const range = 2.0 - 0.5;
            angle = ((currentValue - 0.5) / range) * 360;
        }

        progressRing.style.transform = `rotate(${angle}deg)`;
        updateColor(currentValue);

        // Slight scale effect
        const intensity = isVolumeControl ? currentValue / 100 : (currentValue - 0.5) / 1.5;
        centerValue.style.transform = `translate(-50%, -50%) scale(${1 + intensity * 0.05})`;

        // Show notification
        showNotification(`${controlTitle}: ${isVolumeControl ? currentValue : currentValue.toFixed(2)}${unit}`);
    }

    // Set initial color
    updateColor(currentValue);

    // Set initial progress ring
    let initialAngle;
    if (isVolumeControl) {
        initialAngle = (currentValue / 100) * 360;
    } else {
        initialAngle = ((currentValue - 0.5) / 1.5) * 360;
    }
    progressRing.style.transform = `rotate(${initialAngle}deg)`;

    // Button controls
    minusBtn.addEventListener('click', () => {
        const step = isVolumeControl ? 5 : 0.1;
        updateDisplay(currentValue - step);
    });

    plusBtn.addEventListener('click', () => {
        const step = isVolumeControl ? 5 : 0.1;
        updateDisplay(currentValue + step);
    });

    // Mouse wheel control
    controlContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const step = isVolumeControl ? 5 : 0.1;
        if (e.deltaY < 0) {
            updateDisplay(currentValue + step);
        } else {
            updateDisplay(currentValue - step);
        }
    }, { passive: false });

    // Click and drag control
    let isDragging = false;
    let startAngle = 0;
    let startValue = 0;

    function getAngleFromPoint(x, y) {
        const rect = controlContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle = (angle + 90) % 360;
        if (angle < 0) angle += 360;

        return angle;
    }

    controlContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngleFromPoint(e.clientX, e.clientY);
        startValue = currentValue;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentAngle = getAngleFromPoint(e.clientX, e.clientY);
        const angleDiff = currentAngle - startAngle;

        // Adjust sensitivity
        let newValue;
        if (isVolumeControl) {
            newValue = startValue + (angleDiff / 360) * 100;
        } else {
            newValue = startValue + (angleDiff / 360) * 1.5;
        }

        updateDisplay(newValue);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    controlContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startAngle = getAngleFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        startValue = currentValue;
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentAngle = getAngleFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        const angleDiff = currentAngle - startAngle;

        let newValue;
        if (isVolumeControl) {
            newValue = startValue + (angleDiff / 360) * 100;
        } else {
            newValue = startValue + (angleDiff / 360) * 1.5;
        }

        updateDisplay(newValue);
        e.preventDefault();
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Double-click to reset
    controlContainer.addEventListener('dblclick', () => {
        if (isVolumeControl) {
            updateDisplay(50);
        } else {
            updateDisplay(1.0);
        }
    });

    // Close function
    const closeControl = () => {
        if (document.body.contains(controlContainer)) {
            document.body.removeChild(controlContainer);
        }
        if (document.body.contains(backdrop)) {
            document.body.removeChild(backdrop);
        }
        document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeControl();
        }
    };

    document.addEventListener('keydown', handleEscape);
    backdrop.addEventListener('click', closeControl);
};

// Pitch control function - uses same UI
window.showPitcher = function (id) {
    // Remove any previous instance
    document.querySelectorAll('.sharpening-control-pitcher').forEach(el => el.remove());
    document.querySelectorAll('.sharpening-backdrop-pitcher').forEach(el => el.remove());
    hideNavigationIcons();

    const el = document.getElementById(id);
    if (!el) {
        console.error(`Element with id "${id}" not found`);
        return;
    }

    // Check if element is audio or video
    if (el.tagName !== "AUDIO" && el.tagName !== "VIDEO") {
        console.error(`Element with id "${id}" is not an audio or video element`);
        return;
    }

    const controlTitle = 'iJWI';

    // Get current source
    const sourceElement = el.querySelector('source');
    if (!sourceElement) {
        console.error('No source element found');
        return;
    }

    // Store original source for backup
    const originalSrc = sourceElement.src;

    // Extract file path from URL
    function extractFilePathFromURL(url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('path');
    }

    const inputPath = extractFilePathFromURL(originalSrc);
    if (!inputPath) {
        console.error('Could not extract file path from URL');
        return;
    }

    // Initialize with current playback rate
    let currentValue = el.playbackRate || 1.0;
    let pendingRequest = null;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'sharpening-backdrop-pitcher';
    backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: transparent;
        z-index: 10000;
        cursor: pointer;
    `;
    document.body.appendChild(backdrop);

    // Create control container - EXACTLY LIKE SHARPENING
    const controlContainer = document.createElement('div');
    controlContainer.className = 'sharpening-control-pitcher';
    controlContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        background: transparent;
        z-index: 10001;
        pointer-events: auto;
    `;

    controlContainer.innerHTML = `
        <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);color:#ff4400;font-size:0.9rem;font-weight:bold;text-shadow:0 0 10px rgba(255,68,0,0.8);white-space:nowrap;">
            ${controlTitle}
        </div>
        
        <div style="position:relative;width:100%;height:100%;">
            <!-- Background ring -->
            <div style="width:100%;height:100%;border:2px solid rgba(255,255,255,0.1);border-radius:50%;position:relative;background:transparent;">
                
                <!-- Progress ring -->
                <div id="progressRingPitcher" style="position:absolute;inset:-4px;border:8px solid #ff4400;border-radius:50%;clip-path:polygon(50% 50%, 50% 0%, 75% 0%);transform:rotate(0deg);transform-origin:center;transition:transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                
                <!-- Center value display -->
                <div id="centerValuePitcher" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:72px;font-weight:800;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,0.3);transition:all 0.2s;">
                    <span id="valueDisplayPitcher">${currentValue.toFixed(2)}</span>
                </div>
                
                <!-- Loading indicator -->
                <div id="loadingIndicatorPitcher" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;">
                    <div style="width:40px;height:40px;border:3px solid rgba(255,68,0,0.3);border-top:3px solid #ff4400;border-radius:50%;animation:spin 1s linear infinite;"></div>
                </div>
            </div>
            
            <!-- Top marker -->
            <div style="position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:8px;height:8px;background:#ff4400;border-radius:50%;box-shadow:0 0 15px rgba(255,68,0,0.7);"></div>
            
            <!-- Minus button -->
            <div id="minusBtnPitcher" style="position:absolute;top:50%;left:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">−</div>
            
            <!-- Plus button -->
            <div id="plusBtnPitcher" style="position:absolute;top:50%;right:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">+</div>
        </div>
    `;

    document.body.appendChild(controlContainer);

    // Add CSS for spinner animation
    if (!document.getElementById('pitch-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'pitch-spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Get DOM elements
    const valueDisplay = document.getElementById('valueDisplayPitcher');
    const progressRing = document.getElementById('progressRingPitcher');
    const centerValue = document.getElementById('centerValuePitcher');
    const loadingIndicator = document.getElementById('loadingIndicatorPitcher');
    const minusBtn = document.getElementById('minusBtnPitcher');
    const plusBtn = document.getElementById('plusBtnPitcher');

    // Function to send pitch change request to backend
    async function applyPitchChange(pitchFactor) {
        // Don't apply if pitch is 1.0 (original) or if request is already pending
        if (pitchFactor === 1.0 || pendingRequest) return;

        try {
            pendingRequest = true;

            // Show loading indicator
            loadingIndicator.style.display = 'block';
            valueDisplay.style.opacity = '0.5';

            console.log('=== SENDING PITCH CHANGE REQUEST ===');
            console.log('Input path:', inputPath);
            console.log('Pitch factor:', pitchFactor);

            // Send request to backend - MAIN CHANGE HERE
            const response = await fetch(`${BASE_URL}/change_pitch/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    input_path: inputPath,
                    pitch_factor: pitchFactor
                })
            });

            // Check content type
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('video/') || contentType.includes('audio/')) {
                // It's a streaming response - create blob URL
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                // Get timestamp for cache busting
                const timestamp = new Date().getTime();
                const newMediaURL = `${blobUrl}#t=${timestamp}`;

                // Update video/audio element source
                const sourceElement = el.querySelector('source');
                if (sourceElement) {
                    sourceElement.src = newMediaURL;
                    el.load();

                    // Play the video after loading
                    setTimeout(() => {
                        el.play().catch(e => console.log('Auto-play prevented:', e));
                    }, 500);

                    console.log('Media updated with stream:', newMediaURL);
                }

                // Store blob URL for cleanup
                window.currentBlobUrl = blobUrl;

                // Update notification
                showNotification(`iJWI ${pitchFactor.toFixed(2)}x - Streaming`);
            } else {
                // JSON response (backward compatibility)
                const data = await response.json();

                if (data.success) {
                    console.log('Pitch response:', data);

                    // Force refresh with timestamp to avoid caching
                    const timestamp = new Date().getTime();
                    const newMediaURL = `${BASE_URL}/preview_file/?path=${encodeURIComponent(data.output_path)}&t=${timestamp}`;

                    // Update video source
                    const sourceElement = el.querySelector('source');
                    if (sourceElement) {
                        sourceElement.src = newMediaURL;
                        el.load();

                        // Play the video after loading
                        setTimeout(() => {
                            el.play().catch(e => console.log('Auto-play prevented:', e));
                        }, 500);

                        console.log('Media updated with new URL:', newMediaURL);
                    }

                    // Update notification
                    showNotification(`iJWI ${pitchFactor.toFixed(2)}x`);
                } else {
                    console.error('❌ Ihindura Jwi Riranze');
                    showNotification(`Ihindura Jwi Riranze`);
                }
            }
        } catch (error) {
            console.error('❌ Error applying pitch change:', error);
            showNotification('Ihindura Jwi Riranze', 'error');
        } finally {
            pendingRequest = false;
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            valueDisplay.style.opacity = '1';
        }
    }

    // Debounce timer for backend requests
    let pitchDebounceTimer = null;

    // Update color based on pitch value
    function updateColor(value) {
        let color;
        if (value < 0.8) {
            color = '#0044ff'; // Blue for low pitch
        } else if (value < 1.2) {
            color = '#00ff44'; // Green for normal pitch
        } else {
            color = '#ff4400'; // Orange for high pitch
        }

        progressRing.style.borderColor = color;
    }

    // Update display
    function updateDisplay(value) {
        currentValue = Math.max(0.5, Math.min(2.0, Math.round(value * 100) / 100));
        valueDisplay.textContent = currentValue.toFixed(2);

        // Update progress ring (0.5-2.0 to 0-360 degrees)
        const range = 2.0 - 0.5;
        const angle = ((currentValue - 0.5) / range) * 360;

        progressRing.style.transform = `rotate(${angle}deg)`;
        updateColor(currentValue);

        // Slight scale effect
        const intensity = (currentValue - 0.5) / 1.5;
        centerValue.style.transform = `translate(-50%, -50%) scale(${1 + intensity * 0.05})`;

        // Show immediate notification for UI feedback
        showNotification(`iJWI ${currentValue.toFixed(2)}`);

        // Debounce backend request (send after user stops adjusting)
        clearTimeout(pitchDebounceTimer);
        pitchDebounceTimer = setTimeout(() => {
            if (currentValue !== 1.0) {
                applyPitchChange(currentValue);
            }
        }, 4000); // 1 second delay after last adjustment
    }

    // Set initial color
    updateColor(currentValue);

    // Set initial progress ring
    const initialAngle = ((currentValue - 0.5) / 1.5) * 360;
    progressRing.style.transform = `rotate(${initialAngle}deg)`;

    // Button controls
    minusBtn.addEventListener('click', () => {
        updateDisplay(currentValue - 0.1);
    });

    plusBtn.addEventListener('click', () => {
        updateDisplay(currentValue + 0.1);
    });

    // Mouse wheel control
    controlContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            updateDisplay(currentValue + 0.1);
        } else {
            updateDisplay(currentValue - 0.1);
        }
    }, { passive: false });

    // Click and drag control
    let isDragging = false;
    let startAngle = 0;
    let startValue = 0;

    function getAngleFromPoint(x, y) {
        const rect = controlContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle = (angle + 90) % 360;
        if (angle < 0) angle += 360;

        return angle;
    }

    controlContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngleFromPoint(e.clientX, e.clientY);
        startValue = currentValue;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentAngle = getAngleFromPoint(e.clientX, e.clientY);
        const angleDiff = currentAngle - startAngle;

        // Adjust sensitivity for pitch range
        const newValue = startValue + (angleDiff / 360) * 1.5;
        updateDisplay(newValue);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    controlContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startAngle = getAngleFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        startValue = currentValue;
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentAngle = getAngleFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        const angleDiff = currentAngle - startAngle;

        const newValue = startValue + (angleDiff / 360) * 1.5;
        updateDisplay(newValue);
        e.preventDefault();
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Double-click to reset
    controlContainer.addEventListener('dblclick', () => {
        // If current value is already 1.0, do nothing
        if (currentValue === 1.0) return;

        // First show UI reset
        currentValue = 1.0;
        valueDisplay.textContent = '1.00';
        updateColor(currentValue);
        progressRing.style.transform = `rotate(${((1.0 - 0.5) / 1.5) * 360}deg)`;
        showNotification('Ijwi Rigaruwe Kuri 1.0x');

        // Send request to backend to revert to original
        clearTimeout(pitchDebounceTimer);
        applyPitchChange(1.0);
    });

    // Function to get CSRF token
    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }

    // Clear function
    function ClearNyx(path) {
        fetch(`${BASE_URL}/siba/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ path: path })
        }).catch(e => console.log('Clear error:', e));
    }

    // Close function
    const closeControl = () => {
        // Clear any pending debounce
        clearTimeout(pitchDebounceTimer);

        if (document.body.contains(controlContainer)) {
            document.body.removeChild(controlContainer);
        }
        if (document.body.contains(backdrop)) {
            document.body.removeChild(backdrop);
        }
        document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeControl();
        }
    };

    document.addEventListener('keydown', handleEscape);
    backdrop.addEventListener('click', closeControl);
};

// Speed control function - EXACT SAME UI
window.ApplySpeed = function (id) {
    // Remove any previous instance
    document.querySelectorAll('.sharpening-control-speed').forEach(el => el.remove());
    document.querySelectorAll('.sharpening-backdrop-speed').forEach(el => el.remove());
    hideNavigationIcons();

    const el = document.getElementById(id);
    if (!el) {
        console.error(`Element with id "${id}" not found`);
        return;
    }

    // Check if element is audio or video
    if (el.tagName !== "AUDIO" && el.tagName !== "VIDEO") {
        console.error(`Element with id "${id}" is not an audio or video element`);
        return;
    }

    const controlTitle = 'UMUVUDUKO';
    let currentValue = el.playbackRate || 1.0;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'sharpening-backdrop-speed';
    backdrop.style.cssText = `
        position: fixed;
        inset: 0;
        background: transparent;
        z-index: 10000;
        cursor: pointer;
    `;
    document.body.appendChild(backdrop);

    // Create control container - EXACTLY LIKE SHARPENING
    const controlContainer = document.createElement('div');
    controlContainer.className = 'sharpening-control-speed';
    controlContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        background: transparent;
        z-index: 10001;
        pointer-events: auto;
    `;

    controlContainer.innerHTML = `
        <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);color:#ffff00;font-size:0.9rem;font-weight:bold;text-shadow:0 0 10px rgba(255,255,0,0.8);white-space:nowrap;">
            ${controlTitle}
        </div>
        
        <div style="position:relative;width:100%;height:100%;">
            <!-- Background ring -->
            <div style="width:100%;height:100%;border:2px solid rgba(255,255,255,0.1);border-radius:50%;position:relative;background:transparent;">
                
                <!-- Progress ring -->
                <div id="progressRingSpeed" style="position:absolute;inset:-4px;border:8px solid #ffff00;border-radius:50%;clip-path:polygon(50% 50%, 50% 0%, 75% 0%);transform:rotate(0deg);transform-origin:center;transition:transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                
                <!-- Center value display -->
                <div id="centerValueSpeed" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:72px;font-weight:800;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,0.3);transition:all 0.2s;">
                    <span id="valueDisplaySpeed">${currentValue.toFixed(2)}</span>
                </div>
            </div>
            
            <!-- Top marker -->
            <div style="position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:8px;height:8px;background:#ffff00;border-radius:50%;box-shadow:0 0 15px rgba(255,255,0,0.7);"></div>
            
            <!-- Minus button -->
            <div id="minusBtnSpeed" style="position:absolute;top:50%;left:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">−</div>
            
            <!-- Plus button -->
            <div id="plusBtnSpeed" style="position:absolute;top:50%;right:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">+</div>
        </div>
    `;

    document.body.appendChild(controlContainer);

    // Get DOM elements
    const valueDisplay = document.getElementById('valueDisplaySpeed');
    const progressRing = document.getElementById('progressRingSpeed');
    const centerValue = document.getElementById('centerValueSpeed');
    const minusBtn = document.getElementById('minusBtnSpeed');
    const plusBtn = document.getElementById('plusBtnSpeed');

    // Update color based on speed value
    function updateColor(value) {
        let color;
        if (value < 0.8) {
            color = '#0044ff'; // Blue for slow
        } else if (value < 1.2) {
            color = '#00ff44'; // Green for normal
        } else if (value < 2.0) {
            color = '#ffff00'; // Yellow for fast
        } else {
            color = '#ff4400'; // Red for very fast
        }

        progressRing.style.borderColor = color;
    }

    // Update display
    function updateDisplay(value) {
        currentValue = Math.max(0.5, Math.min(4.0, Math.round(value * 100) / 100));
        el.playbackRate = currentValue;
        valueDisplay.textContent = currentValue.toFixed(2);

        // Update progress ring (0.5-4.0 to 0-360 degrees)
        const range = 4.0 - 0.5;
        const angle = ((currentValue - 0.5) / range) * 360;

        progressRing.style.transform = `rotate(${angle}deg)`;
        updateColor(currentValue);

        // Slight scale effect
        const intensity = (currentValue - 0.5) / 3.5;
        centerValue.style.transform = `translate(-50%, -50%) scale(${1 + intensity * 0.05})`;

        // Show notification
        showNotification(`UMUVUDUKO: ${currentValue.toFixed(2)}x`);
    }

    // Set initial color
    updateColor(currentValue);

    // Set initial progress ring
    const initialAngle = ((currentValue - 0.5) / 3.5) * 360;
    progressRing.style.transform = `rotate(${initialAngle}deg)`;

    // Button controls
    minusBtn.addEventListener('click', () => {
        updateDisplay(currentValue - 0.1);
    });

    plusBtn.addEventListener('click', () => {
        updateDisplay(currentValue + 0.1);
    });

    // Mouse wheel control
    controlContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            updateDisplay(currentValue + 0.1);
        } else {
            updateDisplay(currentValue - 0.1);
        }
    }, { passive: false });

    // Click and drag control
    let isDragging = false;
    let startAngle = 0;
    let startValue = 0;

    function getAngleFromPoint(x, y) {
        const rect = controlContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle = (angle + 90) % 360;
        if (angle < 0) angle += 360;

        return angle;
    }

    controlContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngleFromPoint(e.clientX, e.clientY);
        startValue = currentValue;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const currentAngle = getAngleFromPoint(e.clientX, e.clientY);
        const angleDiff = currentAngle - startAngle;

        // Adjust sensitivity for speed range
        const newValue = startValue + (angleDiff / 360) * 3.5;
        updateDisplay(newValue);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Double-click to reset
    controlContainer.addEventListener('dblclick', () => {
        updateDisplay(1.0);
    });

    // Close function
    const closeControl = () => {
        if (document.body.contains(controlContainer)) {
            document.body.removeChild(controlContainer);
        }
        if (document.body.contains(backdrop)) {
            document.body.removeChild(backdrop);
        }
        document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeControl();
        }
    };

    document.addEventListener('keydown', handleEscape);
    backdrop.addEventListener('click', closeControl);
};



// Load home directory and display as neural network
window.loadHomeDirectory = async function () {
    try {
        directoryTree.innerHTML = '<div class="tree-loading" style="text-align:center;color:#88ffff;padding:2rem;">Loading ...</div>';

        const response = await fetch(`${BASE_URL}/list_home/`);
        const data = await response.json();

        if (data.items) {
            currentPath = data.path;
            pathHistory = [{ path: currentPath, name: 'Home' }];
            neuralNodes.clear();
            activeConnections.clear();
            displayNeuralNetwork(data.items, 'Home');
        } else if (data.error) {
            showError('Failed to load directory: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading home directory:', error);
        showError('Cannot connect to backend: ' + error.message, error.stack);
    }
}



function showHandSigns(e) {
    const existingMenu = document.querySelector('.hand-sign-radial-menu');

    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    const menu = document.createElement('div');
    menu.className = 'hand-sign-radial-menu radial-context-menu';
    menu.style.cssText = `
        position: fixed;
        top: ${e.clientY - 300}px;
        left: ${e.clientX}px;
        width: 300px;
        height: 300px;
        z-index: 10000;
        pointer-events: none;
    `;

    const centerImage = document.createElement('div');
    centerImage.innerHTML = 'IBIMENYETSO';
    centerImage.className = 'context-center-image';
    centerImage.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    z-index: 100;
    cursor: pointer;
    pointer-events: auto;
    filter: drop-shadow(0 0 5px rgba(0, 219, 222, 0.5));
    font-weight: bold;
    font-size: 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;
    centerImage.onclick = () => menu.remove();

    const menuItems = [
        { action: 'next', image: 'static/images/handnxt.png', color: '#1E90FF', label: 'Igikurikira' },          // Blue for forward/movement
        { action: 'rotateright', image: 'static/images/handrotateright.png', color: '#FF8C00', label: 'Karaga Iburyo' }, // Orange for rotation/right turn
        { action: 'reset', image: 'static/images/handreset.png', color: '#FF0000', label: 'Tangira Byose' },      // Red for reset/stop/start over
        { action: 'rotateleft', image: 'static/images/handrotateleft.png', color: '#32CD32', label: 'Karaga Ibumoso' }, // Green for rotation/left turn
        { action: 'prev', image: 'static/images/handprv.png', color: '#8A2BE2', label: 'Icyabanje' },          // Purple for backward/previous
        { action: 'pause', image: 'static/images/handtoggleplaypause.png', color: '#FFD700', label: 'Hagarika/Kina' }, // Gold/yellow for pause/play toggle
        { action: 'zooming', image: 'static/images/handzooming.png', color: '#00CED1', label: 'Ongera/Gabanye Ingano' }, // Cyan/teal for zooming in/out
    ];



    const radius = 120;
    menuItems.forEach((item, index) => {
        const angle = (index * (360 / menuItems.length)) * (Math.PI / 180);
        const x = Math.cos(angle) * radius + 150;
        const y = Math.sin(angle) * radius + 150;

        const hexagonItem = document.createElement('div');
        hexagonItem.className = 'context-hexagon-item hand-sign-item';
        hexagonItem.style.cssText = `
            position: absolute;
            width: 80px;
            height: 92px;
            left: ${x - 40}px;
            top: ${y - 46}px;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 10;
            transform: scale(0.8);
            font-weight: bold;
            font-family: 'Outfit', san-serif;
        `;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            transition: all 0.3s ease;
            opacity: 0.7;
        `;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `
            M 30,8
            H 70
            a 5,5 0 0 1 4.33,2.5
            L 91.34,45
            a 5,5 0 0 1 0,10
            L 74.33,89.5
            A 5,5 0 0 1 70,92
            H 30
            a 5,5 0 0 1 -4.33,-2.5
            L 8.66,55
            a 5,5 0 0 1 0,-10
            L 25.67,10.5
            A 5,5 0 0 1 30,8
            Z
        `);
        path.setAttribute("fill", "transparent");
        path.setAttribute("stroke", item.color);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);

        const image = document.createElement('img');
        image.src = item.image;
        image.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 28px;
            height: 28px;
            z-index: 11;
            transition: all 0.3s ease;
            filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
        `;
        image.alt = item.action;

        const label = document.createElement('div');
        label.className = 'context-hexagon-label';
        label.textContent = item.label;
        label.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            white-space: nowrap;
            background: rgba(0, 0, 0, 0.8);
            padding: 4px 8px;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
            color: ${item.color};
            font-weight: bold;
            border: 1px solid ${item.color};
            pointer-events: none;
            z-index: 12;
            font-family: 'Outfit', san-serif;
            font-size: 15px;
        `;

        hexagonItem.addEventListener('mouseenter', function () {
            path.setAttribute("stroke-width", "3");
            path.setAttribute("stroke", item.color === '#ff002b' ? '#ff3366' : '#00ffff');
            svg.style.opacity = "1";
            svg.style.filter = "drop-shadow(0 0 8px currentColor)";
            image.style.transform = "translate(-50%, -50%) scale(1.2)";
            image.style.filter = "drop-shadow(0 0 4px rgba(0, 255, 255, 0.5))";
            label.style.opacity = "1";
            hexagonItem.style.zIndex = "20";
        });

        hexagonItem.addEventListener('mouseleave', function () {
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke", item.color);
            svg.style.opacity = "0.7";
            svg.style.filter = "none";
            image.style.transform = "translate(-50%, -50%) scale(1)";
            image.style.filter = "drop-shadow(0 0 2px rgba(0,0,0,0.3))";
            label.style.opacity = "0";
            hexagonItem.style.zIndex = "10";
        });

        hexagonItem.addEventListener('click', function (event) {
            event.stopPropagation();
            showNotification(item.label);
            menu.remove();
        });

        hexagonItem.appendChild(svg);
        hexagonItem.appendChild(image);
        hexagonItem.appendChild(label);
        menu.appendChild(hexagonItem);

        setTimeout(() => {
            hexagonItem.style.opacity = "1";
            hexagonItem.style.pointerEvents = "auto";
            hexagonItem.style.transform = "scale(1)";
            hexagonItem.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
        }, 100 + (index * 100));
    });

    menu.appendChild(centerImage);
    document.body.appendChild(menu);

    setTimeout(() => {
        centerImage.style.transition = "transform 0.5s ease";
        centerImage.style.transform = "translate(-50%, -50%) rotate(360deg)";
        setTimeout(() => {
            centerImage.style.transform = "translate(-50%, -50%) rotate(0deg)";
        }, 500);
    }, 50);

    setTimeout(() => {
        document.addEventListener('click', function outsideClickHandler(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', outsideClickHandler);
            }
        });
    }, 100);
}



document.addEventListener('DOMContentLoaded', function () {
    const fileExplorer = document.getElementById('file-explorer');
    const closeExplorerBtn = document.getElementById('close-explorer');
    const toggleSearchInterface = document.getElementById("search-interface");
    window.directoryTree = document.getElementById('directory-tree');
    const previewDetails = document.getElementById('preview-details');

    let currentPath = '';
    window.pathHistory = [];
    window.currentPlaying = null
    window.neuralNodes = new Map();
    window.activeConnections = new Set();
    window.OriginalSourcePath = null
    let currentItems = [];
    let currentFileList = [];
    let currentFileIndex = -1;

    // Icon mapping for different file types
    const FILE_ICONS = {
        // 基本文件类型
        folder: "static/images/folder.png",
        folder2: "static/images/folder2.png",
        image: "static/images/image.png",
        image2: "static/images/image2.png",
        image3: "static/images/image3.png",
        video: "static/images/video.png",
        video2: "static/images/video2.png",
        video3: "static/images/video3.png",
        video4: "static/images/video4.png",
        video5: "static/images/video5.png",
        audio: "static/images/audio.png",
        audio2: "static/images/audio2.png",
        audio3: "static/images/audio3.png",
        audio4: "static/images/audio4.png",
        audio5: "static/images/audio5.png",
        audio6: "static/images/audio6.png",
        text: "static/images/text.png",
        document: "static/images/document.png",
        unknown: "static/images/unknown.png",
        unknown2: "static/images/unknown2.png",

        // 媒体控制
        play: "static/images/play.png",
        pause: "static/images/pause.png",
        playing: "static/images/playing.png",
        player: "static/images/player.png",
        forward: "static/images/forward.png",
        rewind: "static/images/rewind.png",
        next: "static/images/next.png",
        previous: "static/images/previous.png",
        reset: "static/images/reset.png",
        slow: "static/images/slow.png",
        fast: "static/images/fast.png",
        fast2: "static/images/fast2.png",

        // 编辑/操作
        edit: "static/images/edit.png",
        copy: "static/images/copy.png",
        rename: "static/images/rename.png",
        delete: "static/images/delete.png",
        trash: "static/images/trash.png",
        send: "static/images/send.png",
        upload: "static/images/upload.png",
        download: "static/images/download.png",
        redownload: "static/images/redownload.png",

        // 图像/视图控制
        zoomin: "static/images/zoomin.png",
        zoomout: "static/images/zoomout.png",
        rotateLeft: "static/images/rotateLeft.png",
        rotateRight: "static/images/rotateRight.png",
        flip: "static/images/flip.png",
        drag: "static/images/drag.png",
        dotBig: "static/images/dotBig.png",
        radial: "static/images/radial.png",
        radial3: "static/images/radial3.png",

        // 音频控制
        pitch: "static/images/pitch.png",
        volume: "static/images/volume.png",
        speaker: "static/images/speaker.png",
        noaudio: "static/images/noaudio.png",

        // 电池状态
        batterycharging: "static/images/batterycharging.png",
        batterycritical: "static/images/batterycritical.png",
        batterycriticalcharging: "static/images/batterycriticalcharging.png",
        batteryfullcharging: "static/images/batteryfullcharging.png",
        batteryfullnotcharging: "static/images/batteryfullnotcharging.png",
        batterylow: "static/images/batterylow.png",
        batterynormal: "static/images/batterynormal.png",
        batterynormalcharging: "static/images/batterynormalcharging.png",

        // 网络/连接
        wifi: "static/images/wifi.png",
        wifi2: "static/images/wifi2.png",
        wifilow: "static/images/wifilow.png",
        nowifi: "static/images/nowifi.png",
        nowifi2: "static/images/nowifi2.png",
        network: "static/images/network.png",
        network2: "static/images/network2.png",
        connect: "static/images/connect.png",
        connect21: "static/images/connect21.png",
        "connect-bluetooth": "static/images/connect-bluetooth.png",

        // 蓝牙设备
        "bluetooth-earpiece1": "static/images/bluetooth-earpiece1.png",
        "bluetooth-earpiece2": "static/images/bluetooth-earpiece2.png",
        "bluetooth-earpiece3": "static/images/bluetooth-earpiece3.png",
        "bluetooth-headset": "static/images/bluetooth-headset.png",

        // 手势控制
        "hand-control": "static/images/hand-control.png",
        "hand-control2": "static/images/hand-control2.png",
        handnxt: "static/images/handnxt.png",
        handprv: "static/images/handprv.png",
        handreset: "static/images/handreset.png",
        handrotateleft: "static/images/handrotateleft.png",
        handrotateright: "static/images/handrotateright.png",
        handtoggleplaypause: "static/images/handtoggleplaypause.png",
        handzooming: "static/images/handzooming.png",
        "no-hand": "static/images/no-hand.png",

        // 设置/选项
        setting: "static/images/setting.png",
        options: "static/images/options.png",
        "change-setting": "static/images/change-setting.png",
        filters: "static/images/filters.png",
        "more-thing": "static/images/more-thing.png",
        advanced: "static/images/advanced.png",
        all: "static/images/all.png",
        close: "static/images/close.png",
        cancel: "static/images/cancel.png",
        add: "static/images/add.png",

        // 颜色/图像处理
        colors: "static/images/colors.png",
        colors2: "static/images/colors2.png",
        colors3: "static/images/colors3.png",
        colors4: "static/images/colors4.png",
        saturation: "static/images/saturation.png",
        sharpen: "static/images/sharpen.png",

        // 导航/方向
        up: "static/images/up.png",
        down: "static/images/down.png",
        downg: "static/images/downg.png",
        left: "static/images/left.png", // 注意：文件列表中未显示，但可能有
        right: "static/images/right.png", // 注意：文件列表中未显示，但可能有

        // 下载类型
        "download-audio": "static/images/download-audio.png",
        "download-image": "static/images/download-image.png",
        "download-video": "static/images/download-video.png",
        "download-torrent": "static/images/download-torrent.png",
        nodownloads: "static/images/nodownloads.png",

        // 文件管理器
        filemanager: "static/images/filemanager.png",
        "open-folder": "static/images/open-folder.png",
        usbDrive: "static/images/usb-drive.png",
        zip: "static/images/zip.png",

        // 系统/硬件
        poweroff: "static/images/poweroff.png",
        window: "static/images/window.png",
        core: "static/images/core.png",
        cursor: "static/images/cursor.png",
        processor: "static/images/processor.png",
        gpu: "static/images/gpu.png",
        gpu2: "static/images/gpu2.png",

        // 操作系统
        linux: "static/images/linux.png",
        macos: "static/images/macos.png",
        archlinux: "static/images/archlinux.png",

        // 应用/品牌
        nyxlogo: "static/images/nyxlogo.png",
        github: "static/images/github.png",
        windscribe: "static/images/windscribe.png",
        siba2: "static/images/siba2.png",
        siba3: "static/images/siba3.png",
        strawberry: "static/images/strawberry.png",
        gozi: "static/images/gozi.png",
        "3hex": "static/images/3hex.png",
        atsnai: "static/images/atsnai.png",
        snaiper: "static/images/snaiper.png",

        // 情感/状态图标
        heart: "static/images/heart.png",
        heart2: "static/images/heart2.png",
        heart3: "static/images/heart3.png",
        heart4: "static/images/heart4.png",
        redheart: "static/images/redheart.png",
        star: "static/images/star.png",
        attention: "static/images/attention.png",
        decrease: "static/images/decrease.png",

        // 传输/网络
        torrent: "static/images/torrent.png",
        magnet: "static/images/magnet.png",
        load: "static/images/load.png",
        loading: "static/images/loading.gif",

        // 其他
        search: "static/images/search.png",
        home: "static/images/home.png",
        transparent: "static/images/transparent.png",
        acceptAll: "static/images/accept-all.png",
        finished: "static/images/finished.png",
        finishedbadge: "static/images/finishedbadge.png",
        syringingError_transparent: "static/images/syringingError_transparent.png",
        favicon: "static/images/favicon.ico",

        // 特殊用途
        handControl: "static/images/hand-control.png", // 备用键名
        handControl2: "static/images/hand-control2.png", // 备用键名
        "18432695": "static/images/18432695.png",

        // 占位符/特殊状态
        errorRocket: "static/images/errorRocket.jpg",
        errorRocketLookingUp: "static/images/errorRocketLookingUp.jpg",
        errorUknown: "static/images/errorUknown.jpg",
        syringingError: "static/images/syringingError.jpg",
        iconsManyError: "static/images/iconsManyError.jpg",
        ErrorNetworkNodes: "static/images/ErrorNetworkNodes.jpg",
        ErrorGlobe: "static/images/ErrorGlobe.jpg",
        errorLandScape: "static/images/errorLandScape.jpg",
    };

    window.fileExplorerWasOpened = false

    // Open file explorer
    window.openFileExplorer = function () {
        loadHomeDirectory();
        fileExplorer.style.display = 'flex';
        window.fileExplorerWasOpened = true
        const existingPlayer = document.querySelector('.mini-audio-player');
        if (existingPlayer) {
            existingPlayer.remove();
        }
    }


    document.getElementById("processor-monitor").addEventListener('click', () => {
        window.showStatuses({ showMonitor: true });
    })




    // Close file explorer
    closeExplorerBtn.addEventListener('click', function () {
        window.fileExplorerWasOpened = false
        // Check if audio is currently playing
        const audioElement = document.getElementById('preview-audio');
        const videoElement = document.getElementById('preview-video');

        let isMediaPlaying = false;
        let mediaElement = null;
        let mediaTrackName = 'Uri Gukina';
        let mediaType = 'audio';

        // Check audio first
        if (audioElement && !audioElement.paused) {
            isMediaPlaying = true;
            mediaElement = audioElement;
            mediaTrackName = window.currentPlaying ? window.currentPlaying.name : 'Audio Track';
            mediaType = 'audio';
        }
        // Check video if audio not playing
        else if (videoElement && !videoElement.paused) {
            isMediaPlaying = true;
            mediaElement = videoElement;
            mediaTrackName = window.currentPlaying ? window.currentPlaying.name : 'Video Track';
            mediaType = 'video';
        }

        if (window.currentPlaying) thumbnailImage = window.currentPlaying.name.replace(/\.[^/.]+$/, "") + ".png";


        fileExplorer.style.display = 'none';
        ClearNyx("");
        fetcher.style.display = 'none';
        urlInput.value = "";

        loadHistoryDownloads();
        // currentFileList = [];
        // currentFileIndex = -1;

        // If media is playing, show the mini player
        if (isMediaPlaying && mediaElement) {
            const sourceElement = mediaElement.querySelector('source');
            const mediaUrl = sourceElement ? sourceElement.src : mediaElement.src;

            window.miniPlayerInstance = MiniPlayer(
                mediaElement.id,
                mediaUrl,
                mediaTrackName,
                mediaType,
                thumbnailImage
            );
        }
    });

    toggleSearchInterface.addEventListener('click', (e) => {
        e.preventDefault();
        if (!window.shakaInstance) {
            window.shakaInstance = Shaka();
        } else {
            window.shakaInstance.toggle();
        }
    })

    window.hideNavigationIcons = function () {
        const previousIcon = document.getElementById('previous-media');
        const nextIcon = document.getElementById('next-media');

        if (previousIcon) {
            previousIcon.style.display = 'none';
        }

        if (nextIcon) {
            nextIcon.style.display = 'none';
        }

        console.log('Navigation icons hidden');
    }

    // Function to SHOW the next and previous icons
    window.showNavigationIcons = function () {
        const previousIcon = document.getElementById('previous-media');
        const nextIcon = document.getElementById('next-media');

        if (previousIcon) {
            previousIcon.style.display = 'block';
        }

        if (nextIcon) {
            nextIcon.style.display = 'block';
        }

        console.log('Navigation icons shown');
    }



    function longerThan10(izina) {
        if (izina.length > 10) return izina.slice(0, 10) + "..."
        return izina
    }

    // Display directory contents as neural network nodes
    window.displayNeuralNetwork = function (items, folderName) {
        currentItems = items;
        directoryTree.innerHTML = '';
        // Create navigation header
        const navHeader = document.createElement('div');
        navHeader.className = 'neural-nav-header';
        navHeader.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
                <div style="display:flex;align-items:center;gap:1rem;">
                    <h3 style="color:#b1ffff;margin:0;font-size:1.2rem;text-shadow:0 0 10px #b1ffff;">${longerThan10(folderName)}</h3>
                </div>
                
                <!-- Search Bar -->
                <div class="neural-search-container" style="display:flex;align-items:center;gap:0.5rem;">
                    <input type="text" 
                        id="neural-search-input"
                        autocomplete="off" 
                        spellcheck="false"
                        autocomplete="off" 
                        autocorrect="off" 
                        autocapitalize="off"
                        placeholder="Shaka ..." 
                        style="background: transparent;border:1px solid #b1fff;color:#b1ffff;padding:0.5rem 1rem;border-radius:2rem;font-family:'SF Pro', monospace;font-size:0.7rem;width:200px;outline:none;font-weight: bold;"
                        onkeyup="advancedSearch(this.value)">
                    <div style="color:#88ffff;font-size:0.9rem;min-width:60px;text-align:center; font-family: 'Outfit', monospace">
                    ${items.length > 0 ? 'Hari <span id="search-result-count">${items.length}</span>' : '<span id="search-result-count">${items.length}</span>'}
                    </div>
                </div>
            </div>
        `;
        directoryTree.style.border = 'none';
        directoryTree.appendChild(navHeader);

        // Create neural network container
        const neuralContainer = document.createElement('div');
        neuralContainer.className = 'neural-network-container';
        neuralContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.05) 0%, transparent 50%);
            overflow: auto;
            border-radius: 0.5rem;
            align-items: center;
            border: 0px solid transparent;
            justify-content: center;
        `;

        // Create central origin node - NOW CLICKABLE FOR NAVIGATION
        const originNode = createOriginNode(folderName, pathHistory.length > 1);
        neuralContainer.appendChild(originNode);

        // Separate directories and files
        const directories = items.filter(item => item.is_directory);
        const files = items.filter(item => !item.is_directory);
        const allItems = [...directories, ...files];

        // Create neural nodes in circular arrangement around origin
        const nodeRadius = 130;
        const angleStep = (2 * Math.PI) / Math.max(allItems.length, 1);

        allItems.forEach((item, index) => {
            const angle = index * angleStep;
            const x = 250 + nodeRadius * Math.cos(angle); // Center X + radius
            const y = 250 + nodeRadius * Math.sin(angle); // Center Y + radius

            const neuralNode = createNeuralNode(item, x, y, index);
            neuralContainer.appendChild(neuralNode);

            // Store node reference
            neuralNodes.set(item.path, neuralNode);

            // Create connection from origin to this node
            createNeuralConnection(neuralContainer, 250, 250, x, y, item.is_directory);
        });

        // Add floating particles for neural network effect
        addNeuralParticles(neuralContainer);

        directoryTree.appendChild(neuralContainer);

        // Add legend
        const legend = document.createElement('div');
        legend.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
            color: #88ffff;
            font-size: 0.8rem;
            font-family: 'Orbitron', monospace;
        `;
        legend.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:12px;height:12px;background:rgba(0,255,255,0.8);border-radius:50%;box-shadow:0 0 10px rgba(0,255,255,0.5);"></div>
                <span>Folders</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:12px;height:12px;background:rgba(0,200,255,0.8);border-radius:50%;box-shadow:0 0 10px rgba(0,200,255,0.5);"></div>
                <span>Files</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:12px;height:12px;background:rgba(255,255,255,0.8);border-radius:50%;box-shadow:0 0 10px rgba(255,255,255,0.5);"></div>
                <span>Active Node</span>
            </div>
        `;
        document.getElementById('search-result-count').textContent = items.length;

    }

    // Advanced search function with multiple criteria
    window.advancedSearch = function (searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim();
        const neuralNodes = document.querySelectorAll('.neural-node');
        let visibleCount = 0;

        neuralNodes.forEach(node => {
            const nodeName = node.querySelector('.node-name').textContent.toLowerCase();
            const nodeSize = node.querySelector('.node-size')?.textContent.toLowerCase() || '';
            const nodeType = node.getAttribute('data-node-type');
            const nodeIcon = node.querySelector('.node-icon').alt.toLowerCase();

            let matches = false;

            // Search in name
            if (nodeName.includes(searchLower)) matches = true;

            // Search in file size (if contains numbers from search)
            if (searchLower.match(/\d/) && nodeSize.includes(searchLower)) matches = true;

            // Search by type (folder, file, image, etc.)
            if ((searchLower.includes('folder') && nodeType === 'folder') ||
                (searchLower.includes('file') && nodeType === 'file') ||
                (searchLower.includes(nodeIcon) && nodeIcon.includes(searchLower))) {
                matches = true;
            }

            // Extension search (e.g., ".mp4")
            if (searchLower.startsWith('.') && nodeName.endsWith(searchLower)) {
                matches = true;
            }

            if (matches || !searchTerm) {
                node.style.display = 'flex';
                node.style.opacity = '1';
                visibleCount++;
            } else {
                node.style.display = 'none';
                node.style.opacity = '0.3';
            }
        });

        document.getElementById('search-result-count').textContent = visibleCount;
    };


    window.filterNeuralNodes = function (searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim();
        const neuralNodes = document.querySelectorAll('.neural-node');
        let visibleCount = 0;

        if (!searchTerm) {
            // Show all nodes if search is empty
            neuralNodes.forEach(node => {
                node.style.display = 'flex';
                node.style.opacity = '1';
            });
            visibleCount = neuralNodes.length;
        } else {
            // Filter nodes based on search
            neuralNodes.forEach(node => {
                const nodeName = node.querySelector('.node-name').textContent.toLowerCase();
                if (nodeName.includes(searchLower)) {
                    node.style.display = 'flex';
                    node.style.opacity = '1';
                    visibleCount++;

                    // Highlight matching text
                    highlightSearchText(node, searchLower);
                } else {
                    node.style.display = 'none';
                    node.style.opacity = '0.3';
                }
            });

            // Also highlight connections (optional)
            updateConnectionsVisibility(searchLower);
        }

        // Update search result count
        document.getElementById('search-result-count').textContent = visibleCount;

        // Show search status
        if (searchTerm) {
            showNotification(`Found ${visibleCount} items matching "${searchTerm}"`);
        }
    };

    // Helper function to highlight search text
    function highlightSearchText(node, searchTerm) {
        const nodeNameElement = node.querySelector('.node-name');
        const originalText = nodeNameElement.textContent;
        const lowerOriginal = originalText.toLowerCase();
        const matchIndex = lowerOriginal.indexOf(searchTerm);

        if (matchIndex !== -1) {
            const beforeMatch = originalText.substring(0, matchIndex);
            const matchedText = originalText.substring(matchIndex, matchIndex + searchTerm.length);
            const afterMatch = originalText.substring(matchIndex + searchTerm.length);

            nodeNameElement.innerHTML = `${beforeMatch}<span style="background:rgba(255,255,0,0.3);color:#ffff00;padding:0 2px;border-radius:2px;">${matchedText}</span>${afterMatch}`;
        }
    }

    // Update connections visibility based on search
    function updateConnectionsVisibility(searchTerm) {
        const connections = document.querySelectorAll('.neural-connection');
        const neuralNodes = document.querySelectorAll('.neural-node');

        connections.forEach((conn, index) => {
            const correspondingNode = neuralNodes[index];
            if (correspondingNode) {
                if (correspondingNode.style.display === 'none') {
                    conn.style.opacity = '0.2';
                } else {
                    conn.style.opacity = '1';
                }
            }
        });
    }


    // Create central origin node - NOW WITH NAVIGATION FUNCTIONALITY
    function createOriginNode(folderName, canGoBack) {
        const originNode = document.createElement('div');
        originNode.className = 'neural-origin';
        originNode.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(0, 60, 100, 0.2);
            top: 200px;
            left: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #b1ffff;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            text-align: center;
            cursor: ${canGoBack ? 'pointer' : 'default'};
            transition: all 0.4s ease;
            z-index: 100;
            padding: 1rem;
            border-radius: 50%;
            
            /* Apply corner border style */
            --aug-tl: 0.5rem;
            --aug-tr: 0.5rem;
            --aug-br: 0.5rem;
            --aug-bl: 0.5rem;
            --aug-border-all: 0.15rem;
            --aug-border-bg:
                radial-gradient(circle at top left, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem),
                radial-gradient(circle at top right, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem),
                radial-gradient(circle at bottom left, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem),
                radial-gradient(circle at bottom right, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem);
            
            box-shadow: 
                0 0 40px rgba(0, 255, 255, 0.6),
                inset 0 0 20px rgba(0, 255, 255, 0.3);
            animation: pulseOrigin 3s infinite alternate;
        `;

        // Different content based on whether we can navigate back
        if (canGoBack) {
            originNode.innerHTML = `
                <div>
                    <img src="static/images/nyxlogo.png" style="width: 100px; height: 100px;">
                </div>
            `;

            // Add hover effects only if it's clickable
            originNode.addEventListener('mouseenter', function () {
                if (canGoBack) {
                    this.style.background = 'rgba(120, 160, 255, 0.95)';
                    this.style.boxShadow = '0 0 60px rgba(120, 160, 255, 0.8)';
                    this.style.transform = 'scale(1.1)';

                    // Enhance border on hover
                    this.style.setProperty('--aug-border-all', '0.2rem');
                    this.style.setProperty('--aug-border-bg', `
                        radial-gradient(circle at top left, rgba(120, 160, 255, 1), rgba(120, 160, 255, 1) 0.8rem, transparent 0.8rem),
                        radial-gradient(circle at top right, rgba(120, 160, 255, 1), rgba(120, 160, 255, 1) 0.8rem, transparent 0.8rem),
                        radial-gradient(circle at bottom left, rgba(120, 160, 255, 1), rgba(120, 160, 255, 1) 0.8rem, transparent 0.8rem),
                        radial-gradient(circle at bottom right, rgba(120, 160, 255, 1), rgba(120, 160, 255, 1) 0.8rem, transparent 0.8rem)
                    `);
                }
            });

            originNode.addEventListener('mouseleave', function () {
                if (canGoBack) {
                    this.style.background = 'rgba(0, 60, 100, 0.9)';
                    this.style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.6)';
                    this.style.transform = 'scale(1)';

                    // Reset border to original
                    this.style.setProperty('--aug-border-all', '0.15rem');
                    this.style.setProperty('--aug-border-bg', `
                        radial-gradient(circle at top left, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem),
                        radial-gradient(circle at top right, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem),
                        radial-gradient(circle at bottom left, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem),
                        radial-gradient(circle at bottom right, #b1ffff, #b1ffff 0.8rem, transparent 0.8rem)
                    `);
                }
            });

            // Click handler for navigation back
            originNode.addEventListener('click', function () {
                if (canGoBack) {
                    playClickSound();

                    // Add click animation
                    this.style.background = 'rgba(255, 255, 255, 0.95)';
                    this.style.boxShadow = '0 0 80px rgba(255, 255, 255, 0.9)';
                    this.style.color = '#000';

                    setTimeout(() => {
                        navigateBack();
                    }, 300);
                }
            });
        } else {
            // Home directory - not clickable
            originNode.innerHTML = `
                <div>
                    <img src="static/images/nyxlogo.png" style="width: 100px; height: 100px;">
                </div>
            `;
        }

        // Add pulsating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulseOrigin {
                0% { 
                    box-shadow: 
                        0 0 40px rgba(0, 255, 255, 0.6),
                        inset 0 0 20px rgba(0, 255, 255, 0.3);
                    transform: scale(1);
                }
                100% { 
                    box-shadow: 
                        0 0 60px rgba(0, 255, 255, 0.8),
                        inset 0 0 30px rgba(0, 255, 255, 0.5);
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);

        return originNode;
    }

    // Create neural network node
    function createNeuralNode(item, x, y, index) {
        const isFolder = item.is_directory;
        const fileType = isFolder ? 'folder' : getFileTypeFromExtension(item.name);
        const icon = FILE_ICONS[fileType] || FILE_ICONS.unknown;
        const fileSize = isFolder ? '' : formatFileSize(item.size);

        const neuralNode = document.createElement('div');
        neuralNode.className = 'neural-node';
        neuralNode.setAttribute('data-node-type', isFolder ? 'folder' : 'file');
        neuralNode.setAttribute('data-node-path', item.path);
        neuralNode.setAttribute('data-node-index', index);

        neuralNode.style.cssText = `
            position: absolute;
            width: ${isFolder ? '70px' : '60px'};
            height: ${isFolder ? '70px' : '60px'};
            background: ${isFolder ? 'rgba(0, 80, 120, 0.9)' : 'rgba(0, 60, 100, 0.8)'};
            top: ${y - (isFolder ? 35 : 30)}px;
            left: ${x - (isFolder ? 35 : 30)}px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 50;
            padding: 0.5rem;
            
            /* Apply corner border style - smaller version */
            --aug-tl: 0.3rem;
            --aug-tr: 0.3rem;
            --aug-br: 0.3rem;
            --aug-bl: 0.3rem;
            --aug-border-all: 0.1rem;
            --aug-border-bg:
                radial-gradient(circle at top left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at top right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at bottom left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at bottom right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem);
            
            box-shadow: 0 0 15px ${isFolder ? 'rgba(0, 255, 255, 0.4)' : 'rgba(0, 200, 255, 0.3)'};
            text-align: center;
            opacity: 0;
            transform: scale(0.5);
        `;
        neuralNode.setAttribute('data-augmented-ui', 'tl-clip tr-clip br-clip bl-clip border');

        neuralNode.innerHTML = `
            <img src="${icon}" 
                 style="width:${isFolder ? '22px' : '20px'};height:${isFolder ? '22px' : '20px'};margin-bottom:0.2rem;filter: invert(1) brightness(2) hue-rotate(180deg);transition: all 0.3s ease;"
                 alt="${fileType}" class="node-icon">
            <div class="node-name" 
                 style="color:#b1ffff;font-size:0.5rem;font-weight:bold;max-width:50px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                ${item.name}
            </div>
            ${!isFolder ? `
                <div class="node-size" 
                     style="color:#88ffff;font-size:0.4rem;margin-top:0.1rem;">
                    ${fileSize}
                </div>
            ` : ''}
        `;

        // Animate node entrance with staggered delay
        setTimeout(() => {
            neuralNode.style.opacity = '1';
            neuralNode.style.transform = 'scale(1)';
        }, index * 100 + 500);

        // Hover effects - node activates and connection pulses
        neuralNode.addEventListener('mouseenter', function (e) {
            this.style.transform = 'scale(1.4)';
            this.style.background = 'rgba(0, 14, 45, 0.3)';
            this.style.boxShadow = '0 0 30px #b1ffff';
            this.style.zIndex = '60';
            // Enhance border on hover
            this.style.setProperty('--aug-border-all', '0.15rem');
            this.style.setProperty('--aug-border-bg', `
                radial-gradient(circle at top left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at top right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at bottom left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at bottom right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem)
            `);

            // Activate connection to this node
            activateConnection(this);
            showInfo(item.name, item.ibinu, item.path, fileType, fileSize, item.modified, e.clientX, e.clientY)
        });
        neuralNode.addEventListener('mouseover', (e) => {
            showInfo(item.name, item.ibinu, item.path, fileType, fileSize, item.modified, e.clientX, e.clientY)
        })

        neuralNode.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
                this.style.background = isFolder ? 'rgba(0, 80, 120, 0.9)' : 'rgba(0, 60, 100, 0.8)';
                this.style.boxShadow = `0 0 15px #b1ffff`;
                this.style.zIndex = '50';

                // Reset border to original
                this.style.setProperty('--aug-border-all', '0.1rem');
                this.style.setProperty('--aug-border-bg', `
                    radial-gradient(circle at top left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                    radial-gradient(circle at top right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                    radial-gradient(circle at bottom left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                    radial-gradient(circle at bottom right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem)
                `);

                // Deactivate connection
                deactivateConnection(this);
            }
        });

        // Click handler
        neuralNode.addEventListener('click', function () {
            // Set this node as active
            setActiveNode(this);

            if (isFolder) {
                // Navigate to folder after brief activation animation
                setTimeout(() => {
                    navigateToFolder(item);
                }, 600);
            } else {
                // Preview file
                previewRealFile(item);
            }
        });

        neuralNode.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                if (isFolder) {
                    // Navigate to folder after brief activation animation
                    setTimeout(() => {
                        navigateToFolder(item);
                    }, 600);
                } else {
                    // Preview file
                    previewRealFile(item);
                }
            } else {
                navigateBack();
            }
        }, { passive: false })

        return neuralNode;
    }

    // Create neural connection between nodes
    function createNeuralConnection(container, x1, y1, x2, y2, isFolder) {
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        connection.setAttribute('data-connection-type', isFolder ? 'folder' : 'file');

        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        connection.style.cssText = `
            position: absolute;
            width: ${length}px;
            height: 2px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                ${isFolder ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 200, 255, 0.2)'} 20%, 
                ${isFolder ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 200, 255, 0.4)'} 50%, 
                ${isFolder ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 200, 255, 0.2)'} 80%, 
                transparent 100%);
            top: ${y1}px;
            left: ${x1}px;
            transform-origin: 0 0;
            transform: rotate(${angle}deg);
            pointer-events: none;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        // Animate connection appearance
        setTimeout(() => {
            connection.style.opacity = '1';
        }, 800);

        container.appendChild(connection);
        return connection;
    }

    // Activate connection (pulse effect)
    function activateConnection(node) {
        const connections = document.querySelectorAll('.neural-connection');
        const nodeIndex = parseInt(node.getAttribute('data-node-index'));

        connections.forEach((conn, index) => {
            if (index === nodeIndex) {
                conn.style.background = `linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(120, 160, 255, 0.8) 20%, 
                    rgba(120, 160, 255, 1) 50%, 
                    rgba(120, 160, 255, 0.8) 80%, 
                    transparent 100%)`;
                conn.style.height = '5px';
                conn.style.boxShadow = '0 0 10px rgba(120, 160, 255, 0.6)';
            }
        });
    }

    // Deactivate connection
    function deactivateConnection(node) {
        const connections = document.querySelectorAll('.neural-connection');
        const nodeIndex = parseInt(node.getAttribute('data-node-index'));
        const isFolder = node.getAttribute('data-node-type') === 'folder';

        connections.forEach((conn, index) => {
            if (index === nodeIndex && !activeConnections.has(nodeIndex)) {
                conn.style.background = `linear-gradient(90deg, 
                    transparent 0%, 
                    ${isFolder ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 200, 255, 0.2)'} 20%, 
                    ${isFolder ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 200, 255, 0.4)'} 50%, 
                    ${isFolder ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 200, 255, 0.2)'} 80%, 
                    transparent 100%)`;
                conn.style.height = '2px';
                conn.style.boxShadow = 'none';
            }
        });
    }

    // Set active node
    function setActiveNode(node) {
        // Clear previous active node
        document.querySelectorAll('.neural-node.active').forEach(n => {
            n.classList.remove('active');
            const isFolder = n.getAttribute('data-node-type') === 'folder';
            n.style.background = isFolder ? 'rgba(0, 91, 136, 0.64)' : 'rgba(0, 60, 100, 0.8)';
            n.style.boxShadow = `0 0 15px #b1ffff`;

            // Reset border
            n.style.setProperty('--aug-border-all', '0.1rem');
            n.style.setProperty('--aug-border-bg', `
                radial-gradient(circle at top left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at top right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at bottom left, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem),
                radial-gradient(circle at bottom right, #b1ffff, #b1ffff 0.5rem, transparent 0.5rem)
            `);
        });

        // Set new active node
        node.classList.add('active');
        node.style.background = 'rgba(3, 150, 248, 0.1)';
        node.style.boxShadow = '0 0 40px #b1ffff';

        // Update border for active state
        node.style.setProperty('--aug-border-all', '0.2rem');
        node.style.setProperty('--aug-border-bg', `
            radial-gradient(circle at top left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1) 0.5rem, transparent 0.5rem),
            radial-gradient(circle at top right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1) 0.5rem, transparent 0.5rem),
            radial-gradient(circle at bottom left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1) 0.5rem, transparent 0.5rem),
            radial-gradient(circle at bottom right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1) 0.5rem, transparent 0.5rem)
        `);

        // Update node text color for better contrast
        const nodeName = node.querySelector('.node-name');
        const nodeSize = node.querySelector('.node-size');
        const nodeIcon = node.querySelector('.node-icon');

        if (nodeName) nodeName.style.color = '#b1ffff';
        if (nodeSize) nodeSize.style.color = '#b1ffff';
        if (nodeIcon) nodeIcon.style.filter = 'invert(0) brightness(1) hue-rotate(0deg)';

        // Keep connection active
        const nodeIndex = parseInt(node.getAttribute('data-node-index'));
        activeConnections.add(nodeIndex);
    }

    // Add floating particles for neural network effect
    function addNeuralParticles(container) {
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
                animation: floatParticle ${3 + Math.random() * 4}s infinite linear;
            `;

            // Random starting position
            particle.style.left = Math.random() * 500 + 'px';
            particle.style.top = Math.random() * 500 + 'px';

            container.appendChild(particle);
        }

        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    window.navigateToCurrentFolder = function () {
        if (pathHistory.length > 0) {
            const current = pathHistory[pathHistory.length - 1];
            const folderObj = {
                path: current.path,
                name: current.name,
                is_directory: true
            };
            navigateToFolder(folderObj);
            pathHistory.pop()
        }
    }

    // Usage: navigateToCurrentFolder();

    // Navigate to folder
    async function navigateToFolder(folder) {
        try {
            const response = await fetch(`${BASE_URL}/list_directory/?path=${encodeURIComponent(folder.path)}`);
            const data = await response.json();

            if (data.items) {
                currentPath = folder.path;
                pathHistory.push({ path: folder.path, name: folder.name });
                neuralNodes.clear();
                activeConnections.clear();
                displayNeuralNetwork(data.items, folder.name);
            } else {
                throw new Error(data.error || 'Failed to load folder');
            }
        } catch (error) {
            console.error('Error navigating to folder:', error);
            showError('Cannot load folder: ' + error.message, error.stack);
        }
    }

    // Navigate back in history
    window.navigateBack = async function () {
        if (pathHistory.length > 1) {
            pathHistory.pop();
            const previous = pathHistory[pathHistory.length - 1];

            try {
                const response = await fetch(`${BASE_URL}/list_directory/?path=${encodeURIComponent(previous.path)}`);
                const data = await response.json();

                if (data.items) {
                    currentPath = previous.path;
                    neuralNodes.clear();
                    activeConnections.clear();
                    displayNeuralNetwork(data.items, previous.name);
                }
            } catch (error) {
                console.error('Error going back:', error);
                showError('Cannot go back: ' + error.message, error.stack);
            }
        }
    };

    function hideAdvancedControlsOnStart() {
        // Hide advanced image controls
        const imageAdvancedControls = [
            'rotateImageBTN',
            'flipImageBTN',
            'resetImageBTN',
            'showFiltersBTN'
        ];

        // Hide advanced video controls  
        const videoAdvancedControls = [
            'rotateVideoBTN',
            'flipVideoBTN',
            'resetVideoBTN',
            'showFiltersBTN',
            'showPitcherBTN'
        ];

        // Hide advanced audio controls
        const audioAdvancedControls = [
            'showPitcherBTN'
        ];

        // Hide all advanced controls
        const allAdvancedControls = [
            ...imageAdvancedControls,
            ...videoAdvancedControls,
            ...audioAdvancedControls
        ];

        allAdvancedControls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }



    function toggleAdvancedImageControls() {
        const controls = [
            'rotateImageBTN',
            'flipImageBTN',
            'resetImageBTN',
            'showFiltersBTN'
        ];

        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Toggle visibility
                element.style.display = element.style.display === 'none' ? 'inline-block' : 'none';
            }
        });
    }

    function toggleAdvancedVideoControls() {
        const controls = [
            'rotateVideoBTN',
            'flipVideoBTN',
            'resetVideoBTN',
            'showFiltersBTN',
            'showPitcherBTN'
        ];

        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Toggle visibility
                element.style.display = element.style.display === 'none' ? 'inline-block' : 'none';
            }
        });
    }

    function toggleAdvancedAudioControls() {
        const controls = [
            'showPitcherBTN'
        ];

        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Toggle visibility
                element.style.display = element.style.display === 'none' ? 'inline-block' : 'none';
            }
        });
    }

    window.previewRealFile = async function (file) {

        document.querySelectorAll('.mini-audio-player').forEach(miniap => miniap.remove());


        try {
            previewDetails.innerHTML = '<div style="text-align:center;color:#88ffff;padding:2rem;font-weight: bold;font-size: 1.2rem">Tegereza Gatoya ...</div>';

            const response = await fetch(`${BASE_URL}/get_file_content/?path=${encodeURIComponent(file.path)}`);
            const data = await response.json();

            // Store current file information for navigation
            window.currentMediaPath = file.path;
            window.OriginalSourcePath = file.path;

            // Store this file in the list if not already there
            if (currentFileList.length === 0) {
                // Get files from the same directory
                await loadDirectoryFilesForNavigation(file.path);
            }

            // Find and set current index
            currentFileIndex = currentFileList.findIndex(f => f.path === file.path);

            // If file not found in list, add it
            if (currentFileIndex === -1) {
                currentFileList.push(file);
                currentFileIndex = currentFileList.length - 1;
            }

            if (data.type === 'image') {
                window.currentMediaPath = file.path;
                window.OriginalSourcePath = file.path;
                previewDetails.innerHTML = `
        <div style="position:relative;width:100%;height:100%;overflow:hidden;background:transparent;cursor:grab;" id="image-container">
            <!-- Previous icon (left side) -->
            <div id="previous-media" style="position:absolute;left:3%;top:50%;transform:translateY(-50%);z-index:10;cursor:pointer;opacity:0.8;transition:all 0.3s ease;" 
                 onclick="navigateMedia('previous')"
                 onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 15px rgba(0,255,255,0.9))'"
                 onmouseleave="this.style.opacity='0.8';this.style.filter='drop-shadow(0 0 12px rgba(0,255,255,0.9))'">
                <img src="static/images/previous.png" 
                    style="width:50px;height:50px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));">
            </div>
            
            <!-- Left side color filter icon -->
            <div id="color-filter" style="display:none;position:absolute;left:5%;top:50%;transform:translateY(-50%);z-index:10;">
                <img src="static/images/colors.png" 
                    style="width:60px;height:60px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));opacity:0.8;">
            </div>
            
            <!-- Image element -->
            <img id="zoomable-image"
                src="${data.content}" 
                alt="${data.name}" 
                style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);border:1px solid #b1ffff;border-radius: 20px;transition:transform 0.3s ease;max-width:90%;max-height:90%;object-fit:contain;" 
                data-augmented-ui="tr-round br-round bl-round tl-round border">
            
            <!-- Right side sharpen filter icon -->
            <div id="sharpen-filter" style="display:none;position:absolute;right:5%;top:50%;transform:translateY(-50%);z-index:10;">
                <img src="static/images/sharpen.png" 
                    style="width:60px;height:60px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));opacity:0.8;">
            </div>
            
            <!-- Next icon (right side) -->
            <div id="next-media" style="position:absolute;right:3%;top:50%;transform:translateY(-50%);z-index:10;cursor:pointer;opacity:0.8;transition:all 0.3s ease;"
                 onclick="navigateMedia('next')"
                 onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 15px rgba(0,255,255,0.9))'"
                 onmouseleave="this.style.opacity='0.8';this.style.filter='drop-shadow(0 0 12px rgba(0,255,255,0.9))'">
                <img src="static/images/next.png" 
                    style="width:50px;height:50px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));">
            </div>
            
            <div id="sci-fi-media-controls" class="sci-fi-media-controls" style="position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background: transparent;padding:10px 20px;border:1px solid rgba(0,255,255,0.6);box-shadow:0 0 20px rgba(0,255,255,0.3);border: none" data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
                <button id="zoomImageBTN" onclick="zoomImage(0.8)" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:rgba(0, 0, 255, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.zoomout}" width="" height="30"></button>
                <button id="zoomImageBTN" onclick="zoomImage(1.25)" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:rgba(0, 255, 0, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.zoomin}" width="" height="30"></button>
                <button id="rotateImageBTN" onclick="rotateImage(-15)" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:rgba(255, 0, 89, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.rotateLeft}" width="" height="30"></button>
                <button id="rotateImageBTN" onclick="rotateImage(15)" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:rgba(0, 255, 217, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.rotateRight}" width="" height="30"></button>
                <button id="flipImageBTN" onclick="flipImage()" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:rgba(0, 255, 217, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.flip}" width="" height="30"></button>
                <button id="resetImageBTN" onclick="resetImage()" style="background: transparent;border:1px solid rgba(255, 200, 0, 0.9);color:rgba(255, 243, 18, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.reset}" width="" height="30"></button>
                <button id="advancedOptionsImageBTN" style="background: transparent;border:1px solid rgba(255, 200, 0, 0.9);color:rgba(255, 243, 18, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="static/images/advanced.png" width="" height="30"></button>
                <button id="showFiltersBTN" onClick="showFilters()" id="filters-btn" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.filters}" width="40" height="40"></button>
                <div style="width:2px;height:25px;background: transparent;"></div>
                <div style="display:flex;align-items:center;gap:8px;padding:5px 12px;background: transparent;border:1px solid rgba(0,255,255,0.4);border:none">
                    <div id="twaramode" style="width:8px;height:8px;background:rgba(191, 178, 178, 1);box-shadow:0 0 8px #00ff88;"></div>
                    <span style="color:#b1ffff;font-size:0.75rem;font-family:Orbitron, monospace;font-weight:bold;"><img class="player-controls" src="${FILE_ICONS.drag}" width="20" height=""></span>
                </div>
            </div>
        </div>
    `;
                initializeImageZoom();
            }
            else if (data.type === 'text') {
                previewDetails.innerHTML = `<div class="directory-scroll-wrapper" style="position:absolute;
                    top:50%;left:50%;transform:translate(-50%,-50%) scale(1);
                    transition:transform 0.3s ease;max-width:99%;max-height:80%;
                    object-fit:contain;overflow:auto">
        <pre id="datacontent" style="font-size:.5rem; color: springgreen">
            ${data.content}
        </pre>
        </div>
        <div class="sci-fi-media-controls" style="position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background: transparent;padding:10px 20px;border:2px solid rgba(0,255,255,0.6);box-shadow:0 0 20px rgba(0,255,255,0.3);border: none" data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
                    <button onclick="copy2Clickboard()" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:#b1ffff;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.copy}" width="" height="30"></button>
                    <button onclick="editMode()" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none" id="play-pause-btn"><img class="player-controls" src="${FILE_ICONS.edit}" width="" height="30"></button>
                    <div style="width:2px;height:25px;background: transparent;"></div>
                    <div style="display:flex;align-items:center;gap:8px;padding:5px 12px;background: transparent;border-radius:6px;border:1px solid rgba(0,255,255,0.4); border: none">
                        <div style="width:10px;height:10px;background:#00ff00;border-radius:50%;box-shadow:0 0 10px #b1ffffff;"></div>
                        <span style="color:#b1ffff;font-size:0.75rem;font-family:Orbitron, monospace;font-weight:bold;" id=-status"><img class="player-controls" src="${FILE_ICONS.dotBig}" width="" height="30"></span>
                    </div>
         </div>
        `;
            } else if (data.type === 'video') {
                window.currentMediaPath = file.path;
                previewDetails.innerHTML = `
                <div style="position:relative;width:100%;height:100%;background:transparent;">
                    <!-- Previous icon (left side) -->
                    <div id="previous-media" style="position:absolute;left:3%;top:50%;transform:translateY(-50%);z-index:10;cursor:pointer;opacity:0.8;transition:all 0.3s ease;" 
                         onclick="navigateMedia('previous')"
                         onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 15px rgba(0,255,255,0.9))'"
                         onmouseleave="this.style.opacity='0.8';this.style.filter='drop-shadow(0 0 12px rgba(0,255,255,0.9))'">
                        <img src="static/images/previous.png" 
                            style="width:50px;height:50px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));">
                    </div>
                    
                    <!-- Left side color filter icon -->
                    <div id="color-filter" style="display:none;position:absolute;left:5%;top:50%;transform:translateY(-50%);z-index:10;">
                        <img src="static/images/colors.png" 
                            style="width:60px;height:60px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));opacity:0.8;">
                    </div>
                    
                    <!-- Video element -->
                    <video crossorigin="anonymous" class="preview-video" id="preview-video" onClick="togglePlayPause()" autoplay loop style="position:absolute;
                        top:50%;left:50%;transform:translate(-50%,-50%) scale(1);
                        border:1px solid #b1ffff;border-radius: 20px;
                        transition:transform 0.3s ease;max-width:90%;max-height:90%;
                        object-fit:contain;
                        --aug-tl: 1rem;
                        --aug-tr: 1rem;
                        --aug-br: 1rem;
                        --aug-bl: 1rem;
                        --aug-border-all: 0.2rem;
                        --aug-t-extend1: 50%;
                        --aug-b-extend1: 53%;
                        --aug-border-bg: 1px solid rgba(0, 255, 255, 1);" 
                        data-augmented-ui="tr-round br-round bl-round tl-round border">
                        <source crossorigin="anonymous" src="${BASE_URL}/preview_file/?path=${encodeURIComponent(data.file_path)}" type="video/mp4">
                    </video>
                    
                    <!-- Play/pause icon (centered on video) -->
                    <img onclick="togglePlayPause()" id="pause-playing-status" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:70px;height:70px;z-index:5;display:none;cursor:pointer;" class="player-controls" src="${FILE_ICONS.play}" width="100" height="100">
                    
                    <!-- Right side sharpen filter icon -->
                    <div id="sharpen-filter" style="display:none;position:absolute;right:5%;top:50%;transform:translateY(-50%);z-index:10;">
                        <img src="static/images/sharpen.png" 
                            style="width:60px;height:60px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));opacity:0.8;">
                    </div>
                    
                    <!-- Next icon (right side) -->
                    <div id="next-media" style="position:absolute;right:3%;top:50%;transform:translateY(-50%);z-index:10;cursor:pointer;opacity:0.8;transition:all 0.3s ease;"
                         onclick="navigateMedia('next')"
                         onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 15px rgba(0,255,255,0.9))'"
                         onmouseleave="this.style.opacity='0.8';this.style.filter='drop-shadow(0 0 12px rgba(0,255,255,0.9))'">
                        <img src="static/images/next.png" 
                            style="width:50px;height:50px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));">
                    </div>
                    
                    <div class="sci-fi-media-controls" style="position:absolute;bottom:15px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background: transparent;padding:10px 20px;border:2px solid rgba(0,255,255,0.6);box-shadow:0 0 20px rgba(0,255,255,0.3);border: none" data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
                        
                        <!-- Visualizer as background -->
                        <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:-1;pointer-events:none;">
                            <canvas id="videoVisualizer" width="300" height="40" style="background:transparent;border:none;"></canvas>
                        </div>

                        <!-- Buttons - exactly as before -->
                        <button id="rotateVideoBTN" onclick="rotateVideo(-15)" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:#b1ffff;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.rotateLeft}" width="" height="30"></button>
                        <button id="rotateVideoBTN" onclick="rotateVideo(15)" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:#b1ffff;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.rotateRight}" width="" height="30"></button>
                        <button id="toggleSpeedChangeBTN" onclick="toggleSpeedChange()" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none" id="toggle-fast-motion"><img class="player-controls" src="${FILE_ICONS.fast2}" width="" height="30"></button>
                        <button id="flipVideoBTN" onclick="flipVideo()" style="background: transparent;border:1px solid rgba(0,255,255,0.5);color:rgba(0, 255, 217, 1);padding:8px 16px;cursor:pointer;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease;border: none"><img class="player-controls" src="${FILE_ICONS.flip}" width="" height="30"></button>
                        <button id="resetVideoBTN" onClick="resetVideo()" id="volume-btn" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.reset}" width="" height="30" ></button>
                        <button id="advancedOptionsVideoBTN" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="static/images/advanced.png" width="" height="30" ></button>
                        <button id="showIncreasorBTN" onClick="showIncreasor('preview-video')" id="volume-btn" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.volume}" width="" height="30"></button>
                        <button id="showFiltersBTN" onClick="showFilters()" id="pitcher-btn" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.filters}" width="40" height="40"></button>
                        <button  id="showPitcherBTN" onClick="showPitcher('preview-video')" id="pitcher-btn" style="background: transparent;border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.pitch}" width="40" height="40"></button>
                    </div>
                </div>
            `;
                initializeVideoZoom();
                setTimeout(() => {
                    initializeVideoVisualizer();
                    window.currentPlaying = {
                        name: file.name,
                        type: "video",
                        status: "playing"
                    }
                    hideAdvancedControlsOnStart();
                    const advancedBtn = document.getElementById('advancedOptionsVideoBTN');
                    if (advancedBtn) {
                        advancedBtn.onclick = function () {
                            toggleAdvancedVideoControls();
                        };
                    }
                }, 100);
            } else if (data.type === 'audio') {
                previewDetails.innerHTML = `
            <div style="position:relative;width:100%;height:100%;background: transparent;backdrop-filter: blur(0.8rem);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;">
            <img style="height: 100px;width:100px;filter: drop-shadow(0 0 0.5rem rgba(0, 255, 255, 0.8)) brightness(0) invert(1);" src="static/images/nyxlogo.png" />
                
                <!-- Previous icon (left side) -->
                <div id="previous-media" style="position:absolute;left:3%;top:50%;transform:translateY(-50%);z-index:10;cursor:pointer;opacity:0.8;transition:all 0.3s ease;" 
                     onclick="navigateMedia('previous')"
                     onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 15px rgba(0,255,255,0.9))'"
                     onmouseleave="this.style.opacity='0.8';this.style.filter='drop-shadow(0 0 12px rgba(0,255,255,0.9))'">
                    <img src="static/images/previous.png" 
                        style="width:50px;height:50px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));">
                </div>
                
                <!-- Audio Visualizer -->
                <div class="visualizer-container" style="width:100%;max-width:600px;height:200px;display:flex;justify-content:center;align-items:center;">
                    <canvas id="audioVisualizer" width="1000" height="200" style="background:transparent;border:none;"></canvas>
                </div>
                
                <!-- Audio Info -->
                <div style="text-align:center;">
                    <div style="color:#b1ffff;font-size:1.2rem;font-family:Orbitron, monospace;margin-bottom:10px;font-weight:bold;">URI GUKINA</div>
                    <div style="color:#88ffff;font-size:0.9rem;font-family:Orbitron;font-weight:bold;">${file.name.length > 50 ? file.name.slice(0, 50) + "..." : file.name}</div>
                </div>
                
                <!-- Next icon (right side) -->
                <div id="next-media" style="position:absolute;right:3%;top:50%;transform:translateY(-50%);z-index:10;cursor:pointer;opacity:0.8;transition:all 0.3s ease;"
                     onclick="navigateMedia('next')"
                     onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 15px rgba(0,255,255,0.9))'"
                     onmouseleave="this.style.opacity='0.8';this.style.filter='drop-shadow(0 0 12px rgba(0,255,255,0.9))'">
                    <img src="static/images/next.png" 
                        style="width:50px;height:50px;filter:drop-shadow(0 0 12px rgba(0,255,255,0.9));">
                </div>
                
                <!-- Controls -->
                <div class="sci-fi-media-controls" style="display:flex;align-items:center;gap:15px;background: transparent;padding:12px 25px;border:2px solid rgba(0,255,255,0.6);box-shadow:0 0 20px rgba(0,255,255,0.3);border: none" data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
                    <button id="seekAudioBTN" onclick="seekAudio(-10)" style="background-color:transparent;backdrop-filter: blur(0.8rem);border:1px solid rgba(0,255,255,0.5);color:#b1ffff;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.rewind}" width="" height="30"></button>
                    <button id="seekAudioBTN" onclick="seekAudio(10)" style="background-color:transparent;backdrop-filter: blur(0.8rem);border:1px solid rgba(0,255,255,0.5);color:#b1ffff;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none"><img class="player-controls" src="${FILE_ICONS.forward}" width="" height="30"></button>
                    <button  id="showIncreasorBTN" onclick="showIncreasor('preview-audio')" style="background-color:transparent;backdrop-filter: blur(0.8rem);border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none" id="audio-play-vol-btn"><img class="player-controls" src="${FILE_ICONS.volume}" width="" height="30"></button>
                    <button id="advancedOptionsAudioBTN" style="background-color:transparent;backdrop-filter: blur(0.8rem);border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none" id="audio-play-vol-btn"><img class="player-controls" src="static/images/advanced.png" width="" height="30"></button>
                    <button id="showPitcherBTN" onclick="showPitcher('preview-audio')" style="background-color:transparent;backdrop-filter: blur(0.8rem);border:1px solid rgba(0,255,200,0.5);color:#88ffcc;padding:8px 16px;cursor:pointer;border-radius:8px;font-family:Orbitron, monospace;font-size:0.8rem;font-weight:bold;letter-spacing:1px;transition:all 0.3s ease; border: none" id="audio-play-pitcher-btn"><img class="player-controls" src="${FILE_ICONS.pitch}" width="40" height="40"></button>
                    <div style="width:2px;height:25px;background-color:transparent;backdrop-filter: blur(0.8rem);"></div>
                    <div style="display:flex;align-items:center;gap:8px;padding:5px 12px;background-color:transparent;backdrop-filter: blur(0.8rem);border-radius:6px;border:1px solid rgba(0,255,255,0.4); border: none">
                        <div id='audio-badge'  style="width:10px;height:10px;background:#00ff00;border-radius:50%;box-shadow:0 0 10px #fdfffdff;"></div>
                        <span id='audio-status' style="color:#b1ffff;font-size:0.75rem;font-family:Orbitron, monospace;font-weight:bold;" id="audio-status"><img class="player-controls" src="${FILE_ICONS.dotBig}" width="" height="30"></span>
                    </div>
                </div>
            </div>
            <audio crossorigin="anonymous" id="preview-audio" autoplay loop style="display:none;">
                <source src="${BASE_URL}/preview_file/?path=${encodeURIComponent(data.file_path)}" type="audio/mpeg">
            </audio>
        `;
                initializeAudioVisualizer();
                window.currentPlaying = {
                    name: file.name,
                    type: "audio",
                    status: "playing"
                }
                hideAdvancedControlsOnStart();
                const advancedBtn = document.getElementById('advancedOptionsAudioBTN');
                if (advancedBtn) {
                    advancedBtn.onclick = function () {
                        toggleAdvancedAudioControls();
                    };
                }
            } else {
                previewDetails.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;"><img src="${FILE_ICONS.unknown}" style="width:64px;height:64px;margin-bottom:1rem;" alt="📄"><div style="color:#88ffff;font-size:0.9rem;">Ntago Cyirebeka</div></div>`;
            }

        } catch (error) {
            console.error('Error loading file content:', error);
            previewDetails.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ff4444;">Error</div>`;
        }
    }


    // Save liked media in localStorage
    window.toggleLike = function () {
        const heart = document.getElementById('likecurrentplaying');
        if (!heart || !window.currentMediaPath) return;

        const liked = JSON.parse(localStorage.likedMedia || '[]');
        const index = liked.indexOf(window.currentMediaPath);

        if (index === -1) {
            liked.push(window.currentMediaPath);
            heart.style.filter = 'invert(27%) sepia(85%) saturate(2878%) hue-rotate(330deg)';
        } else {
            liked.splice(index, 1);
            heart.style.filter = 'brightness(0) invert(1)';
        }

        localStorage.likedMedia = JSON.stringify(liked);
    };

    // Update heart color
    window.updateHeart = function () {
        const heart = document.getElementById('likecurrentplaying');
        if (!heart || !window.currentMediaPath) return;

        const liked = JSON.parse(localStorage.likedMedia || '[]');
        heart.style.filter = liked.includes(window.currentMediaPath)
            ? 'invert(27%) sepia(85%) saturate(2878%) hue-rotate(330deg)'
            : 'brightness(0) invert(1)';
    };

    // Add click event when creating mini player (add this to MiniPlayer function)
    // After creating the heart icon in MiniPlayer HTML:
    document.getElementById('likecurrentplaying')?.addEventListener('click', window.toggleLike);

    // Call updateHeart when media changes
    window.updateHeart();

    async function loadDirectoryFilesForNavigation(filePath) {
        try {
            // Get directory path
            const pathParts = filePath.split('/');
            const fileName = pathParts.pop();
            const directoryPath = pathParts.join('/');

            // Get directory listing
            const response = await fetch(`${BASE_URL}/list_directory/?path=${encodeURIComponent(directoryPath)}`);
            const data = await response.json();

            if (data.items && Array.isArray(data.items)) {
                // Filter for media files only (image, video, audio)
                currentFileList = data.items.filter(item => {
                    if (item.is_directory) return false;

                    const fileType = getFileTypeFromExtension(item.name);
                    return ['image', 'video', 'audio'].includes(fileType);
                });

            }
        } catch (error) {
            console.error('Error loading directory for navigation:', error);
            currentFileList = [];
        }
    }

    // Simple navigation function - ONLY for icon clicks
    window.navigateMedia = function (direction) {
        // Check if we have files to navigate
        if (currentFileList.length === 0) {
            showNotification('Nta Cyokureba Gihari!');
            return;
        }

        // Check if we have a current file
        if (currentFileIndex === -1) {
            showNotification('Nta cyinu Wahisemo Kureba!');
            return;
        }

        let newIndex;

        // Calculate new index
        if (direction === 'next') {
            newIndex = (currentFileIndex + 1) % currentFileList.length;
        } else if (direction === 'previous') {
            newIndex = (currentFileIndex - 1 + currentFileList.length) % currentFileList.length;
        } else {
            return;
        }

        // Don't navigate if it's the same file
        if (newIndex === currentFileIndex) {
            return;
        }

        // Update index
        currentFileIndex = newIndex;

        // Get the next/previous file
        const targetFile = currentFileList[newIndex];

        // Show notification
        let showingName = null
        if (targetFile) {
            showingName = targetFile.name
        } else {
            showingName = direction
        }
        showNotification(`Gufungura ${showingName.length > 12 ? showingName.slice(0, 12) + "..." : showingName}`)
        // Preview the file
        previewRealFile(targetFile);
    }

    // Simple file type checker
    function getFileTypeFromExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
        const videoExt = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];
        const audioExt = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];

        if (imageExt.includes(ext)) return 'image';
        if (videoExt.includes(ext)) return 'video';
        if (audioExt.includes(ext)) return 'audio';
        return 'other';
    }


    function initializeAudioVisualizer() {
        const canvas = document.getElementById('audioVisualizer');
        const ctx = canvas.getContext('2d', { alpha: true });
        const audio = document.getElementById('preview-audio');
        const src = audio.querySelector("source").src;
        if (audio) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") {
                    seekAudio(-10)
                }

                if (e.key === "ArrowRight") {
                    seekAudio(10)
                }
            });
        }

        OriginalSourcePath = src;

        let audioCtx;
        let analyser;
        let source;
        let dataArray;
        let bufferLength;
        let isPlaying = false;

        // Set up audio context and analyser when audio starts playing
        audio.addEventListener('play', function () {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 2048;
                bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                source = audioCtx.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
            }
            isPlaying = true;
            drawVisualizer();
        });

        audio.addEventListener('pause', function () {
            isPlaying = false;
        });

        audio.addEventListener('ended', function () {
            isPlaying = false;
        });

        function drawVisualizer() {
            if (!isPlaying) return;

            requestAnimationFrame(drawVisualizer);

            if (analyser) {
                analyser.getByteFrequencyData(dataArray);

                // Clear canvas with completely transparent background
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Center-aligned bars with thin width
                const barWidth = 2;
                const centerX = canvas.width / 2;
                const totalBars = 150;

                // Calculate total width of all bars
                const totalWidth = totalBars * barWidth;

                // Start position to center the bars
                let x = centerX - totalWidth / 2;

                for (let i = 0; i < totalBars; i++) {
                    // Map the bar index to the frequency data
                    const dataIndex = Math.floor(i * (bufferLength / totalBars));
                    let barHeight = dataArray[dataIndex] / 255 * canvas.height * 0.9;

                    // Add some randomness for a more dynamic look
                    barHeight += Math.random() * 5;

                    // Iron Man color scheme - red to gold to blue
                    let color;
                    if (i < totalBars / 3) {
                        // Red section
                        color = `rgba(255, 0, 60, ${0.7 + Math.random() * 0.3})`;
                        //color = `springgreen`;
                    } else if (i < totalBars * 2 / 3) {
                        // Gold section
                        color = `rgba(255, 204, 0, ${0.7 + Math.random() * 0.3})`;
                    } else {
                        // Blue section
                        color = `rgba(0, 247, 255, ${0.7 + Math.random() * 0.3})`;
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    // Add glow effect
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 15;

                    x += barWidth;
                }

                // Reset shadow
                ctx.shadowBlur = 0;
            }
        }
    }

    function initializeVideoVisualizer() {
        const canvas = document.getElementById('videoVisualizer');
        if (!canvas) {
            console.error('Video visualizer canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d', { alpha: true });
        const video = document.getElementById('preview-video');

        if (!video) {
            console.error('Preview video element not found');
            return;
        }

        let audioCtx;
        let analyser;
        let source;
        let dataArray;
        let bufferLength;
        let isPlaying = false;

        // Set up audio context and analyser when video starts playing
        video.addEventListener('play', function () {
            if (!audioCtx) {
                try {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 2048; // Same as audio visualizer
                    bufferLength = analyser.frequencyBinCount;
                    dataArray = new Uint8Array(bufferLength);

                    source = audioCtx.createMediaElementSource(video);
                    source.connect(analyser);
                    analyser.connect(audioCtx.destination);
                } catch (error) {
                    console.error('Error setting up video audio context:', error);
                    return;
                }
            }
            isPlaying = true;
            drawVisualizer();
        });

        video.addEventListener('pause', function () {
            isPlaying = false;
        });

        video.addEventListener('ended', function () {
            isPlaying = false;
        });

        function drawVisualizer() {
            if (!isPlaying) return;

            requestAnimationFrame(drawVisualizer);

            if (analyser) {
                analyser.getByteFrequencyData(dataArray);

                // Clear canvas with completely transparent background
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Center-aligned bars with thin width
                const barWidth = 2; // Same as audio visualizer
                const centerX = canvas.width / 2;
                const totalBars = 150; // Same as audio visualizer

                // Calculate total width of all bars
                const totalWidth = totalBars * barWidth;

                // Start position to center the bars
                let x = centerX - totalWidth / 2;

                for (let i = 0; i < totalBars; i++) {
                    // Map the bar index to the frequency data
                    const dataIndex = Math.floor(i * (bufferLength / totalBars));
                    let barHeight = dataArray[dataIndex] / 255 * canvas.height * 0.9; // Same as audio visualizer

                    // Add some randomness for a more dynamic look
                    barHeight += Math.random() * 5; // Same as audio visualizer

                    // Iron Man color scheme - red to gold to blue (SAME as audio visualizer)
                    let color;
                    if (i < totalBars / 3) {
                        // Red section
                        color = `rgba(255, 0, 60, ${0.7 + Math.random() * 0.3})`;
                    } else if (i < totalBars * 2 / 3) {
                        // Gold section
                        color = `rgba(255, 204, 0, ${0.7 + Math.random() * 0.3})`;
                    } else {
                        // Blue section
                        color = `rgba(0, 247, 255, ${0.7 + Math.random() * 0.3})`;
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    // Add glow effect (SAME as audio visualizer)
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 15; // Same as audio visualizer

                    x += barWidth;
                }

                // Reset shadow
                ctx.shadowBlur = 0;
            }
        }
    }

    // Enhanced Image Zoom and Pan Functions
    function initializeImageZoom() {


        setTimeout(() => {
            hideAdvancedControlsOnStart();
            // Also attach click event to advanced button
            const advancedBtn = document.getElementById('advancedOptionsImageBTN');
            if (advancedBtn) {
                advancedBtn.onclick = function () {
                    toggleAdvancedImageControls();
                };
            }
        }, 50);

        const img = document.getElementById('zoomable-image');
        const vdo = document.getElementById("preview-video")
        img.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomImage(1.25)
            } else {
                zoomImage(0.8)

            }
        }, { passive: false })

        const container = document.getElementById('image-container');

        let scale = 1;
        let posX = 0;
        let posY = 0;
        let isDragging = false;
        let startX, startY;


        window.currentImageScale = scale;
        window.currentImagePosX = posX;
        window.currentImagePosY = posY;
        window.currentImageRotation = window.rotatingDegrees || 0;

        function updateImageTransform() {
            // Calculate boundaries to prevent dragging beyond image edges
            const containerRect = container.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();

            const maxX = Math.max(0, (imgRect.width * scale - containerRect.width) / 2);
            const maxY = Math.max(0, (imgRect.height * scale - containerRect.height) / 2);

            posX = Math.max(-maxX, Math.min(maxX, posX));
            posY = Math.max(-maxY, Math.min(maxY, posY));


            window.currentImageScale = scale;
            window.currentImagePosX = posX;
            window.currentImagePosY = posY;
            window.currentImageRotation = window.rotatingDegrees || 0;

            img.style.transform = `translate(-50%, -50%) translate(${posX}px, ${posY}px) scale(${scale}) rotate(${rotatingDegrees}deg)`;
            playClickSound()
            showNotification(`${Math.round(scale * 100)}° ZOOM`)
        }

        function updateImageTransformZoom(deg) {
            // Calculate boundaries to prevent dragging beyond image edges
            const containerRect = container.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();

            const maxX = Math.max(0, (imgRect.width * scale - containerRect.width) / 2);
            const maxY = Math.max(0, (imgRect.height * scale - containerRect.height) / 2);

            posX = Math.max(-maxX, Math.min(maxX, posX));
            posY = Math.max(-maxY, Math.min(maxY, posY));

            img.style.transform = `translate(-50%, -50%) translate(${posX}px, ${posY}px) scale(${scale}) rotate(${deg}deg) `;
            showNotification(`${deg}deg ROTATION`)
        }

        // Mouse events
        container.addEventListener('mousedown', (e) => {
            if (scale <= 1) return;
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            container.style.cursor = 'grabbing';
            document.getElementById("twaramode").style.backgroundColor = "rgba(191, 178, 178, 1)"
            document.getElementById("twaramode").style.borderRadius = "50%"
            showNotification("Twara Mode")
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging || scale <= 1) return;
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateImageTransform();
            document.getElementById("twaramode").style.backgroundColor = "rgba(0, 255, 0 ,1)"
            document.getElementById("twaramode").style.borderRadius = "50%"
        });

        container.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = scale > 1 ? 'grab' : 'default';
        });

        container.addEventListener('mouseleave', () => {
            isDragging = false;
            container.style.cursor = scale > 1 ? 'grab' : 'default';
        });

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            if (scale <= 1) return;
            isDragging = true;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging || scale <= 1) return;
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            updateImageTransform();
            e.preventDefault();
        });

        container.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Store functions globally
        window.zoomImage = function (factor) {
            const oldScale = scale;
            scale *= factor;
            scale = Math.max(0.1, Math.min(10, scale)); // Limit scale between 10% and 1000%

            // Adjust position to zoom towards center
            if (scale !== oldScale) {
                const containerRect = container.getBoundingClientRect();
                posX = posX * (scale / oldScale);
                posY = posY * (scale / oldScale);
            }

            updateImageTransform();
            container.style.cursor = scale > 1 ? 'grab' : 'default';
        };

        window.resetImage = function () {
            scale = 1;
            posX = 0;
            posY = 0;
            window.rotatingDegrees = 0
            window.rotatingDegrees = 358
            window.rotatingDegrees = 0


            window.rotatingDegrees = 0;
            window.isFlipped = false;  // Reset flip state too

            // Update global references
            window.currentImageScale = scale;
            window.currentImagePosX = posX;
            window.currentImagePosY = posY;
            window.currentImageRotation = 0;
            updateImageTransform();
            container.style.cursor = 'default';
        };
    }

    function initializeVideoZoom() {
        const video = document.getElementById("preview-video");
        const src = video.querySelector("source").src;

        OriginalSourcePath = src;

        if (video) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") {
                    seekVideo(-10)
                }

                if (e.key === "ArrowRight") {
                    seekVideo(10)
                }
            });
        }
        const container = video.parentElement;

        let vScale = 1;
        let vPosX = 0;
        let vPosY = 0;
        let vDragging = false;
        let vStartX, vStartY;
        window.videoRotation = 0;

        window.isVideoFlipped = false; // Add this    
        // Store global references for video
        window.currentVideoScale = vScale;
        window.currentVideoPosX = vPosX;
        window.currentVideoPosY = vPosY;
        window.currentVideoRotation = window.videoRotation;

        function updateVideoTransform() {
            const cRect = container.getBoundingClientRect();
            const vRect = video.getBoundingClientRect();

            const maxX = Math.max(0, (vRect.width * vScale - cRect.width) / 2);
            const maxY = Math.max(0, (vRect.height * vScale - cRect.height) / 2);

            vPosX = Math.max(-maxX, Math.min(maxX, vPosX));
            vPosY = Math.max(-maxY, Math.min(maxY, vPosY));
            const flipScaleX = window.isVideoFlipped ? -1 : 1;

            video.style.transform =
                `translate(-50%, -50%) ` +
                `translate(${vPosX}px, ${vPosY}px) ` +
                `scale(${flipScaleX * vScale}, ${vScale}) ` +
                `rotate(${window.videoRotation}deg)`;

            // Update global references
            window.currentVideoScale = vScale;
            window.currentVideoPosX = vPosX;
            window.currentVideoPosY = vPosY;
            window.currentVideoRotation = window.videoRotation;

            playClickSound()
            if (Math.round(vScale * 100) !== 100) showNotification(`${Math.round(vScale * 100)}° ZOOM`);

        }

        container.addEventListener("wheel", (e) => {
            e.preventDefault();

            const old = vScale;
            vScale *= e.deltaY < 0 ? 1.25 : 0.8;
            vScale = Math.max(0.1, Math.min(10, vScale));

            if (vScale !== old) {
                vPosX = vPosX * (vScale / old);
                vPosY = vPosY * (vScale / old);
            }

            updateVideoTransform();
        }, { passive: false });

        container.addEventListener("mousedown", (e) => {
            if (vScale <= 1) return;

            vDragging = true;
            vStartX = e.clientX - vPosX;
            vStartY = e.clientY - vPosY;

            container.style.cursor = "grabbing";
        });

        container.addEventListener("mousemove", (e) => {
            if (!vDragging || vScale <= 1) return;

            vPosX = e.clientX - vStartX;
            vPosY = e.clientY - vStartY;

            updateVideoTransform();
        });

        container.addEventListener("mouseup", () => {
            vDragging = false;
            container.style.cursor = vScale > 1 ? "grab" : "default";
        });

        container.addEventListener("mouseleave", () => {
            vDragging = false;
            container.style.cursor = vScale > 1 ? "grab" : "default";
        });

        // TOUCH
        container.addEventListener("touchstart", (e) => {
            if (vScale <= 1) return;

            vDragging = true;
            vStartX = e.touches[0].clientX - vPosX;
            vStartY = e.touches[0].clientY - vPosY;
        });

        container.addEventListener("touchmove", (e) => {
            if (!vDragging || vScale <= 1) return;

            vPosX = e.touches[0].clientX - vStartX;
            vPosY = e.touches[0].clientY - vStartY;

            updateVideoTransform();
            e.preventDefault();
        });

        container.addEventListener("touchend", () => {
            vDragging = false;
        });

        // GLOBAL FUNCTIONS
        window.zoomVideo = function (factor) {
            const old = vScale;
            vScale *= factor;
            vScale = Math.max(0.1, Math.min(10, vScale));

            if (vScale !== old) {
                vPosX = vPosX * (vScale / old);
                vPosY = vPosY * (vScale / old);
            }

            updateVideoTransform();
        };

        window.rotateVideo = function (degrees) {
            window.videoRotation += degrees;
            updateVideoTransform();
            showNotification(`${window.videoRotation}° ROTATION`);
        };

        window.resetVideo = function () {
            vScale = 1;
            vPosX = 0;
            vPosY = 0;
            window.videoRotation = 0;

            window.isVideoFlipped = false; // Reset flip state

            // Update global references
            window.currentVideoScale = vScale;
            window.currentVideoPosX = vPosX;
            window.currentVideoPosY = vPosY;
            window.currentVideoRotation = 0;

            updateVideoTransform();
            container.style.cursor = "default";
        };
    }





    window.rotatingDegrees = 0
    window.isFlipped = false;

    window.flipVideo = function () {
        const video = document.getElementById('preview-video');
        if (!video) return;

        // Toggle flip state
        window.isVideoFlipped = !window.isVideoFlipped;

        // Use current video values
        const scale = window.currentVideoScale || 1;
        const posX = window.currentVideoPosX || 0;
        const posY = window.currentVideoPosY || 0;
        const rotation = window.videoRotation || 0;

        // Apply flip horizontally
        const flipScaleX = window.isVideoFlipped ? -1 : 1;

        video.style.transform =
            `translate(-50%, -50%) ` +
            `translate(${posX}px, ${posY}px) ` +
            `scale(${flipScaleX * scale}, ${scale}) ` +
            `rotate(${rotation}deg)`;

        showNotification(window.isVideoFlipped ? "Hinduwe Ibumoso (Video)" : "Hinduwe Iburyo (Video)");
    };

    window.flipImage = function () {
        const img = document.getElementById('zoomable-image');
        const video = document.getElementById('preview-video');

        let element = img || video;
        let elementType = img ? 'image' : 'video';

        if (!element) return;

        // Toggle flip state for the specific element type
        if (elementType === 'image') {
            window.isFlipped = !window.isFlipped;
        } else {
            window.isVideoFlipped = !window.isVideoFlipped;
        }

        // Get current transform values
        const currentTransform = element.style.transform || 'translate(-50%, -50%) scale(1) rotate(0deg)';

        // Parse the current transform
        let posX = 0, posY = 0, scale = 1, rotation = 0;

        // For video, use video-specific variables
        if (elementType === 'video') {
            scale = window.currentVideoScale || 1;
            posX = window.currentVideoPosX || 0;
            posY = window.currentVideoPosY || 0;
            rotation = window.videoRotation || 0;
        } else {
            // For image, use image-specific variables
            scale = window.currentImageScale || 1;
            posX = window.currentImagePosX || 0;
            posY = window.currentImagePosY || 0;
            rotation = window.currentImageRotation || 0;
        }

        // Apply flip
        const flipScaleX = (elementType === 'image' ? window.isFlipped : window.isVideoFlipped) ? -1 : 1;

        element.style.transform =
            `translate(-50%, -50%) ` +
            `translate(${posX}px, ${posY}px) ` +
            `scale(${flipScaleX * scale}, ${scale}) ` +
            `rotate(${rotation}deg)`;

        showNotification((elementType === 'image' ? window.isFlipped : window.isVideoFlipped)
            ? "Hinduwe Ibumoso"
            : "Hinduwe Iburyo");
    };

    window.rotateImage = function (deg) {
        let scale = 1
        const img = document.getElementById('zoomable-image');
        const container = document.getElementById('image-container');

        if (deg < 0) {
            window.rotatingDegrees = window.rotatingDegrees - 36
        } else {
            window.rotatingDegrees = window.rotatingDegrees + 36
        }
        showNotification(`Rotating Image ${rotatingDegrees}° Degrees`)
        img.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotatingDegrees}deg)`;
    }
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            const audio = document.getElementById("preview-audio");
            const video = document.getElementById("preview-video");
            if (video) {
                togglePlayPause();
                showNavigationIcons();
            }
            if (audio) {
                toggleAudioPlayPause();
                showNavigationIcons();
            }
        }
    });




    window.toggleSpeedChange = function () {
        const video = document.getElementById('preview-video');
        if (!video) return;

        // Increase by 0.1 each click, max 4.0
        // video.playbackRate = Math.min(4, (parseFloat(video.playbackRate) + 0.1).toFixed(2));
        ApplySpeed('preview-video')
        showNotification(`Playback speed: ${video.playbackRate}x`);
    };






    window.showFilters = () => {
        const colorsFilter = document.getElementById("color-filter");
        const sharpenFilter = document.getElementById("sharpen-filter");
        hideNavigationIcons();

        // Check current display and toggle
        if (colorsFilter.style.display === 'none' || colorsFilter.style.display === '') {
            colorsFilter.style.display = 'block';
            sharpenFilter.style.display = 'block';
        } else {
            colorsFilter.style.display = 'none';
            sharpenFilter.style.display = 'none';
            return; // Exit early when hiding
        }

        // Add styles if not already added
        if (!document.getElementById('colorWheelStyle')) {
            const style = document.createElement('style');
            style.id = 'colorWheelStyle';
            style.textContent = `
            #colorWheel {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: conic-gradient(
                    #fff1e0,  /* very light / pale */
                    #fcd5b5,  /* light peach */
                    #f2b891,  /* fair tan */
                    #e09c76,  /* medium-light brown */
                    #c68656,  /* medium brown */
                    #8d5524,  /* dark brown */
                    #5a3415,  /* very dark brown */
                    #fff1e0  /* loop back */
                );
                cursor: pointer;
            }
        `;
            document.head.appendChild(style);
        }

        // Debounce timer
        let filterDebounceTimer = null;

        // Function to send filter request to backend

        async function sendFilterRequest() {
            clearTimeout(filterDebounceTimer);

            filterDebounceTimer = setTimeout(async () => {
                if (!window.selectedColor && !window.sharpenValue) return;

                try {
                    loadingIndicatorFilter.style.display = 'block'
                    // USE THE STORED MEDIA PATH
                    const inputPath = window.currentMediaPath;

                    console.log('=== SENDING FILTER REQUEST ===');
                    console.log('Input path:', inputPath);
                    console.log('Color filter:', window.selectedColor);
                    console.log('Sharpen value:', window.sharpenValue);

                    if (!inputPath) {
                        console.error('No media path available for filtering');
                        return;
                    }

                    showNotification("Applying Effects Wait A Moments")

                    // Send request to backend - THIS IS THE MAIN CHANGE
                    const response = await fetch(`${BASE_URL}/apply_filters/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCSRFToken(),
                        },
                        body: JSON.stringify({
                            input_path: inputPath,
                            color_filter: window.selectedColor || null,
                            sharpening: window.sharpenValue || null
                        })
                    });

                    // Check if response is a stream (video/audio) or regular JSON
                    const contentType = response.headers.get('content-type') || '';

                    if (contentType.includes('video/') || contentType.includes('audio/') || contentType.includes('image/')) {
                        // It's a stream - create blob URL
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);

                        // Get timestamp for cache busting
                        const timestamp = new Date().getTime();
                        const newMediaURL = `${blobUrl}#t=${timestamp}`;

                        // Update VIDEO if exists
                        const videoElement = document.querySelector('#preview-video');
                        if (videoElement) {
                            showNotification("Video Effect Preview - Streaming");
                            const sourceElement = videoElement.querySelector('source');
                            if (sourceElement) {
                                sourceElement.src = newMediaURL;
                                videoElement.load();
                                console.log('Video updated with stream:', newMediaURL);
                            }
                        }

                        // Update IMAGE if exists
                        const imageElement = document.querySelector('#zoomable-image');
                        if (imageElement) {
                            showNotification("Image Effect Preview - Streaming");
                            imageElement.src = newMediaURL;
                            console.log('Image updated with stream:', newMediaURL);
                        }

                        // Store the blob URL for cleanup later
                        window.currentBlobUrl = blobUrl;
                    } else {
                        // It's JSON response (backward compatibility)
                        const data = await response.json();

                        if (data.success) {
                            // Force refresh with timestamp to avoid caching
                            const timestamp = new Date().getTime();
                            const newMediaURL = `${BASE_URL}/preview_file/?path=${encodeURIComponent(data.output_path)}&t=${timestamp}`;

                            // Update VIDEO if exists
                            const videoElement = document.querySelector('#preview-video');
                            if (videoElement) {
                                const sourceElement = videoElement.querySelector('source');
                                if (sourceElement) {
                                    showNotification("Video Effect Preview");
                                    sourceElement.src = newMediaURL;
                                    videoElement.load();
                                    console.log('Video updated with new URL:', newMediaURL);
                                }
                            }

                            // Update IMAGE if exists
                            const imageElement = document.querySelector('#zoomable-image');
                            if (imageElement) {
                                showNotification("Image Effect Preview");
                                imageElement.src = newMediaURL;
                                console.log('Image updated with new URL:', newMediaURL);
                            }

                            // Update current media path to the new filtered file
                            // window.currentMediaPath = data.output_path;
                        } else {
                            console.error('❌ Filter application failed:', data.error);
                        }
                    }
                } catch (error) {
                    console.error('❌ Error applying filters:', error);
                } finally {
                    loadingIndicatorFilter.style.display = 'none'
                }
            }, 4000); // 2 second delay for debouncing
        }

        // Now add the click handlers for when they're visible
        const colorIcon = colorsFilter.querySelector('img');
        if (colorIcon && !colorIcon.hasAttribute('data-color-listener')) {
            colorIcon.setAttribute('data-color-listener', 'true');
            colorIcon.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent event from bubbling

                // Create and show color wheel
                const colorWheel = document.createElement("div");
                colorWheel.setAttribute("id", "colorWheel");
                colorWheel.style.cssText = `
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: conic-gradient(
                    #fff1e0,  /* very light / pale */
                    #fcd5b5,  /* light peach */
                    #f2b891,  /* fair tan */
                    #e09c76,  /* medium-light brown */
                    #c68656,  /* medium brown */
                    #8d5524,  /* dark brown */
                    #5a3415,  /* very dark brown */
                    #fff1e0  /* loop back */
                );
                cursor: pointer;
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            `;

                // Replace the icon with color wheel
                colorsFilter.innerHTML = '';
                colorsFilter.appendChild(colorWheel);

                // Initialize the color wheel
                colorWheel.addEventListener('click', function (e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    // Calculate angle
                    let angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
                    if (angle < 0) angle += 360;

                    // Convert angle to hue (0-360)
                    const hue = Math.round(angle);

                    // Calculate RGB from hue
                    const rgb = hsvToRgb(hue, 100, 100);
                    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

                    // Store it in a global variable
                    window.selectedColor = {
                        hex: hex,
                        rgb: rgb,
                        hue: hue
                    };

                    // Trigger backend request after 2 seconds
                    sendFilterRequest();
                });
            });
        }

        // Add click event to sharpen icon
        const sharpenIcon = sharpenFilter.querySelector('img');
        if (sharpenIcon && !sharpenIcon.hasAttribute('data-sharpen-listener')) {
            sharpenIcon.setAttribute('data-sharpen-listener', 'true');
            sharpenIcon.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent event from bubbling

                // Replace the icon with circle interface
                sharpenFilter.innerHTML = `
                <div id="sharpen-circle" style="position:relative;width:300px;height:300px;right: 1.5rem;">
                <div title="Igaragaza Imera Yibinu Cyane" style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);color:#ffff00;font-size:0.9rem;font-weight:bold;text-shadow:0 0 10px rgba(255,255,0,0.8);white-space:nowrap;">
                    CYESHA
                </div>
                    <div style="width:100%;height:100%;border:2px solid rgba(255,255,255,0.1);border-radius:50%;position:relative;">
                        <div id="progressRing" style="position:absolute;inset:-4px;border:8px solid #ff9f0a;border-radius:50%;clip-path:polygon(50% 50%, 50% 0%, 75% 0%);transform:rotate(75deg);transform-origin:center;transition:transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                        <div id="centerValue" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:72px;font-weight:800;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,0.3);transition:all 0.2s;">
                            <span id="valueDisplay">28</span>
                        </div>

                        <div id="loadingIndicatorFilter" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none;">
                            <div style="width:40px;height:40px;border:3px solid rgba(137, 112, 12, 0.3);border-top:3px solid #ffee00ff;border-radius:50%;animation:spin 1s linear infinite;"></div>
                        </div>
                    </div>
                    <div id="minusBtn" style="position:absolute;top:50%;left:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">−</div>
                    <div id="plusBtn" style="position:absolute;top:50%;right:-60px;transform:translateY(-50%);width:50px;height:50px;background:rgba(255,255,255,0.05);border-radius:25px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);font-size:36px;font-weight:300;cursor:pointer;transition:all 0.2s;user-select:none;border:1px solid rgba(255,255,255,0.1);">+</div>
                    <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);width:8px;height:8px;background:#ff9f0a;border-radius:50%;box-shadow:0 0 15px rgba(255,159,10,0.7);"></div>
                </div>
            `;

                // Initialize the circle interface
                let currentValue = 28;
                let isDragging = false;
                let startAngle = 0;
                let startValue = 0;

                const valueDisplay = document.getElementById('valueDisplay');
                const progressRing = document.getElementById('progressRing');
                const centerValue = document.getElementById('centerValue');
                const loadingIndicatorFilter = document.getElementById("loadingIndicatorFilter");
                const sharpenCircle = document.getElementById('sharpen-circle');
                const minusBtn = document.getElementById('minusBtn');
                const plusBtn = document.getElementById('plusBtn');

                if (sharpenCircle && valueDisplay) {
                    function updateDisplay(value) {
                        currentValue = Math.max(0, Math.min(100, Math.round(value)));

                        // Update text
                        valueDisplay.textContent = currentValue;

                        // Update progress ring (0-100% = 0-360 degrees)
                        const angle = (currentValue / 100) * 360;
                        progressRing.style.transform = `rotate(${angle}deg)`;

                        // Store sharpen value globally
                        window.sharpenValue = currentValue;

                        // Trigger backend request after 2 seconds
                        sendFilterRequest();

                        // Visual feedback - color intensity
                        const intensity = currentValue / 100;
                        const hue = 40; // Orange color
                        const saturation = Math.min(100, 50 + intensity * 50);
                        const brightness = 50 + intensity * 50;
                        progressRing.style.borderColor = `hsl(${hue}, ${saturation}%, ${brightness}%)`;

                        // Slight scale effect for high values
                        centerValue.style.transform = `translate(-50%, -50%) scale(${1 + intensity * 0.05})`;
                    }

                    function getAngleFromPoint(x, y) {
                        const rect = sharpenCircle.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;

                        const deltaX = x - centerX;
                        const deltaY = y - centerY;

                        // Calculate angle in radians
                        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

                        // Convert to 0-360 range
                        angle = (angle + 90) % 360;
                        if (angle < 0) angle += 360;

                        return angle;
                    }

                    // Mouse events for dial
                    sharpenCircle.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        startAngle = getAngleFromPoint(e.clientX, e.clientY);
                        startValue = currentValue;
                        sharpenCircle.style.cursor = 'grabbing';
                        e.preventDefault();
                    });

                    document.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;

                        const currentAngle = getAngleFromPoint(e.clientX, e.clientY);
                        const angleDiff = currentAngle - startAngle;

                        // Adjust sensitivity
                        const newValue = startValue + (angleDiff / 360) * 100;
                        updateDisplay(newValue);
                    });

                    document.addEventListener('mouseup', () => {
                        isDragging = false;
                        if (sharpenCircle) sharpenCircle.style.cursor = '';
                    });

                    // Button controls
                    if (minusBtn) {
                        minusBtn.addEventListener('click', () => {
                            updateDisplay(currentValue - 5);
                        });
                    }

                    if (plusBtn) {
                        plusBtn.addEventListener('click', () => {
                            updateDisplay(currentValue + 5);
                        });
                    }

                    // Double-click to reset
                    sharpenCircle.addEventListener('dblclick', () => {
                        updateDisplay(28);
                    });

                    // Initialize
                    updateDisplay(currentValue);
                }
            });
        }
    }

    // Helper functions
    function hsvToRgb(h, s, v) {
        h /= 60; s /= 100; v /= 100;
        const i = Math.floor(h);
        const f = h - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        let r, g, b;
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    // Helper function to extract file path from URL
    function extractFilePathFromURL(url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('path');
    }

    // Helper function to get CSRF token
    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }










    // Video Controls
    window.seekVideo = function (seconds) {
        const video = document.getElementById('preview-video');
        if (video) {
            video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
            if (seconds < 0) {
                showNotification(`${formatTime(video.currentTime)}`)
            } else {
                showNotification(`${formatTime(video.currentTime)}`)
            }
        }
    };

    window.editMode = function () {
        showNotification("Edit Mode On")
    }


    window.copy2Clickboard = function () {
        const content = document.getElementById("datacontent").textContent;

        if (content && content.length > 0) {
            // Copy full content to clipboard
            navigator.clipboard.writeText(content)
                .then(() => {
                    // Show notification with full content
                    showNotification("Copied");
                })
                .catch(err => {
                    console.error("Failed to copy: ", err);
                });
        }
    }


    window.togglePlayPause = function () {
        const video = document.getElementById('preview-video');
        const btn = document.getElementById('play-pause-btn');
        const ppbtn = document.getElementById("pause-playing-status")
        showNavigationIcons();


        if (video) {
            if (video.paused) {
                video.play();
                window.currentPlaying.status = "playing"
                ppbtn.src = FILE_ICONS.play
                ppbtn.style.cssText = ""
                ppbtn.style.cssText = `
            position: relative; left: 0%; top: 46%;width: 3rem; height: 3rem;
            `
                ppbtn.style.animation = "flyToEyes .7s ease-out forwards"
                setTimeout(() => {
                    ppbtn.style.display = "none"
                }, 2000)
            } else {
                video.pause();
                window.currentPlaying.status = "pause"
                ppbtn.src = FILE_ICONS.pause;
                ppbtn.style.cssText = ""
                ppbtn.style.cssText = `
            position: relative; left: 0%; top: 46%;width: 3rem; height: 3rem;
            `
                ppbtn.style.animation = "flyToEyes .7s ease-out forwards"
                setTimeout(() => {
                    ppbtn.style.display = "none"
                }, 2000)

            }
        }
    };

    // Audio Controls
    window.seekAudio = function (seconds) {
        const audio = document.getElementById('preview-audio');
        if (audio) {
            audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
            if (seconds < 0) {
                showNotification(`${formatTime(audio.currentTime)}`)
            }
            else {
                showNotification(`${formatTime(audio.currentTime)}`)
            }
        }
    };

    window.toggleAudioPlayPause = function () {
        const audio = document.getElementById('preview-audio');
        const status = document.getElementById('audio-status');
        const statusLight = document.getElementById("audio-badge")
        showNavigationIcons();


        if (audio) {
            if (audio.paused) {
                audio.play();
                window.currentPlaying.status = "playing"
                statusLight.style.background = ' #00ff00';
                statusLight.style.boxShadow = '0 0 10px #00ff00';
                status.style.borderRadius = "20px";

                miniPlayPauseBtn.querySelector('img').src = "static/images/pause.png";
                miniPlayer.classList.add('active');

            } else {
                audio.pause();
                window.currentPlaying.status = "pause"
                statusLight.style.background = '#ffffffff';
                statusLight.style.boxShadow = '0 0 10px #ffffffff';
                status.style.borderRadius = "20px";

                miniPlayPauseBtn.querySelector('img').src = "static/images/play.png";
                miniPlayer.classList.remove('active');
            }
        }
    };
    // Helper functions
    function getFileTypeFromExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', "ico",];
        const videoExt = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];
        const audioExt = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];
        const textExt = ['txt', 'py', 'js', 'html', 'css', 'json', 'md', 'yml', 'yaml', 'xml', 'csv'];
        const documentExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

        if (imageExt.includes(ext)) return 'image';
        if (videoExt.includes(ext)) return 'video';
        if (audioExt.includes(ext)) return 'audio';
        if (textExt.includes(ext)) return 'text';
        if (documentExt.includes(ext)) return 'document';
        return 'unknown';
    }

    function formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['B', 'KiB', 'MiB', 'GiB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + '' + sizes[i];
    }

    window.showError = function (message = null) {
        if (message.length > 100) return showNotification(message.split(0, 100), type = "details")
        if (message.length < 100) return showNotification(message)
    }


    // Add event listener for file explorer button
    const fileExplorerBtn = document.getElementById('file-explorer-btn-interface');
    if (fileExplorerBtn) fileExplorerBtn.addEventListener('click', openFileExplorer);
});



// File upload listeners
const fileUploadButton = document.getElementById('fileUploadButton');
const torrentFileInput = document.getElementById('torrentFileInput');

if (fileUploadButton && torrentFileInput) {
    fileUploadButton.addEventListener('click', () => {
        torrentFileInput.click();
    });

    torrentFileInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            await uploadTorrentFile(e.target.files[0]);
            torrentFileInput.value = '';
        }
    });
}

// NEW FUNCTION: uploadTorrentFile
async function uploadTorrentFile(file) {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.torrent')) {
        showNotification("Only .torrent files are supported");
        return;
    }

    // Show loading state
    const mediaGridDisplay = document.getElementById('media-grid-display');
    const singleThumbnailContainer = document.getElementById('single-media-thumbnail');

    mediaGridDisplay.style.display = 'block';
    singleThumbnailContainer.innerHTML = `
        <div style="position:absolute;top:70%;left:50%;transform:translate(-50%,-50%);">
            <div style="width:100px;height:100px;border:3px solid rgba(55, 49, 47, 0.3);border-top:3px solid #ffffffff;border-radius:50%;animation:spin 1s linear infinite;"></div>
        </div>
        <div style="color:#b1ffff;font-size:12px;word-break:break-all;">${file.name.length > 40 ? file.name.substring(0, 40) + '...' : file.name}</div>
    `;

    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);

        const resp = await fetch(`${BASE_URL}/format/`, {
            method: 'POST',
            body: formData
        });

        const data = await resp.json();

        if (data.error) {
            singleThumbnailContainer.innerHTML = `
                <div style="text-align:center;color:#ff6666;padding:2rem;font-family:'SF Pro', sans-serif;">
                    ${data.error}
                </div>
            `;
            return;
        }

        // Store data
        currentVideoUrl = null;
        allFormatsData = data.formats;

        // Store torrent data
        mediaThumbnail = data.thumbnail ||
            "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
        mediaTitle = data.title || file.name.replace('.torrent', '');

        // Show torrent thumbnail
        singleThumbnailContainer.innerHTML = '';

        // Create torrent thumbnail
        const torrentThumbnail = createTorrentThumbnail(data);
        singleThumbnailContainer.appendChild(torrentThumbnail);

        // Auto-open quality selector after fetching
        setTimeout(() => {
            showFormatSelection(allFormatsData);
        }, 500);

    } catch (e) {
        console.error('Torrent upload error:', e);
        singleThumbnailContainer.innerHTML = `
            <div style="width:300px;height:300px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);border-radius:12px;border:2px dashed rgba(255,0,0,0.3);">
                <div style="text-align:center;color:#f66;padding:1rem;font-family:'SF Pro', sans-serif;">
                    Upload failed: ${e.message}
                </div>
            </div>
        `;
    }
}

// NEW FUNCTION: createTorrentThumbnail
function createTorrentThumbnail(data) {
    const div = document.createElement('div');
    div.addEventListener("click", () => {
        document.getElementById('yt-fetcher').style.display = 'none';
    })
    div.style.cssText = `
        width: 70%;
        height: 300px;
        background: transparent;
        backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 2px solid transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
        color: white;
        font-family: 'SF Pro', sans-serif;
        cursor: pointer;
    `;

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const size = data.total_size ? formatFileSize(data.total_size) : 'Unknown size';
    const fileCount = data.file_count || 0;

    div.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">
            <img src="static/images/torrent.png" width="100">
        </div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #fff;">
            Izina: ${data.title || 'Torrent File'}
        </div>
        <div style="font-size: 14px; margin-bottom: 5px;">
            Size: ${size}
        </div>
        <div style="font-size: 12px; color: #aaa; margin-bottom: 15px;">
            File ${fileCount}
        </div>
        <div style="font-size: 12px; color: #4CAF50; background: rgba(76, 175, 80, 0.1); padding: 5px 10px; border-radius: 20px;">
            <strong>Komeza</strong>
        </div>
    `;

    return div;
}

// Add drag and drop for torrent files
document.addEventListener('DOMContentLoaded', () => {
    const fetcher = document.getElementById('yt-fetcher');

    if (fetcher) {
        fetcher.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fetcher.style.border = '2px dashed #4A90E2';
        });

        fetcher.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fetcher.style.border = 'none';
        });

        fetcher.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            fetcher.style.border = 'none';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.name.toLowerCase().endsWith('.torrent')) {
                    await uploadTorrentFile(file);
                } else {
                    showNotification("Only .torrent files can be dropped");
                }
            }
        });
    }
});
