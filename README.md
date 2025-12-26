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

## System Features
Gesture control: Webcam-based hand tracking (Icyiganza protocol)

System monitoring: Real-time battery, network, CPU, RAM, disk usage

Wikipedia integration: Quick information lookup

Download history: SQLite database with searchable history

Browser integration: Cookie extraction for authenticated downloads

Customizable interface: Theme support, layout adjustments

Keyboard shortcuts: Space (play/pause), arrows (seek), ESC (close)

# Quick Start
## Installation
Clone the repository:

bash
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
Configure download folder:

python
# In settings.py
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

Advanced Features
Gesture Control (Icyiganza)
Enable webcam and use hand gestures:

✋ Open palm: Play/pause media

👆 Point up: Volume up

👇 Point down: Volume down

👈 Swipe left: Previous track

👉 Swipe right: Next track

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