# Snai Download Manager


## Overview
## Snai Download Manager 
is a Django-based desktop application that serves as a universal download system with media processing, file management, and system control features. Built for power users who need complete control over digital content acquisition and manipulation.

# Features
## Download Capabilities
Multi-protocol downloads: YouTube, Twitter, Instagram, TikTok, Reddit, SoundCloud, Bandcamp, direct files

Intelligent URL detection: Automatic platform recognition and best format selection

Resume/pause support: Continue interrupted downloads

Playlist/album download: Complete playlist and channel downloading

Gallery-dl integration: Comprehensive image gallery support

Torrent/magnet link support: Built-in libtorrent engine

Smart fallback system: yt-dlp → gallery-dl → direct download → torrent

Batch downloading: Queue multiple files simultaneously

Media Processing
Real-time preview: Preview files before downloading

Video processing: Speed adjustment (0.25x - 4.0x), pitch control, quality selection

Visual filters: Skin tone adjustment, color grading, sharpening, noise reduction

Thumbnail generation: Automatic thumbnails for videos and images

Format conversion: MP4, MP3, WebM, AAC, FLAC

Metadata editing: Title, artist, album information

## File Management
Neural network explorer: Visual file browser with interconnected node display

File preview: Images (zoom, rotate, flip), videos (playback controls), audio (visualizer), text (editing)

Advanced search: Real-time filtering by name, size, type, extension

File operations: Rename, delete, copy, move, organize

Directory navigation: History tracking, breadcrumb navigation

Smart organization: Automatic sorting by type, date, size


## System Status Signs & Indicators

### Dashboard Status Icons
The application uses hexagonal status indicators with real-time updates:

#### **Network Status** (`#network-status`)
- **WiFi Connected**: WiFi icon with signal strength
- **Ethernet Connected**: Network cable icon
- **No Connection**: Disconnected icon with red overlay
- **Real-time Updates**: Shows bandwidth usage (upload/download)

#### **Battery Status** (`#battery-status`)
- **100% Charged**: Full battery icon (green)
- **90-99%**: Almost full (green)
- **50-89%**: Normal (blue)
- **20-49%**: Low (yellow)
- **1-19%**: Critical (red flashing)
- **Charging**: Lightning bolt overlay
- **Plugged In**: Power cord indicator

#### **Media Playing** (`#playing-status`)
- **Audio Playing**: Music note icon (pulsing)
- **Video Playing**: Play button icon (animated)
- **Paused**: Pause symbol (static)
- **No Media**: Stop symbol (gray)
- **Click Action**: Toggles play/pause for current media

#### **Download Status** (`#download-status`)
- **Active Downloads**: Down arrow with count badge
- **No Downloads**: Empty download tray icon
- **Download Type**: Icons change based on content:
  - 📹 Video downloads: Video camera icon
  - 🎵 Audio downloads: Music note icon
  - 📷 Image downloads: Photo icon
  - 📄 File downloads: Document icon
- **Pulsing Animation**: Active downloads pulse gently

### System Monitor Dashboard Signs
Real-time performance indicators appear when system monitoring is enabled:

#### **GPU Monitor** (Pink #ff0464)
- **Normal**: 0-60% usage (steady line)
- **High**: 60-85% usage (spiky line)
- **Critical**: 85-100% (red flashing)
- **Temperature**: °C indicator
- **Power Draw**: Watts consumption

#### **CPU Monitor** (Cyan #00ffff)
- **Normal**: 0-70% usage (smooth)
- **High**: 70-90% (sawtooth pattern)
- **Critical**: 90-100% (rapid spikes)
- **Temperature**: Core temp display
- **Power Usage**: Estimated watts

#### **Network Monitor** (Purple #9d4edd)
- **Idle**: 0-10% usage (flat line)
- **Active**: 10-50% (moderate waves)
- **Heavy**: 50-100% (large peaks)
- **Speed**: Mb/s display
- **Latency**: Ping time in ms
- **Usage**: Percentage indicator

#### **Disk Monitor** (Orange #ffaa00)
- **Empty**: 0-30% (low line)
- **Normal**: 30-70% (gradual waves)
- **Full**: 70-90% (high sustained)
- **Critical**: 90-100% (flashing red)
- **Read/Write Speed**: MB/s indicators
- **Health Status**: Percentage indicator

### Gesture Control Signs (Icyiganza Protocol)
Visual feedback for hand gesture recognition:

#### **Hand Detection**
- **No Hands**: Gray webcam icon
- **One Hand**: Blue outline
- **Two Hands**: Cyan outline
- **Hand Found**: Green glow around detected hand

#### **Gesture Recognition States**
- **✋ OPEN PALM**: Blue palm icon (play/pause)
- **👆 POINT UP**: Up arrow (volume up)
- **👇 POINT DOWN**: Down arrow (volume down)
- **👈 POINT LEFT**: Left arrow (previous track)
- **👉 POINT RIGHT**: Right arrow (next track)
- **🤏 PINCH**: Pinching fingers (zoom control)
- **✊ FIST**: Closed fist (zoom out)
- **✌️ PEACE**: Peace sign (reset all)

#### **Push/Pull Gesture Feedback**
- **PUSH**: Red arrow pointing outward (zoom out)
- **PULL**: Green arrow pointing inward (zoom in)
- **Intensity Bar**: Shows gesture strength (0-100%)

### Media Control Signs

#### **Audio Player**
- **Playing**: 🔊 with sound waves animation
- **Paused**: ⏸️ with faded appearance
- **Volume**: Sound bars show level (1-10)
- **Bluetooth**: 🎧 icon when connected
- **Speaker**: 📢 icon for local playback

#### **Video Player**
- **Playing**: ▶️ triangle (animated)
- **Paused**: ⏸️ bars (static)
- **Buffering**: 🔄 spinning circle
- **Fullscreen**: ⛶ square icon
- **Subtitles**: 📝 CC indicator

### Download Progress Signs

#### **Progress Bar Colors**
- **Queued**: Gray (0%)
- **Starting**: Yellow (0-10%)
- **Downloading**: Blue (10-90%)
- **Processing**: Purple (90-99%)
- **Complete**: Green (100%)
- **Error**: Red (flashing)
- **Paused**: Orange (static)

#### **Speed Indicators**
- **Slow**: 🐢 turtle icon (< 100KB/s)
- **Normal**: ⚡ bolt icon (100KB-1MB/s)
- **Fast**: 🚀 rocket icon (> 1MB/s)
- **Maximum**: 💨 wind icon (> 10MB/s)

#### **File Type Icons**
- **Video**: 📹 red icon
- **Audio**: 🎵 orange icon
- **Image**: 🖼️ green icon
- **Document**: 📄 blue icon
- **Archive**: 📦 purple icon
- **Other**: 📁 gray icon

### System Health Warning Signs

#### **Critical Alerts** (Red)
- ⚠️ Battery below 10%
- 🔥 CPU temperature > 85°C
- 💾 Disk space < 5%
- 📶 Network disconnected
- ❌ Download failed

#### **Warning Alerts** (Yellow)
- ⚠️ Battery below 20%
- 🔥 CPU temperature > 70°C
- 💾 Disk space < 10%
- 📶 High latency > 100ms
- ⏳ Download stuck > 5min

#### **Info Alerts** (Blue)
- ℹ️ New download added
- ℹ️ Download completed
- ℹ️ System update available
- ℹ️ Backup created

### Status Label Indicators
Hover expansion labels show detailed information:

#### **Network Label** (`#networks`)
- Shows connection type (WiFi/Ethernet/None)
- Displays current network name
- Shows IP address on hover

#### **OS Label** (`#osname`)
- OS logo (Windows/Linux/macOS)
- OS version number
- Architecture (x64/ARM)

#### **Online Status** (`#isonline`)
- **Online**: Green "Online" text
- **Offline**: Red "Offline" text
- Shows last seen time

#### **Battery Percentage** (`#percentage-battery`)
- Numeric percentage (0-100%)
- Time remaining estimate
- Health percentage

### Visual Feedback Patterns

#### **Animation States**
- **Pulse**: Gentle throb for active states
- **Flash**: Quick blink for alerts
- **Wave**: Smooth wave for processes
- **Spin**: Rotation for loading
- **Bounce**: Spring effect for new items

#### **Color Coding**
- **Success/Complete**: Green (#38b000)
- **Warning/Caution**: Yellow (#ffaa00)
- **Error/Failure**: Red (#ff0464)
- **Information**: Blue (#00ffff)
- **Processing**: Purple (#9d4edd)
- **Inactive**: Gray (#888888)

#### **Priority Levels**
- **High**: Red background, white text
- **Medium**: Yellow background, black text
- **Low**: Blue background, white text
- **Background**: Gray background, dark text

### Bluetooth Device Status
- **Connected**: Green icon with device name
- **Connecting**: Yellow pulsing icon
- **Disconnected**: Gray icon
- **Error**: Red icon with X
- **Device Types**:
  - 🎧 Earpiece/AirPods
  - 🎮 Game controller
  - ⌨️ Keyboard
  - 🖱️ Mouse
  - 🔊 Speaker

These signs provide immediate visual feedback about system status, download progress, and user interactions throughout the application.
The signs section now comprehensively covers all visual indicators from your system monitor dashboard, including:

Hexagonal status icons

System monitor graphs and indicators

Gesture control feedback

Media player controls

Download progress indicators

System health warnings

Visual feedback patterns

Bluetooth device status

All signs are color-coded and include specific CSS colors from your code (#ff0464, #00ffff, #9d4edd, #ffaa00, etc.).

regive me it full
I understand. You want the complete updated documentation with the signs section integrated. Here's the full updated documentation:

markdown
# Snai Download Manager

## Overview
**Snai Download Manager** is a Django-based desktop application that serves as a universal download system with media processing, file management, and system control features. Built for power users who need complete control over digital content acquisition and manipulation.

## Features
### Download Capabilities
- Multi-protocol downloads: YouTube, Twitter, Instagram, TikTok, Reddit, SoundCloud, Bandcamp, direct files
- Intelligent URL detection: Automatic platform recognition and best format selection
- Resume/pause support: Continue interrupted downloads
- Playlist/album download: Complete playlist and channel downloading
- Gallery-dl integration: Comprehensive image gallery support
- Torrent/magnet link support: Built-in libtorrent engine
- Smart fallback system: yt-dlp → gallery-dl → direct download → torrent
- Batch downloading: Queue multiple files simultaneously

### Media Processing
- Real-time preview: Preview files before downloading
- Video processing: Speed adjustment (0.25x - 4.0x), pitch control, quality selection
- Visual filters: Skin tone adjustment, color grading, sharpening, noise reduction
- Thumbnail generation: Automatic thumbnails for videos and images
- Format conversion: MP4, MP3, WebM, AAC, FLAC
- Metadata editing: Title, artist, album information

### File Management
- Neural network explorer: Visual file browser with interconnected node display
- File preview: Images (zoom, rotate, flip), videos (playback controls), audio (visualizer), text (editing)
- Advanced search: Real-time filtering by name, size, type, extension
- File operations: Rename, delete, copy, move, organize
- Directory navigation: History tracking, breadcrumb navigation
- Smart organization: Automatic sorting by type, date, size

### System Features
- Gesture control: Webcam-based hand tracking (Icyiganza protocol)
- System monitoring: Real-time battery, network, CPU, RAM, disk usage
- Wikipedia integration: Quick information lookup
- Download history: SQLite database with searchable history
- Browser integration: Cookie extraction for authenticated downloads
- Customizable interface: Theme support, layout adjustments
- Keyboard shortcuts: Space (play/pause), arrows (seek), ESC (close)

## Quick Start
### Installation
Clone the repository:
```bash
git clone https://github.com/sherlockcc50/SDM.git
cd SDM
cd backend
Install Python dependencies:

bash
pip install -r requirements.txt
Install system dependencies:

bash
# On Ubuntu/Debian
sudo apt-get install ffmpeg python3-tk

# On macOS
brew install ffmpeg

# On Windows
# Download ffmpeg from ffmpeg.org and add to PATH
Install media processing tools:

bash
# Install yt-dlp (latest version)
pip install --upgrade yt-dlp

# Install gallery-dl
pip install --upgrade gallery-dl

# Install libtorrent for torrents
pip install python-libtorrent
Initialize the database:

bash
python manage.py migrate
python manage.py createsuperuser
Configuration
Edit settings (optional):

bash
# Copy example settings
cp settings.example.py settings.py

# Edit download locations, timeouts, etc.
nano settings.py
Configure download folder (in settings.py):

python
DOWNLOAD_FOLDER = "/path/to/your/downloads"
Set up environment variables (optional):

bash
# For authenticated downloads
export YOUTUBE_COOKIES="path/to/cookies.txt"
export TWITTER_TOKEN="your_token_here"
Running the Application
Method 1: Standard Django server:

bash
python manage.py runserver
# Open http://localhost:8000
Method 2: Desktop mode (recommended):

bash
# With Electron wrapper
npm install  # if electron.js exists
npm start

# Or with custom launcher
python launcher.py
Method 3: Development mode:

bash
python manage.py runserver 0.0.0.0:8000 --insecure
First Use Guide
Start the application using one of the methods above

Paste a URL in the search interface (YouTube, Twitter, etc.)

Select format/quality from the dropdown menu

Choose download location or use default

Monitor progress in the download manager

Access downloaded files via the neural network file explorer

System Status Signs & Indicators
Dashboard Status Icons
The application uses hexagonal status indicators with real-time updates:

Network Status (#network-status)
WiFi Connected: WiFi icon with signal strength

Ethernet Connected: Network cable icon

No Connection: Disconnected icon with red overlay

Real-time Updates: Shows bandwidth usage (upload/download)

Battery Status (#battery-status)
100% Charged: Full battery icon (green)

90-99%: Almost full (green)

50-89%: Normal (blue)

20-49%: Low (yellow)

1-19%: Critical (red flashing)

Charging: Lightning bolt overlay

Plugged In: Power cord indicator

Media Playing (#playing-status)
Audio Playing: Music note icon (pulsing)

Video Playing: Play button icon (animated)

Paused: Pause symbol (static)

No Media: Stop symbol (gray)

Click Action: Toggles play/pause for current media

Download Status (#download-status)
Active Downloads: Down arrow with count badge

No Downloads: Empty download tray icon

Download Type: Icons change based on content:

📹 Video downloads: Video camera icon

🎵 Audio downloads: Music note icon

📷 Image downloads: Photo icon

📄 File downloads: Document icon

Pulsing Animation: Active downloads pulse gently

System Monitor Dashboard Signs
Real-time performance indicators appear when system monitoring is enabled:

GPU Monitor (Pink #ff0464)
Normal: 0-60% usage (steady line)

High: 60-85% usage (spiky line)

Critical: 85-100% (red flashing)

Temperature: °C indicator

Power Draw: Watts consumption

CPU Monitor (Cyan #00ffff)
Normal: 0-70% usage (smooth)

High: 70-90% (sawtooth pattern)

Critical: 90-100% (rapid spikes)

Temperature: Core temp display

Power Usage: Estimated watts

Network Monitor (Purple #9d4edd)
Idle: 0-10% usage (flat line)

Active: 10-50% (moderate waves)

Heavy: 50-100% (large peaks)

Speed: Mb/s display

Latency: Ping time in ms

Usage: Percentage indicator

Disk Monitor (Orange #ffaa00)
Empty: 0-30% (low line)

Normal: 30-70% (gradual waves)

Full: 70-90% (high sustained)

Critical: 90-100% (flashing red)

Read/Write Speed: MB/s indicators

Health Status: Percentage indicator

Gesture Control Signs (Icyiganza Protocol)
Visual feedback for hand gesture recognition:

Hand Detection
No Hands: Gray webcam icon

One Hand: Blue outline

Two Hands: Cyan outline

Hand Found: Green glow around detected hand

Gesture Recognition States
✋ OPEN PALM: Blue palm icon (play/pause)

👆 POINT UP: Up arrow (volume up)

👇 POINT DOWN: Down arrow (volume down)

👈 POINT LEFT: Left arrow (previous track)

👉 POINT RIGHT: Right arrow (next track)

🤏 PINCH: Pinching fingers (zoom control)

✊ FIST: Closed fist (zoom out)

✌️ PEACE: Peace sign (reset all)

Push/Pull Gesture Feedback
PUSH: Red arrow pointing outward (zoom out)

PULL: Green arrow pointing inward (zoom in)

Intensity Bar: Shows gesture strength (0-100%)

Media Control Signs
Audio Player
Playing: 🔊 with sound waves animation

Paused: ⏸️ with faded appearance

Volume: Sound bars show level (1-10)

Bluetooth: 🎧 icon when connected

Speaker: 📢 icon for local playback

Video Player
Playing: ▶️ triangle (animated)

Paused: ⏸️ bars (static)

Buffering: 🔄 spinning circle

Fullscreen: ⛶ square icon

Subtitles: 📝 CC indicator

Download Progress Signs
Progress Bar Colors
Queued: Gray (0%)

Starting: Yellow (0-10%)

Downloading: Blue (10-90%)

Processing: Purple (90-99%)

Complete: Green (100%)

Error: Red (flashing)

Paused: Orange (static)

Speed Indicators
Slow: 🐢 turtle icon (< 100KB/s)

Normal: ⚡ bolt icon (100KB-1MB/s)

Fast: 🚀 rocket icon (> 1MB/s)

Maximum: 💨 wind icon (> 10MB/s)

File Type Icons
Video: 📹 red icon

Audio: 🎵 orange icon

Image: 🖼️ green icon

Document: 📄 blue icon

Archive: 📦 purple icon

Other: 📁 gray icon

System Health Warning Signs
Critical Alerts (Red)
⚠️ Battery below 10%

🔥 CPU temperature > 85°C

💾 Disk space < 5%

📶 Network disconnected

❌ Download failed

Warning Alerts (Yellow)
⚠️ Battery below 20%

🔥 CPU temperature > 70°C

💾 Disk space < 10%

📶 High latency > 100ms

⏳ Download stuck > 5min

Info Alerts (Blue)
ℹ️ New download added

ℹ️ Download completed

ℹ️ System update available

ℹ️ Backup created

Status Label Indicators
Hover expansion labels show detailed information:

Network Label (#networks)
Shows connection type (WiFi/Ethernet/None)

Displays current network name

Shows IP address on hover

OS Label (#osname)
OS logo (Windows/Linux/macOS)

OS version number

Architecture (x64/ARM)

Online Status (#isonline)
Online: Green "Online" text

Offline: Red "Offline" text

Shows last seen time

Battery Percentage (#percentage-battery)
Numeric percentage (0-100%)

Time remaining estimate

Health percentage

Visual Feedback Patterns
Animation States
Pulse: Gentle throb for active states

Flash: Quick blink for alerts

Wave: Smooth wave for processes

Spin: Rotation for loading

Bounce: Spring effect for new items

Color Coding
Success/Complete: Green (#38b000)

Warning/Caution: Yellow (#ffaa00)

Error/Failure: Red (#ff0464)

Information: Blue (#00ffff)

Processing: Purple (#9d4edd)

Inactive: Gray (#888888)

Priority Levels
High: Red background, white text

Medium: Yellow background, black text

Low: Blue background, white text

Background: Gray background, dark text

Bluetooth Device Status
Connected: Green icon with device name

Connecting: Yellow pulsing icon

Disconnected: Gray icon

Error: Red icon with X

Device Types:

🎧 Earpiece/AirPods

🎮 Game controller

⌨️ Keyboard

🖱️ Mouse

🔊 Speaker

Advanced Features
Gesture Control (Icyiganza)
Enable webcam and use hand gestures:

✋ Open palm: Play/pause media

👆 Point up: Volume up

👇 Point down: Volume down

👈 Swipe left: Previous track

👉 Swipe right: Next track

🤏 Pinch + rotate: Rotate media

✊ Fist: Zoom out

✌️ Peace: Reset all

Keyboard Shortcuts
Space: Play/pause media

Left Arrow: Seek backward 10s

Right Arrow: Seek forward 10s

Up Arrow: Volume up

Down Arrow: Volume down

Esc: Close current modal/player

Ctrl+F: Search files

Ctrl+Q: Quit application

System Monitoring
View real-time system stats:

Battery level and charging status

Network speed and connectivity

CPU and memory usage

Disk space and download speed

Active downloads count

Troubleshooting
Common Issues
"yt-dlp not found":

bash
pip install --upgrade yt-dlp
"FFmpeg not available":

bash
# Install FFmpeg for your system
sudo apt install ffmpeg  # Ubuntu/Debian
brew install ffmpeg      # macOS
# Windows: Download from ffmpeg.org
"Download speed too slow":

Check internet connection

Adjust timeout in settings

Try different download protocol

Use resume feature for interruptions

"File preview not working":

Ensure file permissions are correct

Check if file format is supported

Verify media codecs are installed

Debug Mode
Enable verbose logging:

bash
python manage.py runserver --verbosity 2
Check logs in logs/ directory for detailed error information.

Contributing
Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

Development Setup
bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python manage.py test

# Check code style
flake8 .
License
MIT License - see LICENSE file for details

Support
GitHub Issues: Report bugs

Documentation: Check docs/ folder

Email: sherlockcc50@gmail.com