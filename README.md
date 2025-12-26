# Snai Download Manager

## Overview
Snai Download Manager is a Django-based desktop application that serves as a universal download system with media processing, file management, and system control features. Built for power users who need complete control over digital content acquisition and manipulation.

## Features

### Download Capabilities
- Multi-protocol downloads (YouTube, social media, torrents, direct files)
- Intelligent URL detection and format selection
- Resume/pause support for downloads
- Playlist download support
- Gallery-dl integration for image galleries
- Torrent/magnet link support with libtorrent
- Smart fallback system: yt-dlp → gallery-dl → direct download

### Media Processing
- Video speed and pitch adjustment
- Visual filters (skin tone replacement, sharpening)
- Thumbnail generation
- Automatic cleanup of processed files
- Real-time preview system

### File Management
- Built-in file explorer
- File preview (images, videos, audio, documents, code files)
- File operations (rename, delete, open)
- Directory navigation
- Automatic thumbnail organization

### System Features
- Gesture control via webcam (Icyiganza protocol)
- System monitoring (battery, network, CPU, disk usage)
- Wikipedia information lookup
- Download history tracking with database
- Browser cookie extraction for authenticated downloads

## Quick Start

### Installation
1. Clone the repository
2. Install requirements:
```bash
pip install -r requirements.txt
