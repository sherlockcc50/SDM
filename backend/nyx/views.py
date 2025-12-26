from django.http import JsonResponse, StreamingHttpResponse, FileResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone
import numpy, shutil, cv2
from pathlib import Path
import browser_cookie3
import io
from PIL import Image
import ffmpeg
from mutagen import File
from mutagen.id3 import ID3
from urllib.parse import urlparse, parse_qs
from pathlib import Path
from collections import defaultdict
import json
import glob
import time
import uuid
import tempfile
import threading
import subprocess
import sys
import os
import re
import mimetypes
import yt_dlp
import wikipedia
import ffmpeg
import psutil
import socket
import platform
import asyncio
import websockets
from .models import DownloadHistory
import aiohttp
import asyncio
import os
import json
from pathlib import Path
import datetime


# Add these imports to your existing imports section
import libtorrent as lt
import bencode
import hashlib
import urllib.parse
from collections import defaultdict
from typing import Dict, List, Optional, Any
import threading


# Add these after your existing global variables
torrent_sessions = {}  # download_id -> torrent session
torrent_torrents = {}  # download_id -> torrent handle
torrent_progress = {}  # download_id -> torrent status
torrent_lock = threading.Lock()
uploaded_torrents = {}
uploaded_torrents_lock = threading.Lock()

# Add this near your other global variables
main_event_loop = None

def set_main_event_loop():
    """Set the main event loop globally"""
    global main_event_loop
    try:
        main_event_loop = asyncio.get_event_loop()
        print(f"✅ Main event loop stored: {main_event_loop}")
    except RuntimeError:
        main_event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(main_event_loop)
        print(f"✅ Created new event loop: {main_event_loop}")

def send_ws_update_threadsafe(coroutine):
    """Schedule a coroutine from a background thread on the main asyncio loop."""
    global main_event_loop
    if main_event_loop is None:
        print("❌ No main event loop available for WebSocket update")
        return
    
    try:
        asyncio.run_coroutine_threadsafe(coroutine, main_event_loop)
    except Exception as e:
        print(f"❌ Error scheduling coroutine: {e}")


BROWSERS = ["firefox","chrome","brave","edge",]

download_progress = defaultdict(dict)
from sss import system_status_websocket    


# Async Downloader Configuration
CHUNK_SIZE = 1024 * 1024 # 1 MB per chunk
NUM_WORKERS = 4
PROGRESS_FILE = "download.progress"
def save_download_progress(download_id, progress_data, progress_file=PROGRESS_FILE):
    """Save download progress for resuming"""
    try:
        progress_dir = os.path.join(download_folder, ".progress")
        os.makedirs(progress_dir, exist_ok=True)
       
        progress_path = os.path.join(progress_dir, f"{download_id}.json")
        with open(progress_path, "w") as f:
            json.dump(progress_data, f)
    except Exception as e:
        print(f"Error saving progress: {e}")
def load_download_progress(download_id, num_chunks, progress_file=PROGRESS_FILE):
    """Load download progress for resuming"""
    try:
        progress_dir = os.path.join(download_folder, ".progress")
        progress_path = os.path.join(progress_dir, f"{download_id}.json")
       
        if os.path.exists(progress_path):
            with open(progress_path, "r") as f:
                data = json.load(f)
                if len(data) == num_chunks:
                    return data
    except Exception as e:
        print(f"Error loading progress: {e}")
    return [0] * num_chunks

def cleanup_progress_file(download_id, progress_file=PROGRESS_FILE):
    """Clean up progress file when download completes"""
    try:
        progress_dir = os.path.join(download_folder, ".progress")
        progress_path = os.path.join(progress_dir, f"{download_id}.json")
        if os.path.exists(progress_path):
            os.remove(progress_path)
    except Exception as e:
        print(f"Error cleaning progress: {e}")
async def download_chunk(session, url, start, end, filename, progress, idx, download_id):
    """Download a single chunk with resume support and WebSocket updates"""
    # Calculate actual start based on progress
    actual_start = start + progress[idx]
   
    if actual_start > end:
        return # Chunk already completed
   
    headers = {'Range': f'bytes={actual_start}-{end}'}
   
    try:
        async with session.get(url, headers=headers) as resp:
            if resp.status not in (200, 206):
                raise Exception(f"HTTP {resp.status} for chunk {idx}")
           
            with open(filename, 'r+b') as f:
                f.seek(actual_start)
                async for chunk in resp.content.iter_chunked(CHUNK_SIZE):
                    if not chunk:
                        break
                    f.write(chunk)
                    progress[idx] += len(chunk)
                   
                    # Save progress periodically
                    if progress[idx] % (CHUNK_SIZE * 5) == 0: # Every 5MB
                        save_download_progress(download_id, progress)
                   
                    # Update real-time progress and send WebSocket update
                    total_downloaded = sum(progress)
                    total_size = os.path.getsize(filename)
                    percent = (total_downloaded / total_size * 100) if total_size > 0 else 0
                   
                    progress_data = {
                        'percent': round(percent, 1),
                        'downloaded_bytes': total_downloaded,
                        'total_bytes': total_size,
                        'speed': 0,
                        'eta': 0,
                        'filename': os.path.basename(filename),
                        'status': 'downloading',
                        'method': 'direct',
                        'can_pause': True,
                        'resumable': True
                    }
                   
                    # Update global progress
                    download_progress[download_id].update(progress_data)
                   
                    # Send WebSocket update
                    try:
                        asyncio.run_coroutine_threadsafe(
                            system_status_websocket.send_download_update(download_id, progress_data),
                            asyncio.get_event_loop()
                        )
                    except Exception as e:
                        print(f"Error sending chunk WebSocket update: {e}")
                   
    except Exception as e:
        # Save progress on error for resuming
        save_download_progress(download_id, progress)
        raise e
async def download_regular_file_async(url, filename, download_id):
    """Download regular files with resume/pause support"""
    async with aiohttp.ClientSession() as session:
        progress = None # Initialize progress variable
        try:
            # Get total size
            async with session.head(url) as resp:
                if resp.status != 200:
                    raise Exception(f"HTTP {resp.status}: Could not access file")
                total_size = int(resp.headers.get('Content-Length', 0))
               
                if total_size == 0:
                    # Fallback for unknown size - no resume support
                    return await download_unknown_size_file(session, url, filename, download_id)
            # Create or resume file
            file_exists = os.path.exists(filename)
            if not file_exists:
                with open(filename, 'wb') as f:
                    f.truncate(total_size)
            else:
                # Verify existing file size matches
                current_size = os.path.getsize(filename)
                if current_size != total_size:
                    print(f"File size mismatch. Recreating file...")
                    with open(filename, 'wb') as f:
                        f.truncate(total_size)
            # Calculate chunks for parallel download
            chunk_size = total_size // NUM_WORKERS
            progress = load_download_progress(download_id, NUM_WORKERS) # Now progress is defined
           
            # Initialize progress tracking
            download_progress[download_id] = {
                'status': 'downloading',
                'percent': 0,
                'downloaded_bytes': sum(progress),
                'total_bytes': total_size,
                'speed': 0,
                'eta': None,
                'filename': os.path.basename(filename),
                'resumable': True,
                'can_pause': True,
                'method': 'direct'
            }
            # Create download tasks
            tasks = []
            for i in range(NUM_WORKERS):
                start = i * chunk_size
                end = (i + 1) * chunk_size - 1 if i != NUM_WORKERS - 1 else total_size - 1
                tasks.append(download_chunk(session, url, start, end, filename, progress, i, download_id))
            await asyncio.gather(*tasks)
           
            # Clean up and mark as finished
            cleanup_progress_file(download_id)
            download_progress[download_id] = {
                'status': 'finished',
                'percent': 100,
                'filename': filename,
                'method': 'direct'
            }
           
        except asyncio.CancelledError:
            # Download was paused/cancelled - save progress
            if progress is not None: # Check if progress exists
                save_download_progress(download_id, progress)
            download_progress[download_id]['status'] = 'paused'
            raise
           
        except Exception as e:
            # Save progress on any error for resuming
            if progress is not None: # Check if progress exists
                save_download_progress(download_id, progress)
            download_progress[download_id] = {
                'status': 'error',
                'error': str(e),
                'method': 'direct'
            }
            raise
async def download_unknown_size_file(session, url, filename, download_id):
    """Fallback for files without Content-Length (no resume support)"""
    download_progress[download_id] = {
        'status': 'downloading',
        'percent': 0,
        'downloaded_bytes': 0,
        'total_bytes': None,
        'speed': 0,
        'eta': None,
        'filename': os.path.basename(filename),
        'resumable': False,
        'can_pause': False
    }
   
    async with session.get(url) as resp:
        with open(filename, 'wb') as f:
            total_downloaded = 0
            async for chunk in resp.content.iter_chunked(CHUNK_SIZE):
                f.write(chunk)
                total_downloaded += len(chunk)
               
                # Update progress (without percentage)
                download_progress[download_id].update({
                    'downloaded_bytes': total_downloaded,
                    'speed': 0
                })
   
    download_progress[download_id] = {
        'status': 'finished',
        'percent': 100,
        'filename': filename
    }
   
@csrf_exempt
def pause_download(request, download_id):
    print("PAUSING")
    """Pause an active download"""
    if download_id not in download_progress:
        print("Download id not in download progress")
        return JsonResponse({'error': 'Download not found'}, status=404)
    
    current_status = download_progress[download_id].get('status')
    if current_status != 'downloading':
        print("Not downloading")
        return JsonResponse({'error': 'Download not in progress'}, status=400)
    
    # Check if it's a torrent download
    if download_progress[download_id].get('method') == 'torrent':
        success = pause_torrent_download(download_id)
        if success:
            return JsonResponse({
                'status': 'paused',
                'message': 'Torrent download paused',
                'method': 'torrent'
            })
        else:
            return JsonResponse({'error': 'Failed to pause torrent'}, status=500)
    
    # Mark as paused - the async function will handle saving progress
    download_progress[download_id]['status'] = 'pausing'
    
    return JsonResponse({
        'status': 'pausing',
        'message': 'Download pausing...'
    })
    
    

@csrf_exempt
def resume_download(request, download_id):
    print("RESUMING")
    """Resume a paused download"""
    if download_id not in download_progress:
        print("Not in downloads")
        return JsonResponse({'error': 'Download not found'}, status=404)
    
    current_status = download_progress[download_id].get('status')
    if current_status != 'paused':
        print("Download not paused")
        return JsonResponse({'error': 'Download not paused'}, status=400)
    
    # Check if it's a torrent download
    if download_progress[download_id].get('method') == 'torrent':
        success = resume_torrent_download(download_id)
        if success:
            return JsonResponse({
                'status': 'resuming',
                'message': 'Torrent download resuming...',
                'method': 'torrent'
            })
        else:
            return JsonResponse({'error': 'Failed to resume torrent'}, status=500)
    
    # Get download info for regular downloads
    url = download_progress[download_id].get('original_url')
    filename = download_progress[download_id].get('filename')
    
    if not url or not filename:
        return JsonResponse({'error': 'Cannot resume - missing download info'}, status=400)
    
    # Restart the download (it will resume from progress file)
    def async_download_wrapper():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(
                download_regular_file_async(url, filename, download_id)
            )
            if download_progress[download_id].get('status') == 'finished':
                save_regular_file_to_history(download_id, url, filename)
        except Exception as e:
            print(f"Resume error: {e}")
        finally:
            loop.close()
    
    thread = threading.Thread(target=async_download_wrapper, daemon=True)
    thread.start()
    
    return JsonResponse({
        'status': 'resuming',
        'message': 'Download resuming...'
    })
    

@csrf_exempt
def cancel_download(request, download_id):
    print("CANCELING")
    """Cancel a download and cleanup"""
    if download_id not in download_progress:
        return JsonResponse({'error': 'Download not found'}, status=404)
    
    # Check if it's a torrent download
    if download_progress[download_id].get('method') == 'torrent':
        delete_file = request.GET.get('delete_file', 'false').lower() == 'true'
        success = stop_torrent_download(download_id, delete_file)
        if success:
            return JsonResponse({'status': 'cancelled', 'method': 'torrent'})
        else:
            return JsonResponse({'error': 'Failed to cancel torrent'}, status=500)
    
    # Mark as cancelled for regular downloads
    download_progress[download_id]['status'] = 'cancelled'
    
    # Clean up progress file
    cleanup_progress_file(download_id)
    
    # Optional: Delete partial file
    delete_file = request.GET.get('delete_file', 'false').lower() == 'true'
    if delete_file and 'filename' in download_progress[download_id]:
        try:
            filepath = download_progress[download_id]['filename']
            if os.path.exists(filepath):
                os.remove(filepath)
        except Exception as e:
            print(f"Error deleting file: {e}")
    
    return JsonResponse({'status': 'cancelled'})    


@csrf_exempt
def system_status(request):
    # Return immediate status via HTTP (original functionality)
    status_data = system_status_websocket.get_system_status_data()
    return JsonResponse(status_data)
download_folder = str(Path.home() / "Downloads/")
ydl_opts = {
    'outtmpl': f'{download_folder}/%(title)s.%(ext)s',
    'user_agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
}


def get_cookies_file():
    """Get cookies file path, create if doesn't exist"""
    cookies_dir = os.path.join(os.path.dirname(__file__), 'cookies')
    os.makedirs(cookies_dir, exist_ok=True)
    
    cookies_file = os.path.join(cookies_dir, 'cookies.txt')
    
    # Try to auto-export cookies if file doesn't exist
    if not os.path.exists(cookies_file):
        try:
            cookies = browser_cookie3.load(domain_name='instagram.com')
            if cookies:
                with open(cookies_file, 'w') as f:
                    for cookie in cookies:
                        if 'instagram.com' in cookie.domain:
                            f.write('\t'.join([
                                'TRUE' if cookie.secure else 'FALSE',
                                cookie.domain,
                                'TRUE' if cookie.domain.startswith('.') else 'FALSE',
                                cookie.path,
                                'TRUE' if cookie.secure else 'FALSE',
                                str(int(cookie.expires)) if cookie.expires else '0',
                                cookie.name,
                                cookie.value,
                            ]) + '\n')
                print(f"✅ Auto-exported cookies to {cookies_file}")
        except Exception as e:
            print(f"⚠ Could not auto-export cookies: {e}")
    
    return cookies_file if os.path.exists(cookies_file) else None

def KORA_THUMBNAILS():
    # Source folder
    DOWNLOADS = Path.home() / "Downloads"

    # Final storage folder
    THUMBNAILS_DIR = Path.home() / "sdm" / "thumbnails"
    THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)

    # Supported file types
    SUPPORTED_AUDIO_EXTS = (".mp3", ".flac", ".m4a", ".aac", ".ogg", ".wav")
    SUPPORTED_VIDEO_EXTS = (".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv")
    SUPPORTED_EXTS = SUPPORTED_AUDIO_EXTS + SUPPORTED_VIDEO_EXTS

    # Step 1: Build dictionary of all media files {stem: path}
    media_files = {}
    try:
        for p in DOWNLOADS.rglob("*"):
            if p.suffix.lower() in SUPPORTED_EXTS:
                # Use normalized stem (lowercase, remove special chars)
                normalized_stem = "".join(c.lower() for c in p.stem if c.isalnum())
                media_files[normalized_stem] = p
    except Exception as e:
        print(f"Error scanning downloads: {e}")

    # Step 2: Delete orphan thumbnails
    for thumb in THUMBNAILS_DIR.glob("*.png"):
        # Get normalized thumbnail stem
        thumb_stem = thumb.stem
        normalized_thumb_stem = "".join(c.lower() for c in thumb_stem if c.isalnum())
        
        # Check if media file exists
        if normalized_thumb_stem not in media_files:
            try:
                thumb.unlink()
                print(f"Deleted orphan thumbnail: {thumb.name}")
            except Exception as e:
                print(f"Error deleting {thumb.name}: {e}")

    # Step 3: Create missing thumbnails
    for normalized_stem, media_path in media_files.items():
        # Find corresponding thumbnail (case-insensitive search)
        thumbnail_found = False
        for thumb in THUMBNAILS_DIR.glob("*.png"):
            thumb_normalized = "".join(c.lower() for c in thumb.stem if c.isalnum())
            if thumb_normalized == normalized_stem:
                thumbnail_found = True
                break
        
        # If thumbnail doesn't exist, create it
        if not thumbnail_found:
            # Use original filename for thumbnail name
            safe_stem = "".join(c for c in media_path.stem if c.isalnum() or c in (' ', '-', '_'))
            output_image = THUMBNAILS_DIR / f"{safe_stem}.png"
            
            suffix = media_path.suffix.lower()
            
            if suffix in SUPPORTED_AUDIO_EXTS:
                try:
                    audio = File(media_path)
                    image_data = None
                    
                    if audio:
                        if suffix == ".mp3":
                            tags = ID3(media_path)
                            for tag in tags.values():
                                if tag.FrameID == "APIC":
                                    image_data = tag.data
                                    break
                        elif suffix == ".flac" and audio.pictures:
                            image_data = audio.pictures[0].data
                        elif suffix in (".m4a", ".aac") and "covr" in audio:
                            image_data = audio["covr"][0]
                    
                    if image_data:
                        img = Image.open(io.BytesIO(image_data)).convert("RGBA")
                        img.save(output_image, "PNG")
                        print(f"Created cover art thumbnail: {media_path.name}")
                        continue
                except Exception as e:
                    print(f"Error with cover art for {media_path.name}: {e}")
                
                # Create waveform
                try:
                    ffmpeg.input(str(media_path)) \
                        .filter("showwavespic", s="600x300") \
                        .output(str(output_image), vframes=1) \
                        .overwrite_output() \
                        .run(quiet=True)
                    print(f"Created waveform thumbnail: {media_path.name}")
                except Exception as e:
                    print(f"Error creating waveform for {media_path.name}: {e}")
            
            elif suffix in SUPPORTED_VIDEO_EXTS:
                try:
                    ffmpeg.input(str(media_path), ss=1) \
                        .output(str(output_image), vframes=1) \
                        .overwrite_output() \
                        .run(quiet=True)
                    print(f"Created video thumbnail: {media_path.name}")
                except Exception as e:
                    print(f"Error creating thumbnail for {media_path.name}: {e}")

def index(request):
    # Only start the thread if it's not already running
    # You might want to add thread management to avoid multiple concurrent runs
    threading.Thread(target=KORA_THUMBNAILS, daemon=True).start()
    return render(request, "index.html", {
        "download_folder": download_folder,
    })    
    
def resolve_format_with_audio(format_id: str) -> str:
    """
    If the user picked a video-only format → force merge with best audio
    If they picked audio-only → return audio
    If they picked a merged format (18, 22, etc.) → keep it
    """
    # Common video-only format_ids (YouTube DASH)
    video_only_ids = {
        '137', '138', '266', # 1080p, 4K, etc.
        '248', '271', '313', # WebM 1080p, 1440p, 4K
        '299', '335', '337', # 1080p60, 1440p60, 4K60
        '399', '401', '402', # Higher HDR formats
    }
    # Common audio-only
    audio_only_ids = {'139', '140', '141', '249', '250', '251', '599', '600'}
    # Known pre-merged formats (have both video + audio)
    merged_formats = {'18', '22', '43', '44', '45', '46', '133', '134', '135', '136'}
    format_id = str(format_id).strip()
    if format_id in video_only_ids:
        return f"{format_id}+bestaudio/best"
    elif format_id in audio_only_ids:
        return "bestaudio/best" if format_id != "bestaudio" else format_id
    elif format_id in merged_formats or "best" in format_id.lower():
        return format_id
    else:
        return "bestvideo+bestaudio/best"

def clean_url(url: str) -> str:
    """
    Normalize YouTube URLs into a clean watch?v=ID format.
    For non-YouTube platforms (FB, IG, TikTok, etc.), return the URL unchanged.
    """
    if not url:
        return url
    
    # Don't try to clean magnet URLs
    if url.startswith('magnet:'):
        return url
    
    parsed = urlparse(url)
    hostname = parsed.netloc.lower()
    # YouTube URL cleaning
    if "youtube.com" in hostname or "youtu.be" in hostname:
        query = parse_qs(parsed.query)
        video_id = None
        if 'v' in query:
            video_id = query['v'][0]
        elif "youtu.be" in hostname:
            video_id = parsed.path.strip('/')
        elif "/shorts/" in parsed.path:
            video_id = parsed.path.split("/shorts/")[-1].split("?")[0]
        elif "/embed/" in parsed.path:
            video_id = parsed.path.split("/embed/")[-1].split("?")[0]
        if not video_id:
            match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11})', url)
            if match:
                video_id = match.group(1)
        if video_id:
            return f"https://www.youtube.com/watch?v={video_id}"
    return url


def get_os_name():
        return platform.system()
def get_battery_percentage():
    battery = psutil.sensors_battery()
    if battery is not None:
        return battery.percent
    return "No battery detected"
def is_online():
    try:
        # Attempt to connect to a reliable host (Google DNS)
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False
def get_network_name():
    # For Windows: network SSID via netsh
    if platform.system() == "Windows":
        try:
            result = os.popen('netsh wlan show interfaces').read()
            for line in result.split("\n"):
                if "SSID" in line and "BSSID" not in line:
                    return line.split(":")[1].strip()
        except Exception:
            return "Unknown"
    # For Linux / macOS: use iwgetid (WiFi SSID)
    else:
        try:
            result = os.popen('iwgetid -r').read().strip()
            if result:
                return result
        except Exception:
            pass
    return "No Network"
@csrf_exempt
def save_to_history(request):
    """Save completed download to permanent history"""
    if request.method == 'POST':
        data = json.loads(request.body)
       
        download_entry = DownloadHistory(
            filename=data.get('filename'),
            original_url=data.get('url'),
            download_path=data.get('download_path'),
            file_size=data.get('file_size'),
            format_info=data.get('format_info', {}),
            status='completed'
        )
        download_entry.save()
       
        return JsonResponse({'status': 'saved', 'id': download_entry.id})
   
    return JsonResponse({'error': 'POST required'}, status=400)
@csrf_exempt
def get_download_history(request):
    """Return DB history + all files in Downloads folder"""
    history_data = []
    # Determine Downloads folder
    home = Path.home()
    system = platform.system()
    if system == "Windows":
        download_dir = home / "Downloads"
    elif system in ["Linux", "Darwin"]:
        download_dir = home / "Downloads"
    else:
        download_dir = home / "Downloads"
    # DATABASE ENTRIES
    db_counter = 0
    db_entries = DownloadHistory.objects.all().distinct().order_by('-created_at')
    db_filenames = set()
    for entry in db_entries:
        db_filenames.add(entry.filename)
        db_counter+=1
        # Determine download type
        format_info = entry.format_info or {}
        is_regular_file = format_info.get('is_regular_file') or format_info.get('method') == 'async_downloader'
       
        history_data.append({
            'id': entry.id,
            'filename': entry.filename,
            'original_url': entry.original_url,
            'download_path': entry.download_path,
            'file_size': entry.file_size,
            'format_info': detect_file_type_from_url(entry.filename),
            'status': entry.status,
            'created_at': entry.created_at.isoformat(),
            'completed_at': entry.completed_at.isoformat() if entry.completed_at else None,
            'download_count': entry.download_count,
            'file_exists': os.path.exists(entry.download_path) if entry.download_path else False,
            'source': 'database',
            'download_type': 'regular_file' if is_regular_file else 'media_file',
            'can_redownload': True # Both types can be redownloaded
        })
    # FILES IN DOWNLOADS FOLDER
    id_counter = DownloadHistory.objects.count()
    if download_dir.is_dir():
        for file_path in download_dir.iterdir():
            if file_path.is_file() and file_path.name not in db_filenames:
                # Try to determine if it's a media file by extension
                media_extensions = ['.mp4', '.webm', '.m4a', '.mp3', '.avi', '.mov', '.mkv']
                is_media_file = any(file_path.name.lower().endswith(ext) for ext in media_extensions)
                history_data.append({
                    'id': id_counter,
                    'filename': file_path.name,
                    'original_url': None,
                    'download_path': str(file_path),
                    'file_size': file_path.stat().st_size,
                    'format_info': detect_file_type_from_url(file_path.name),
                    'status': 'completed',
                    'created_at': None,
                    'completed_at': None,
                    'download_count': None,
                    'file_exists': True,
                    'source': 'folder',
                    "modified": str(datetime.datetime.fromtimestamp(os.path.getmtime(file_path))),
                    'download_type': 'media_file' if is_media_file else 'regular_file',
                    'can_redownload': False # Files from folder can't be redownloaded (no URL)
                })
                id_counter += 1
               
    return JsonResponse({'history': history_data})






@csrf_exempt
def download_info(request):
    """Get information about a URL before downloading"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
       
    data = json.loads(request.body)
    url = clean_url(data.get('url'))
   
    if not url:
        return JsonResponse({'error': 'URL required'}, status=400)
   
    is_media = is_ytdlp_supported(url)
   
    info = {
        'url': url,
        'type': 'media' if is_media else 'regular_file',
        'supported': True,
        'can_choose_format': is_media,
        'can_pause': not is_media, # Only regular files support pause
        'resumable': not is_media, # Only regular files support resume
        'estimated_size': None,
        'filename': url.split('/')[-1] or 'download'
    }
   
    return JsonResponse(info)
@csrf_exempt
def delete_from_history(request, history_id):
    """Delete entry from history (optional: also delete file)"""
    if request.method == 'GET':
        try:
            entry = DownloadHistory.objects.get(id=history_id)
           
            # Optional: Also delete the actual file
            delete_file = request.GET.get('delete_file', 'false').lower() == 'true'
            if delete_file and entry.download_path and os.path.exists(entry.download_path):
                os.remove(entry.download_path)
           
            entry.delete()
            return JsonResponse({'status': 'deleted'})
           
        except DownloadHistory.DoesNotExist:
            return JsonResponse({'error': 'History entry not found'}, status=404)
   
    return JsonResponse({'error': 'DELETE required'}, status=405)
@csrf_exempt
def redownload_from_history(request, history_id):
    """Redownload a file from history"""
    try:
        entry = DownloadHistory.objects.get(id=history_id)
       
        # Increment download count
        entry.download_count += 1
        entry.save()
       
        # Start new download using the original URL and format
        download_id = f"redownload_{int(time.time())}_{entry.id}"
       
        def redownload_thread():
            final_format = resolve_format_with_audio(entry.format_info.get('format_id', 'best'))
           
            opts = {
                'format': final_format,
                'merge_output_format': 'mp4',
                'quiet': True,
                'noplaylist': True,
                'progress_hooks': [lambda d: progress_hook(d, download_id)],
                'outtmpl': ydl_opts.get('outtmpl'),
            }
            try:
                with yt_dlp.YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(entry.original_url, download=False)
                    print(f"Redownloading: {info.get('title', 'Unknown')}")
                   
                    # Download and get the result
                    result = ydl.extract_info(entry.original_url, download=True)
                   
                    # Save to history after redownload completes
                    if result and '_filename' in result:
                        final_filename = result['_filename']
                        save_completed_download_to_history(
                            download_id=download_id,
                            url=entry.original_url,
                            format_id=entry.format_info.get('format_id', 'best'),
                            final_format=final_format,
                            final_filename=final_filename,
                            is_redownload=True,
                            original_entry=entry
                        )
                   
            except Exception as e:
                download_progress[download_id] = {
                    'status': 'error',
                    'error': str(e)
                }
                print(f"Redownload error: {e}")
        thread = threading.Thread(target=redownload_thread, daemon=True)
        thread.start()
       
        return JsonResponse({
            'status': 'redownload_started',
            'download_id': download_id,
            'message': f'Redownloading {entry.filename}'
        })
       
    except DownloadHistory.DoesNotExist:
        return JsonResponse({'error': 'History entry not found'}, status=404)
@csrf_exempt
def clear_download_history(request):
    """Clear all download history"""
    if request.method == 'DELETE':
        count, _ = DownloadHistory.objects.all().delete()
        return JsonResponse({'status': 'cleared', 'deleted_count': count})
   
    return JsonResponse({'error': 'DELETE required'}, status=405)



@csrf_exempt
def rename_file(request):
    """
    Rename a file with automatic duplicate handling
    If new name exists, adds (1), (2), etc.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    try:
        data = json.loads(request.body)
        current_path = data.get('current_path')
        new_name = data.get('new_name')
        
        # Validate inputs
        if not current_path or not new_name:
            return JsonResponse({
                'error': 'Both current_path and new_name are required'
            }, status=400)
        
        # Security check
        home_dir = str(Path.home())
        if not os.path.abspath(current_path).startswith(home_dir):
            return JsonResponse({
                'error': 'Access denied: File must be within home directory'
            }, status=403)
        
        if not os.path.exists(current_path):
            return JsonResponse({'error': 'Source file not found'}, status=404)
        
        directory = os.path.dirname(current_path)
        old_name = os.path.basename(current_path)
        
        # Split into name and extension
        new_name_no_ext, new_ext = os.path.splitext(new_name)
        
        # If no extension in new name, try to preserve original
        if not new_ext:
            old_name_no_ext, old_ext = os.path.splitext(old_name)
            new_ext = old_ext
            new_name = f"{new_name_no_ext}{new_ext}"
        else:
            new_name_no_ext, new_ext = os.path.splitext(new_name)
        
        # Generate unique filename if needed
        counter = 1
        final_new_name = new_name
        final_new_path = os.path.join(directory, final_new_name)
        
        while os.path.exists(final_new_path):
            final_new_name = f"{new_name_no_ext} ({counter}){new_ext}"
            final_new_path = os.path.join(directory, final_new_name)
            counter += 1
            
            # Safety limit
            if counter > 1000:
                return JsonResponse({
                    'error': 'Too many duplicate files, please choose a different name'
                }, status=400)
        
        # Perform the rename
        os.rename(current_path, final_new_path)
        
        return JsonResponse({
            'success': True,
            'message': f'File renamed to "{final_new_name}"',
            'old_name': old_name,
            'new_name': final_new_name,
            'old_path': current_path,
            'new_path': final_new_path,
            'directory': directory,
            'was_duplicate': counter > 1
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
def open_file(request):
    """Fixed open_file function"""
    try:
        data = json.loads(request.body)
        filepath = data.get("filepath")
       
        # Validate filepath
        if not filepath:
            return JsonResponse({"error": "No filepath provided"}, status=400)
       
        # Check if file exists
        if not os.path.exists(filepath):
            return JsonResponse({"error": "File not found"}, status=404)
       
        print(f"Opening file: {filepath}")
        if platform.system() == "Windows":
            os.startfile(filepath)
        elif platform.system() == "Darwin":
            subprocess.call(["open", filepath])
        else:
            subprocess.call(["xdg-open", filepath])
        return JsonResponse({
            "ok": True,
            "msg": "Opening file..."
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def open_file_location(request):
    """Fixed open_file_location function"""
    try:
        data = json.loads(request.body)
        filepath = data.get("filepath")
       
        if not filepath:
            return JsonResponse({"error": "No filepath provided"}, status=400)
       
        # Extract directory from filepath
        directory = os.path.dirname(filepath)
       
        # Check if directory exists
        if not os.path.exists(directory):
            return JsonResponse({"error": "Directory not found"}, status=404)
        print(f"Opening directory: {directory}")
        if platform.system() == "Windows":
            os.startfile(directory)
        elif platform.system() == "Darwin":
            subprocess.call(["open", directory])
        else:
            subprocess.call(["xdg-open", directory])
        return JsonResponse({
            "ok": True,
            "msg": "Opening file location..."
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def is_gallery_dl_supported(url):
    """
    Checks if the URL is supported by gallery-dl.
    1. First tries system PATH (gallery-dl command) with all browsers
    2. Falls back to bundled executables with all browsers
    """
    
    # Helper function to try gallery-dl with a specific executable and all browsers
    def try_with_all_browsers(exe_path, source_name):
        for browser in BROWSERS:
            try:
                result = subprocess.run(
                    [exe_path, "--cookies-from-browser", browser, "-g", url],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0 and result.stdout.strip():
                    print(f"✓ {source_name} worked with {browser}")
                    return True, browser
                else:
                    # Optional debug output
                    if result.returncode != 0:
                        print(f"  {source_name} with {browser}: failed (code {result.returncode})")
            except subprocess.TimeoutExpired:
                print(f"  {source_name} with {browser}: timed out")
            except Exception as e:
                print(f"  {source_name} with {browser}: error ({type(e).__name__})")
        
        return False, None
    
    # TRY 1: System PATH (gallery-dl command) with all browsers
    print("Trying gallery-dl from system PATH...")
    success, browser = try_with_all_browsers("gallery-dl", "System PATH")
    if success:
        return True
    
    # System PATH not found or didn't work
    print("Gallery-dl not found in system PATH or didn't work, trying bundled executables...")
    
    # TRY 2: Bundled executables with all browsers
    system = platform.system()
    executable_name = None
    
    if system == "Windows":
        executable_name = "gallery-dl.exe"
    elif system == "Linux":
        executable_name = "gallery-dl.bin"
    elif system == "Darwin":  # macOS
        executable_name = "gallery-dl.mac"
    else:
        print(f"Unsupported OS: {system}")
        return False
    
    # Look for executable in possible locations
    possible_locations = [
        # In bin folder (PyInstaller bundled)
        os.path.join(getattr(sys, '_MEIPASS', os.getcwd()), "bin", executable_name),
        
        # In same directory as current script
        os.path.join(os.path.dirname(os.path.abspath(__file__)), executable_name),
        
        # In current working directory
        os.path.join(os.getcwd(), executable_name),
        
        # In bin folder relative to script
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "bin", executable_name),
    ]
    
    # Find the executable
    exe_path = None
    for location in possible_locations:
        if os.path.exists(location):
            exe_path = location
            print(f"Found bundled gallery-dl at: {exe_path}")
            break
    
    if not exe_path:
        print(f"Could not find {executable_name} in any known location")
        return False
    
    # Make executable on Unix-like systems
    if system in ["Linux", "Darwin"]:
        try:
            os.chmod(exe_path, 0o755)  # rwxr-xr-x
            print(f"Made {executable_name} executable")
        except Exception as e:
            print(f"Warning: Could not make {executable_name} executable: {e}")
    
    # Try bundled executable with all browsers
    print(f"Trying bundled gallery-dl with all browsers...")
    success, browser = try_with_all_browsers(exe_path, "Bundled")
    
    if success:
        print(f"✓ Bundled gallery-dl supports URL (worked with {browser})")
    else:
        print(f"✗ Gallery-dl doesn't support URL with any browser")
    
    return success

    

def get_gallery_dl_info(url):
    """Get gallery-dl info with cleaned URLs, trying all browsers"""
    
    def try_with_browser(exe_path, browser, metadata=False):
        """Try gallery-dl with specific browser and command"""
        try:
            cmd = [
                exe_path,
                "--cookies-from-browser", browser,
                "--dump-json" if metadata else "-g",
                url
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30 if metadata else 60  # Metadata might be faster
            )
            
            if result.returncode == 0 and result.stdout.strip():
                return True, result.stdout
            else:
                return False, result.stderr if result.stderr else "No output"
                
        except subprocess.TimeoutExpired:
            return False, "Timeout"
        except Exception as e:
            return False, str(e)
    
    def find_gallery_dl_executable():
        """Find gallery-dl executable (system PATH or bundled)"""
        # First try system PATH
        try:
            subprocess.run(["gallery-dl", "--version"], 
                         capture_output=True, check=True)
            print("✓ Using gallery-dl from system PATH")
            return "gallery-dl", "system"
        except (FileNotFoundError, subprocess.CalledProcessError):
            pass
        
        # Fallback to bundled executables
        system = platform.system()
        executable_name = None
        
        if system == "Windows":
            executable_name = "gallery-dl.exe"
        elif system == "Linux":
            executable_name = "gallery-dl.bin"
        elif system == "Darwin":
            executable_name = "gallery-dl.mac"
        else:
            return None, None
        
        possible_locations = [
            os.path.join(getattr(sys, '_MEIPASS', os.getcwd()), "bin", executable_name),
            os.path.join(os.path.dirname(os.path.abspath(__file__)), executable_name),
            os.path.join(os.getcwd(), executable_name),
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "bin", executable_name),
        ]
        
        for location in possible_locations:
            if os.path.exists(location):
                # Make executable on Unix-like systems
                if system in ["Linux", "Darwin"]:
                    try:
                        os.chmod(location, 0o755)
                    except:
                        pass
                print(f"✓ Using bundled gallery-dl: {location}")
                return location, "bundled"
        
        return None, None
    
    # Main logic
    try:
        # Find executable
        exe_path, exe_type = find_gallery_dl_executable()
        if not exe_path:
            print("✗ gallery-dl not found")
            return None
        
        # Try to get URLs with each browser
        urls = []
        successful_browser = None
        
        print("Trying to get gallery URLs...")
        for browser in BROWSERS:
            print(f"  Trying {browser}...", end=" ")
            success, output = try_with_browser(exe_path, browser, metadata=False)
            
            if success:
                successful_browser = browser
                print("✓ Success!")
                
                # Parse URLs
                for line in output.strip().splitlines():
                    clean_line = line.strip()
                    if clean_line.startswith('|'):
                        clean_line = clean_line[1:].strip()
                    if clean_line.startswith(('http://', 'https://')):
                        urls.append(clean_line)
                
                if urls:
                    break  # Stop at first successful browser
                else:
                    print("  (no URLs found)")
            else:
                print(f"✗ Failed: {output[:50]}")
        
        if not urls:
            print("✗ Could not get URLs with any browser")
            return None
        
        # Get metadata with the successful browser
        metadata = None
        if successful_browser:
            try:
                print(f"Getting metadata with {successful_browser}...")
                success, meta_output = try_with_browser(exe_path, successful_browser, metadata=True)
                
                if success and meta_output.strip():
                    try:
                        metadata = json.loads(meta_output)
                        # Handle both single object and array
                        if isinstance(metadata, list) and len(metadata) > 0:
                            metadata = metadata[0]
                    except json.JSONDecodeError:
                        metadata = None
                else:
                    metadata = None
            except Exception as meta_error:
                print(f"Metadata error: {meta_error}")
                metadata = None
        
        # Extract title, thumbnail from metadata
        title, thumbnail, thumbnails = extract_gallery_dl_metadata(metadata, urls) if metadata else (None, None, [])
        
        # Fallback title
        if not title:
            first_url = urls[0] if urls else ""
            filename = os.path.basename(first_url.split('?')[0])
            title = filename.split('.')[0] if '.' in filename else url.split('/')[-1]
        
        # Fallback thumbnail
        if not thumbnail and urls:
            for image_url in urls:
                if any(image_url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                    thumbnail = image_url
                    break
        
        # Create formats list
        formats = []
        for i, file_url in enumerate(urls):
            filename = os.path.basename(file_url.split('?')[0])
            ext = get_extension_from_filename(filename)
            
            is_video = any(file_url.lower().endswith(vid_ext) for vid_ext in ['.mp4', '.webm', '.mov', '.avi', '.mkv'])
            
            formats.append({
                'format_id': f'gallery_dl_{i}',
                'ext': ext,
                'url': file_url,
                'filename': filename,
                'protocol': 'https',
                'vcodec': 'none' if not is_video else 'h264',
                'acodec': 'none' if not is_video else 'aac',
                'resolution': 'Original',
                'filesize': None,
                'tbr': None,
                'abr': None,
                'asr': None,
                'fps': None,
                'is_direct': True
            })
        
        result = {
            'title': title,
            'formats': formats,
            'thumbnail': thumbnail,
            'thumbnails': [{'url': thumbnail}] if thumbnail else thumbnails,
            'direct_urls': urls,
            'extractor': 'gallery-dl',
            'webpage_url': url,
            '_type': 'video' if any('video' in url.lower() or url.lower().endswith(vid_ext) for vid_ext in ['.mp4', '.webm', '.mov']) else 'image',
            'successful_browser': successful_browser,
            'executable_type': exe_type
        }
        
        print(f"✓ Successfully extracted {len(urls)} URLs using {successful_browser}")
        return result
        
    except Exception as e:
        print(f"✗ gallery-dl info error: {e}")
        return None


def extract_gallery_dl_metadata(metadata, urls):
    """Extract title and thumbnails from gallery-dl metadata"""
    title = None
    thumbnail = None
    thumbnails = []
    
    try:
        if isinstance(metadata, list) and metadata:
            # Try to get from first item
            first_item = metadata[0]
            
            if isinstance(first_item, dict):
                # Try various title fields
                title_fields = ['title', 'name', 'filename', 'description', 'id']
                for field in title_fields:
                    if field in first_item and first_item[field]:
                        title = str(first_item[field])
                        break
                
                # Try various thumbnail fields
                thumb_fields = ['thumbnail', 'thumb', 'preview', 'url', 'image']
                for field in thumb_fields:
                    if field in first_item and first_item[field]:
                        thumb_url = first_item[field]
                        if isinstance(thumb_url, str) and any(thumb_url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                            thumbnail = thumb_url
                            thumbnails.append({'url': thumb_url})
                            break
                
                # If still no thumbnail, check for thumbnails array
                if 'thumbnails' in first_item and isinstance(first_item['thumbnails'], list):
                    for thumb in first_item['thumbnails']:
                        if isinstance(thumb, dict) and 'url' in thumb:
                            thumb_url = thumb['url']
                            if any(thumb_url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                                if not thumbnail:  # Use first as primary thumbnail
                                    thumbnail = thumb_url
                                thumbnails.append({'url': thumb_url})
    
    except Exception as e:
        print(f"Metadata extraction error: {e}")
    
    return title, thumbnail, thumbnails

def extract_thumbnail_from_gallery_dl(metadata):
    """Extract thumbnail URL from gallery-dl metadata"""
    if isinstance(metadata, list) and metadata:
        # Try common paths for thumbnail
        item = metadata[0]
        
        # Check various possible thumbnail locations
        thumbnail_keys = ['thumbnail', 'thumb', 'preview', 'image', 'url']
        
        for key in thumbnail_keys:
            if isinstance(item, dict) and key in item:
                thumb = item[key]
                if isinstance(thumb, str) and any(thumb.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                    return thumb
        
        # If no direct thumbnail, try to get first image as thumbnail
        if isinstance(item, dict) and 'url' in item:
            url = item['url']
            if any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                return url
    
    return None

def get_extension_from_filename(filename):
    """Extract extension from filename"""
    if '.' in filename:
        return filename.split('.')[-1].lower()
    return 'jpg'  # default

def is_video_url(url):
    """Check if URL points to a video file"""
    video_exts = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv']
    return any(url.lower().endswith(ext) for ext in video_exts)

def download_with_fallback(request):
    """Unified download with yt-dlp → gallery-dl → regular fallback"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    data = json.loads(request.body)
    url = clean_url(data.get('url'))
    format_id = data.get('format_id', 'direct')
    
    if not url:
        return JsonResponse({'error': 'Missing URL'}, status=400)
    
    download_id = f"{int(time.time())}_{format_id}_{threading.get_ident()}"
    
    def download_thread():
        """Try yt-dlp first, then gallery-dl, then regular download"""
        
        # TRY 1: yt-dlp
        if is_ytdlp_supported(url):
            try:
                print(f"🔄 Trying yt-dlp for: {url}")
                return download_with_ytdlp_internal(url, format_id, download_id)
            except Exception as e:
                print(f"❌ yt-dlp failed: {e}")
                # Continue to gallery-dl fallback
        
        # TRY 2: gallery-dl
        if is_gallery_dl_supported(url):
            try:
                print(f"🔄 Trying gallery-dl for: {url}")
                return download_with_gallery_dl(url, download_id)
            except Exception as e:
                print(f"❌ gallery-dl failed: {e}")
                # Continue to regular download fallback
        
        # TRY 3: Regular file download
        try:
            print(f"🔄 Trying regular download for: {url}")
            return download_regular_file_internal(url, download_id)
        except Exception as e:
            print(f"❌ Regular download failed: {e}")
            
            # ALL FAILED
            download_progress[download_id] = {
                'status': 'error',
                'error': f'All download methods failed: yt-dlp, gallery-dl, and regular download',
                'url': url,
                'method': 'fallback'
            }
            raise Exception('All download methods failed')
    
    # Start download in thread
    thread = threading.Thread(target=download_thread, daemon=True)
    thread.start()
    
    return JsonResponse({
        'status': 'started',
        'download_id': download_id,
        'message': 'Download started with fallback system',
        'url': url
    })



def download_with_gallery_dl(url, download_id):
    """Download using gallery-dl with proper URL handling"""
    try:
        # Get info first
        info = get_gallery_dl_info(url)
        if not info:
            raise Exception("gallery-dl could not get info")
        
        title = info.get('title', 'gallery_dl_download')
        direct_urls = info.get('direct_urls', [])
        
        if not direct_urls:
            raise Exception("No direct URLs found")
        
        download_progress[download_id] = {
            'original_url': url,
            'format_info': {'format_id': 'gallery_dl'},
            'history_saved': False,
            'method': 'gallery-dl',
            'can_pause': False,
            'resumable': False,
            'status': 'starting',
            'total_files': len(direct_urls),
            'current_file': 0,
            'current_url': direct_urls[0] if direct_urls else None
        }
        
        # Download each URL
        for i, download_url in enumerate(direct_urls):
            # CLEAN THE URL - Remove pipe characters and whitespace
            clean_url = str(download_url).strip()
            if clean_url.startswith('|'):
                clean_url = clean_url[1:].strip()
            
            if not clean_url.startswith(('http://', 'https://')):
                print(f"⚠ Skipping invalid URL: {clean_url}")
                continue
            
            if i > 0:
                base_title = f"{title}_{i}"
            else:
                base_title = title
            
            # Generate filename
            filename = os.path.basename(clean_url.split('?')[0])
            if not filename or '.' not in filename:
                ext = get_extension_from_download_url(clean_url)
                filename = f"{base_title}.{ext}"
            
            output_path = os.path.join(download_folder, filename)
            
            # Update progress
            progress_data = {
                'status': 'downloading',
                'percent': (i / len(direct_urls)) * 100,
                'filename': filename,
                'total_bytes': None,
                'downloaded_bytes': 0,
                'current_file': i + 1,
                'total_files': len(direct_urls),
                'current_url': clean_url
            }
            download_progress[download_id].update(progress_data)
            
            # Download file
            try:
                download_direct_file(clean_url, output_path, download_id)
                
                # Save to history
                if os.path.exists(output_path):
                    save_gallery_dl_to_history(download_id, url, output_path, info)
            except Exception as e:
                print(f"❌ Failed to download {clean_url}: {e}")
                continue
        
        # Mark as completed
        download_progress[download_id] = {
            'status': 'finished',
            'percent': 100,
            'filename': title,
            'method': 'gallery-dl'
        }
        
        return True
        
    except Exception as e:
        download_progress[download_id] = {
            'status': 'error',
            'error': str(e),
            'method': 'gallery-dl'
        }
        raise


def download_direct_file(url, output_path, download_id):
    """Download a direct file with progress tracking"""
    import requests
    
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    downloaded = 0
    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)
                
                # Update progress
                if total_size > 0:
                    percent = (downloaded / total_size) * 100
                    download_progress[download_id].update({
                        'downloaded_bytes': downloaded,
                        'total_bytes': total_size,
                        'percent': round(percent, 1)
                    })
    
    return output_path

def get_extension_from_download_url(url):
    """Guess extension from URL"""
    # Try to extract from URL
    if '.' in url.split('?')[0]:
        possible_ext = url.split('?')[0].split('.')[-1].lower()
        if len(possible_ext) <= 5:  # Reasonable extension length
            return possible_ext
    
    # Default based on content type
    if 'image' in url.lower():
        return 'jpg'
    elif 'video' in url.lower():
        return 'mp4'
    else:
        return 'bin'

def save_gallery_dl_to_history(download_id, url, filepath, info):
    """Save gallery-dl download to history"""
    try:
        if not os.path.exists(filepath):
            return False
        
        file_size = os.path.getsize(filepath)
        filename = os.path.basename(filepath)
        
        download_entry = DownloadHistory(
            filename=filename,
            original_url=url,
            download_path=filepath,
            file_size=file_size,
            format_info={
                'method': 'gallery-dl',
                'extractor': info.get('extractor', 'gallery_dl'),
                'thumbnail': info.get('thumbnail'),
                'direct_url': info.get('url')
            },
            status='completed'
        )
        
        download_entry.save()
        
        # Mark as saved
        if download_id in download_progress:
            download_progress[download_id]['history_saved'] = True
        
        print(f"✅ Saved gallery-dl download to history: {filename}")
        return True
        
    except Exception as e:
        print(f"❌ Error saving gallery-dl to history: {e}")
        return False



@csrf_exempt
def download(request):
    """Main download endpoint with full torrent upload support"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
        
    try:
        data = json.loads(request.body)
        url = data.get('url', '')
        format_id = data.get('format_id', 'direct')
        selected_files = data.get('selected_files', [])
        
        if not url:
            return JsonResponse({'error': 'Missing URL'}, status=400)
        
        # Clean format_id for download ID
        clean_format = re.sub(r'[^\w]', '_', str(format_id))
        download_id = f"dl_{int(time.time())}_{clean_format}_{threading.get_ident()}"
        
        # ====== TORRENT UPLOAD HANDLING ======
        if format_id == 'torrent' and url.startswith('upload:'):
            upload_id = url.replace('upload:', '')
            
            print(f"🔍 Looking for uploaded torrent with ID: {upload_id}")
            print(f"📊 Global uploaded_torrents keys: {list(uploaded_torrents.keys())}")
            
            # Use the GLOBAL uploaded_torrents dictionary (same as formats endpoint)
            with uploaded_torrents_lock:
                torrent_data = uploaded_torrents.get(upload_id)
            
            if not torrent_data:
                return JsonResponse({
                    'error': f'Uploaded torrent file not found (ID: {upload_id}). Please re-upload the torrent file.'
                }, status=404)
            
            temp_path = torrent_data['path']
            
            if not os.path.exists(temp_path):
                # Clean up the missing entry
                with uploaded_torrents_lock:
                    uploaded_torrents.pop(upload_id, None)
                return JsonResponse({
                    'error': 'Uploaded torrent file no longer exists on disk. Please re-upload.'
                }, status=404)
            
            print(f"📂 Starting torrent download from uploaded file: {temp_path}")
            print(f"📁 Selected files: {selected_files}")
            print(f"📊 Torrent name: {torrent_data.get('name', 'Unknown')}")
            print(f"📦 Stored name: {torrent_data.get('torrent_info', {}).get('name', 'Unknown')}")
            
            # Start torrent download from uploaded file
            def start_uploaded_torrent():
                try:
                    success = start_torrent_download(
                        download_id=download_id,
                        magnet_or_file=temp_path,
                        save_path=download_folder,
                        selected_files=selected_files
                    )
                    
                    if success:
                        print(f"✅ Torrent download started successfully: {download_id}")
                        
                        # Initialize progress tracking
                        download_progress[download_id] = {
                            'status': 'downloading',
                            'percent': 0,
                            'downloaded_bytes': 0,
                            'total_bytes': 0,
                            'speed': 0,
                            'num_peers': 0,
                            'num_seeds': 0,
                            'download_id': download_id,
                            'method': 'torrent',
                            'torrent_name': torrent_data.get('name', 'Unknown Torrent')
                        }
                        
                        # Monitor for completion before cleaning up
                        max_wait = 30  # seconds
                        start_time = time.time()
                        
                        while time.time() - start_time < max_wait:
                            if download_id in download_progress:
                                status = download_progress[download_id].get('status')
                                if status in ['downloading', 'finished', 'error']:
                                    break
                            time.sleep(1)
                        
                        # Clean up temp file after a short delay
                        time.sleep(3)
                        try:
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                                print(f"🧹 Cleaned up temp torrent file: {os.path.basename(temp_path)}")
                                
                                # Remove from global storage
                                with uploaded_torrents_lock:
                                    uploaded_torrents.pop(upload_id, None)
                                    print(f"🗑️ Removed upload_id {upload_id} from global storage")
                                    
                        except Exception as e:
                            print(f"⚠ Could not clean up temp file: {e}")
                            
                    else:
                        download_progress[download_id] = {
                            'status': 'error',
                            'error': 'Failed to start torrent download from uploaded file',
                            'download_id': download_id
                        }
                        
                        # Clean up on failure
                        try:
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                            with uploaded_torrents_lock:
                                uploaded_torrents.pop(upload_id, None)
                        except:
                            pass
                        
                except Exception as e:
                    print(f"❌ Error in torrent thread: {e}")
                    import traceback
                    traceback.print_exc()
                    
                    download_progress[download_id] = {
                        'status': 'error',
                        'error': str(e),
                        'download_id': download_id
                    }
                    
                    # Clean up on error too
                    try:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                        with uploaded_torrents_lock:
                            uploaded_torrents.pop(upload_id, None)
                    except:
                        pass
            
            # Start the download thread
            thread = threading.Thread(target=start_uploaded_torrent, daemon=True)
            thread.start()
            
            # Give thread a moment to initialize
            time.sleep(0.5)
            
            return JsonResponse({
                'status': 'started',
                'download_id': download_id,
                'message': 'Torrent download started from uploaded file',
                'method': 'torrent',
                'upload_id': upload_id,
                'torrent_name': torrent_data.get('name', 'Unknown Torrent'),
                'can_pause': True,
                'resumable': True,
                'selected_files_count': len(selected_files)
            })
        
        # ====== REGULAR URL DOWNLOAD (Existing logic) ======
        # Clean URL for regular downloads
        url = clean_url(url)
        
        if not url:
            return JsonResponse({'error': 'Invalid URL provided'}, status=400)
        
        # Validate URL
        validation_result = validate_url(url)
        if not validation_result['is_valid']:
            return JsonResponse({'error': validation_result['error']}, status=400)
        
        print(f"🌐 Starting download for: {url}")
        print(f"🎯 Format ID: {format_id}")
        
        # Initialize progress entry
        download_progress[download_id] = {
            'status': 'queued',
            'percent': 0,
            'downloaded_bytes': 0,
            'total_bytes': 0,
            'speed': 0,
            'download_id': download_id,
            'url': url,
            'method': 'auto-detect'
        }
        
        # Start download with fallback sequence
        def start_download_thread():
            try:
                success = download_with_fallback_sequence(url, format_id, download_id)
                if not success:
                    download_progress[download_id] = {
                        'status': 'error',
                        'error': 'All download methods failed',
                        'url': url,
                        'download_id': download_id
                    }
            except Exception as e:
                print(f"❌ Download error: {e}")
                import traceback
                traceback.print_exc()
                download_progress[download_id] = {
                    'status': 'error',
                    'error': str(e),
                    'url': url,
                    'download_id': download_id
                }
        
        thread = threading.Thread(
            target=start_download_thread,
            daemon=True
        )
        thread.start()
        
        # Return immediate response
        return JsonResponse({
            'status': 'started',
            'download_id': download_id,
            'message': 'Download started',
            'url': url,
            'method': 'auto-detect',
            'can_pause': True,
            'resumable': True
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
    except Exception as e:
        print(f"❌ Exception in download endpoint: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
    
      


def clean_gallery_dl_urls(urls):
    """Clean gallery-dl output URLs"""
    cleaned = []
    for url in urls:
        if isinstance(url, str):
            # Remove pipe characters
            url = url.strip()
            if url.startswith('|'):
                url = url[1:].strip()
            
            # Ensure it's a valid URL
            if url.startswith(('http://', 'https://')):
                cleaned.append(url)
    return cleaned

def download_with_fallback_sequence(url, format_id, download_id):
    """Execute download with fallback sequence including torrents"""
    try:
        # TRY 0: Torrent/magnet URL (NEW ADDITION)
        if is_magnet_url(url) or (format_id == 'torrent' and url.lower().endswith('.torrent')):
            try:
                print(f"🔄 Starting torrent download: {url}")
                
                # Create download directory
                save_dir = os.path.join(download_folder, f'torrent_{download_id}')
                os.makedirs(save_dir, exist_ok=True)
                
                # Initialize progress
                download_progress[download_id] = {
                    'status': 'starting',
                    'percent': 0,
                    'downloaded_bytes': 0,
                    'total_bytes': None,
                    'speed': 0,
                    'eta': None,
                    'filename': 'Torrent Download',
                    'method': 'torrent',
                    'can_pause': True,
                    'resumable': True,
                    'type': 'torrent',
                    'save_path': download_folder
                }
                
                # Start torrent download
                success = start_torrent_download(download_id, url, save_dir)
                
                if success:
                    return True
                else:
                    print(f"❌ Torrent download failed, trying other methods")
            except Exception as e:
                print(f"❌ Torrent error: {e}")
                # Continue to other methods
        
        # TRY 1: yt-dlp (only if it actually works)
        if is_ytdlp_supported(url) and is_ytdlp_actually_working(url):
            try:
                # Test if yt-dlp can actually get info
                ydl = yt_dlp.YoutubeDL({'quiet': True, 'ignoreerrors': True})
                info = ydl.extract_info(url, download=False)
                
                if info and (info.get('formats') or info.get('url') or info.get('direct')):
                    print(f"✅ yt-dlp works, using it for: {url}")
                    return download_with_ytdlp_internal(url, format_id, download_id)
                else:
                    print(f"⚠ yt-dlp has no formats, trying gallery-dl for: {url}")
            except Exception as e:
                print(f"❌ yt-dlp failed, trying gallery-dl: {e}")
        
        # TRY 2: gallery-dl
        if is_gallery_dl_supported(url):
            try:
                print(f"🔄 Trying gallery-dl for: {url}")
                return download_with_gallery_dl(url, download_id)
            except Exception as e:
                print(f"❌ gallery-dl failed: {e}")
                # Continue to regular download fallback
        
        # TRY 3: Regular file download
        print(f"🔄 Trying regular download for: {url}")
        return download_regular_file_internal(url, download_id)
        
    except Exception as e:
        download_progress[download_id] = {
            'status': 'error',
            'error': f'All download methods failed: {str(e)}',
            'url': url,
            'method': 'fallback'
        }
        raise Exception(f'All download methods failed: {e}')
     
    
def test_url_support(url):
    """Test which downloader works for a URL"""
    results = {
        'url': url,
        'yt-dlp_supported': is_ytdlp_supported(url),
        'yt-dlp_working': is_ytdlp_actually_working(url),
        'gallery-dl_supported': is_gallery_dl_supported(url),
        'recommended': None
    }
    
    if results['yt-dlp_working']:
        results['recommended'] = 'yt-dlp'
    elif results['gallery-dl_supported']:
        results['recommended'] = 'gallery-dl'
    else:
        results['recommended'] = 'direct'
    
    return results




def validate_url(url):
    """
    Comprehensive URL validation - UPDATED to support magnet URLs
    """
    import re
    from urllib.parse import urlparse
    
    # Basic checks
    if not url or not isinstance(url, str):
        return {'is_valid': False, 'error': 'URL must be a non-empty string'}
    
    # Length check
    if len(url) > 2000:
        return {'is_valid': False, 'error': 'URL too long (max 2000 characters)'}
    
    # Check for magnet URLs first (they have special handling)
    if url.startswith('magnet:'):
        # Basic magnet URL validation
        if 'xt=urn:btih:' not in url:
            return {'is_valid': False, 'error': 'Invalid magnet link - missing info hash'}
        
        # Additional magnet URL checks
        if len(url) < 50:  # Magnet URLs are usually longer
            return {'is_valid': False, 'error': 'Invalid magnet link format'}
        
        return {'is_valid': True, 'error': None}
    
    # For regular URLs, parse them
    try:
        parsed = urlparse(url)
    except Exception:
        return {'is_valid': False, 'error': 'Invalid URL format'}
    
    # Scheme validation for regular URLs
    if not parsed.scheme:
        return {'is_valid': False, 'error': 'URL must include scheme (http:// or https://)'}
    
    if parsed.scheme not in ['http', 'https']:
        return {'is_valid': False, 'error': 'Only HTTP and HTTPS protocols are supported'}
    
    # Netloc (domain) validation - skip for magnet URLs
    if not parsed.netloc:
        return {'is_valid': False, 'error': 'Invalid domain in URL'}
    
    # Domain format validation
    domain_pattern = re.compile(
        r'^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$',
        re.IGNORECASE
    )
    
    if not domain_pattern.match(parsed.netloc.split(':')[0]):
        return {'is_valid': False, 'error': 'Invalid domain format'}
    
    # Check for common malicious patterns (for regular URLs only)
    malicious_patterns = [
        r'\.\./', # Directory traversal
        r'\.\.\\', # Windows directory traversal
        r'%00', # Null byte injection
        r'%0d', # Carriage return
        r'%0a', # Line feed
        r'javascript:', # JavaScript protocol
        r'vbscript:', # VBScript protocol
        r'data:', # Data protocol
        r'file:', # File protocol
    ]
    
    for pattern in malicious_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            return {'is_valid': False, 'error': 'URL contains potentially unsafe characters'}
    
    # Check for localhost and private IPs
    local_hosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1',
        '192.168.',
        '10.',
        '172.16.',
        '172.17.',
        '172.18.',
        '172.19.',
        '172.20.',
        '172.21.',
        '172.22.',
        '172.23.',
        '172.24.',
        '172.25.',
        '172.26.',
        '172.27.',
        '172.28.',
        '172.29.',
        '172.30.',
        '172.31.',
    ]
    
    if any(parsed.netloc.startswith(host) for host in local_hosts):
        return {'is_valid': False, 'error': 'Localhost and private IP addresses are not allowed'}
    
    # Check for suspicious characters in path
    suspicious_chars = ['<', '>', '"', "'", '\\x', '\\u', '\\n', '\\r', '\\t']
    if any(char in url for char in suspicious_chars):
        return {'is_valid': False, 'error': 'URL contains suspicious characters'}
    
    # Check for excessively long paths or parameters
    if len(parsed.path) > 500:
        return {'is_valid': False, 'error': 'URL path too long'}
    
    if parsed.query and len(parsed.query) > 1000:
        return {'is_valid': False, 'error': 'URL query parameters too long'}
    
    # Check for common file extensions in direct URLs
    if not is_ytdlp_supported(url):
        file_ext_pattern = re.compile(r'\.([a-z0-9]{1,10})(?:[?#]|$)', re.IGNORECASE)
        if not file_ext_pattern.search(url):
            return {'is_valid': False, 'error': 'Direct download URL must contain a file extension'}
    
    return {'is_valid': True, 'error': None}



def detect_file_type_from_url(url):
    """
    Enhanced file type detection from URL
    Returns detailed information about the file type
    """
    import re
    from urllib.parse import urlparse
   
    # Extract filename and extension
    parsed_url = urlparse(url)
    path = parsed_url.path.lower()
    filename = path.split('/')[-1] if '/' in path else path
   
    # Common file extensions by category
    image_extensions = {
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico',
        'tiff', 'tif', 'psd', 'ai', 'eps', 'raw', 'cr2', 'nef', 'arw'
    }
   
    video_extensions = {
        'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v',
        '3gp', 'mpeg', 'mpg', 'm2v', 'm4p', 'm4b', 'f4v', 'f4p',
        'f4a', 'f4b', 'ogv', 'qt', 'rm', 'rmvb', 'asf', 'amv'
    }
   
    audio_extensions = {
        'mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a', 'aiff',
        'aif', 'ape', 'opus', 'ra', 'ram', 'mid', 'midi', 'amr'
    }
   
    document_extensions = {
        'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx',
        'ppt', 'pptx', 'csv', 'xml', 'html', 'htm', 'epub', 'mobi'
    }
   
    archive_extensions = {
        'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'dmg',
        'pkg', 'deb', 'rpm', 'msi', 'exe', 'apk', 'jar'
    }
   
    # Get file extension
    ext_match = re.search(r'\.([a-z0-9]+)(?:[?#]|$)', filename)
    file_extension = ext_match.group(1) if ext_match else None
   
    # Determine file category and details
    if file_extension:
        if file_extension in image_extensions:
            return {
                'category': 'image',
                'extension': file_extension,
                'description': f'{file_extension.upper()} image file',
                'resolution': 'Original',
                'vcodec': 'None',
                'acodec': 'None',
                'history': """
                    Digital images began in the 1960s and 1970s as simple black-and-white bitmaps
                    used mainly in research and early computer graphics, with no universal standard across
                    machines. As computers and networks improved, the need for portable, compressed images
                    grew, leading to GIF in 1987, which became the first widely adopted web image format thanks
                    to small file sizes and basic animation. In the early 1990s, JPEG revolutionized photography
                    by introducing efficient lossy compression that made sharing high-quality photos over slow
                    internet connections possible. PNG arrived in 1996 as a patent-free replacement for GIF,
                    offering lossless compression and transparency, which made it ideal for UI graphics and
                    logos. Vector graphics also emerged, especially with SVG in 1999, enabling infinitely
                    scalable images for the growing web. In the 2010s, Google introduced WebP to reduce
                    file sizes further and support both transparency and animation in a single modern format.
                    The 2020s brought next-generation formats like AVIF and JPEG XL, which deliver far better
                    compression and quality, gradually replacing older standards as browsers
                    and devices evolve.
                    """
            }
        elif file_extension in video_extensions:
            return {
                'category': 'video',
                'extension': file_extension,
                'description': f'{file_extension.upper()} video file',
                'resolution': 'Original',
                'vcodec': 'Auto',
                'acodec': 'Auto',
                'history': """
            Digital video began in the 1980s with massive uncompressed or lightly compressed
            formats like AVI and QuickTime, which required enormous storage and were mostly
            limited to professional use. In the 1990s, MPEG-1 and MPEG-2 introduced the first
            practical video compression standards, powering VCDs, DVDs, and early digital broadcasting
            by squeezing video into playable sizes. As internet usage grew, MPEG-4 and formats like
            DivX and XviD became popular for online sharing, especially in the early 2000s. The real
            breakthrough came in 2003 with H.264/AVC, which balanced quality and compression so well
            that it became the global standard for HD video on phones, cameras, and streaming sites.
            New containers like MP4 and MKV evolved alongside codecs to organize video, audio,
            subtitles, and metadata. In the 2010s, H.265/HEVC pushed compression further for 4K
            content, though licensing issues slowed adoption. This led to AV1 in 2018, a royalty-free
            modern codec supported by major tech companies and now becoming the future of web and
            streaming video.
            """
            }
        elif file_extension in audio_extensions:
            return {
                'category': 'audio',
                'extension': file_extension,
                'description': f'{file_extension.upper()} audio file',
                'resolution': 'Audio',
                'vcodec': 'None',
                'acodec': 'Auto',
                'history': """
            Digital audio started in the 1960s and 1970s with uncompressed PCM recordings stored in simple
            formats like WAV and AIFF, which preserved every sample but resulted in massive file sizes.
            As computers and the internet became more common, developers focused on shrinking audio
            without destroying quality, leading to MP3 in the early 1990s, the first format to use
            psychoacoustic modeling to remove sounds humans wouldn’t notice. MP3 exploded in
            popularity with the rise of online music and portable players. AAC followed in the
            late 1990s as a more efficient successor, offering better sound at smaller sizes
            and later becoming the standard for streaming and mobile devices. Open-source
            alternatives like OGG Vorbis and FLAC appeared around the 2000s, with FLAC
            becoming a favorite for lossless high-quality audio. In the 2010s, the Opus
            codec emerged, designed specifically for internet streaming, voice calls, and
            low-latency communication, and it’s now widely used in platforms like
            Discord and WebRTC-based apps.
            """
            }
        elif file_extension in document_extensions:
            return {
                'category': 'document',
                'extension': file_extension,
                'description': f'{file_extension.upper()} document',
                'resolution': 'Document',
                'vcodec': 'None',
                'acodec': 'None',
                 'history': """
            Digital document formats began in the 1970s and 1980s when computers needed a way to store
            structured text, leading to early plain-text files and simple word-processing formats
            tied to specific software like WordStar and early versions of Microsoft Word. As sharing
            documents between different systems became important, the 1990s introduced more
            standardized formats, including RTF from Microsoft, which aimed to preserve formatting
            across platforms. At the same time, Adobe created PDF in 1993, designed to
            perfectly preserve layout, fonts, and graphics no matter the device — a major
            breakthrough that made it the universal “final form” document type. In the 2000s,
            office software shifted to open, XML-based formats such as DOCX, XLSX, and PPTX,
            replacing the older binary formats like DOC and allowing better compression, transparency,
            and cross-compatibility. Open-source communities responded with ODT and other formats
            in the OpenDocument standard. Over time, the rise of the web pushed documents toward
            HTML and cloud-based formats like Google Docs, but PDF and DOCX remain the dominant
            standards for professional, academic, and everyday use.
            """
            }
        elif file_extension in archive_extensions:
            return {
                'category': 'archive',
                'extension': file_extension,
                'description': f'{file_extension.upper()} archive',
                'resolution': 'Archive',
                'vcodec': 'None',
                'acodec': 'None',
                "history": """
                File archiving began in the 1970s and 1980s as computers needed ways to bundle multiple
                files and compress them to save disk space and make transfers faster. Early Unix tools
                like TAR, COMPRESS, and later GZIP laid the foundation for combining files and reducing
                size through simpler algorithms. In 1989, the ZIP format introduced a convenient,
                cross-platform way to package directories, compress them with DEFLATE, and maintain
                metadata — instantly becoming the default archive format on personal computers.
                A few years later, RAR appeared with stronger compression ratios and
                multi-part archiving, becoming popular among power users despite being
                proprietary. Other tools like 7z arrived in the 1990s and 2000s with even
                more advanced algorithms (like LZMA), pushing file sizes lower than ZIP
                or RAR. As bandwidth and storage improved, archives became less about
                extreme shrinking and more about portability, encryption, error recovery,
                and easy cross-system extraction, which is why ZIP remains the universal standard
                while formats like 7z and RAR serve more specialized needs.
                """
            }
   
    # Fallback detection based on URL patterns and content hints
    url_lower = url.lower()
   
    # Check for common patterns in URL
    if any(pattern in url_lower for pattern in ['/images/', '/img/', '.jpg', '.jpeg', '.png', '.gif', '.webp']):
        return {
            'category': 'image',
            'extension': file_extension or 'img',
            'description': 'Image file',
            'resolution': 'Original',
            'vcodec': 'None',
            'acodec': 'None',
            'history': """
            Digital images began in the 1960s and 1970s as simple black-and-white bitmaps
            used mainly in research and early computer graphics, with no universal standard across
            machines. As computers and networks improved, the need for portable, compressed images
            grew, leading to GIF in 1987, which became the first widely adopted web image format thanks
            to small file sizes and basic animation. In the early 1990s, JPEG revolutionized photography
            by introducing efficient lossy compression that made sharing high-quality photos over slow
            internet connections possible. PNG arrived in 1996 as a patent-free replacement for GIF,
            offering lossless compression and transparency, which made it ideal for UI graphics and
            logos. Vector graphics also emerged, especially with SVG in 1999, enabling infinitely
            scalable images for the growing web. In the 2010s, Google introduced WebP to reduce
            file sizes further and support both transparency and animation in a single modern format.
            The 2020s brought next-generation formats like AVIF and JPEG XL, which deliver far better
            compression and quality, gradually replacing older standards as browsers
            and devices evolve.
            """
        }
    elif any(pattern in url_lower for pattern in ['/video/', '/videos/', '.mp4', '.avi', '.mkv', '.mov']):
        return {
            'category': 'video',
            'extension': file_extension or 'vid',
            'description': 'Video file',
            'resolution': 'Original',
            'vcodec': 'Auto',
            'acodec': 'Auto',
            'history': """
            Digital video began in the 1980s with massive uncompressed or lightly compressed
            formats like AVI and QuickTime, which required enormous storage and were mostly
            limited to professional use. In the 1990s, MPEG-1 and MPEG-2 introduced the first
            practical video compression standards, powering VCDs, DVDs, and early digital broadcasting
            by squeezing video into playable sizes. As internet usage grew, MPEG-4 and formats like
            DivX and XviD became popular for online sharing, especially in the early 2000s. The real
            breakthrough came in 2003 with H.264/AVC, which balanced quality and compression so well
            that it became the global standard for HD video on phones, cameras, and streaming sites.
            New containers like MP4 and MKV evolved alongside codecs to organize video, audio,
            subtitles, and metadata. In the 2010s, H.265/HEVC pushed compression further for 4K
            content, though licensing issues slowed adoption. This led to AV1 in 2018, a royalty-free
            modern codec supported by major tech companies and now becoming the future of web and
            streaming video.
            """
        }
    elif any(pattern in url_lower for pattern in ['/audio/', '/music/', '.mp3', '.wav', '.ogg', '.flac']):
        return {
            'category': 'audio',
            'extension': file_extension or 'aud',
            'description': 'Audio file',
            'resolution': 'Audio',
            'vcodec': 'None',
            'acodec': 'Auto',
            'history': """
            Digital audio started in the 1960s and 1970s with uncompressed PCM recordings stored in simple
            formats like WAV and AIFF, which preserved every sample but resulted in massive file sizes.
            As computers and the internet became more common, developers focused on shrinking audio
            without destroying quality, leading to MP3 in the early 1990s, the first format to use
            psychoacoustic modeling to remove sounds humans wouldn’t notice. MP3 exploded in
            popularity with the rise of online music and portable players. AAC followed in the
            late 1990s as a more efficient successor, offering better sound at smaller sizes
            and later becoming the standard for streaming and mobile devices. Open-source
            alternatives like OGG Vorbis and FLAC appeared around the 2000s, with FLAC
            becoming a favorite for lossless high-quality audio. In the 2010s, the Opus
            codec emerged, designed specifically for internet streaming, voice calls, and
            low-latency communication, and it’s now widely used in platforms like
            Discord and WebRTC-based apps.
            """
        }
    elif any(pattern in url_lower for pattern in ['/documents/', '/files/', '.pdf', '.doc', '.docx', '.txt']):
        return {
            'category': 'document',
            'extension': file_extension or 'doc',
            'description': 'Document file',
            'resolution': 'Document',
            'vcodec': 'None',
            'acodec': 'None',
            'history': """
            Digital document formats began in the 1970s and 1980s when computers needed a way to store
            structured text, leading to early plain-text files and simple word-processing formats
            tied to specific software like WordStar and early versions of Microsoft Word. As sharing
            documents between different systems became important, the 1990s introduced more
            standardized formats, including RTF from Microsoft, which aimed to preserve formatting
            across platforms. At the same time, Adobe created PDF in 1993, designed to
            perfectly preserve layout, fonts, and graphics no matter the device — a major
            breakthrough that made it the universal “final form” document type. In the 2000s,
            office software shifted to open, XML-based formats such as DOCX, XLSX, and PPTX,
            replacing the older binary formats like DOC and allowing better compression, transparency,
            and cross-compatibility. Open-source communities responded with ODT and other formats
            in the OpenDocument standard. Over time, the rise of the web pushed documents toward
            HTML and cloud-based formats like Google Docs, but PDF and DOCX remain the dominant
            standards for professional, academic, and everyday use.
            """
        }
   
    # Default fallback
    return {
        'category': 'file',
        'extension': file_extension or 'bin',
        'description': 'Generic file',
        'resolution': 'Original',
        'vcodec': 'Auto',
        'acodec': 'Auto'
    }

def progress_hook(d, download_id):
    """Progress hook that updates global progress state and sends WebSocket updates"""
    try:
        if d['status'] == 'downloading':
            # Calculate percentage if total size is known
            if 'total_bytes' in d and d['total_bytes']:
                percent = (d.get('downloaded_bytes', 0) / d['total_bytes']) * 100
            elif 'total_bytes_estimate' in d and d['total_bytes_estimate']:
                percent = (d.get('downloaded_bytes', 0) / d['total_bytes_estimate']) * 100
            else:
                percent = 0
               
            progress_data = {
                'status': 'downloading',
                'percent': round(percent, 1),
                'downloaded_bytes': d.get('downloaded_bytes', 0),
                'total_bytes': d.get('total_bytes') or d.get('total_bytes_estimate'),
                'speed': d.get('speed'),
                'eta': d.get('eta'),
                'filename': d.get('filename', ''),
                'method': download_progress.get(download_id, {}).get('method', 'yt-dlp'),
                'can_pause': download_progress.get(download_id, {}).get('can_pause', False),
                'resumable': download_progress.get(download_id, {}).get('resumable', False)
            }
           
            # Update or create the download progress entry
            if download_id in download_progress:
                download_progress[download_id].update(progress_data)
            else:
                download_progress[download_id] = progress_data
           
            # Send WebSocket update - FIXED: Use thread-safe method
            try:
                # Use the thread-safe function instead of trying to get event loop in thread
                if main_event_loop:
                    asyncio.run_coroutine_threadsafe(
                        system_status_websocket.send_download_update(download_id, progress_data),
                        main_event_loop
                    )
                else:
                    # Fallback to system_status_websocket's thread-safe method
                    system_status_websocket.send_download_update_thread_safe(download_id, progress_data)
            except Exception as e:
                print(f"Error sending WebSocket update: {e}")
               
        elif d['status'] == 'finished':
            progress_data = {
                'status': 'finished',
                'percent': 100,
                'filename': d.get('filename', ''),
                'method': download_progress.get(download_id, {}).get('method', 'yt-dlp')
            }           
            if download_id in download_progress:
                download_progress[download_id].update(progress_data)
            else:
                download_progress[download_id] = progress_data
           
            # Send final update - FIXED: Use thread-safe method
            try:
                if main_event_loop:
                    asyncio.run_coroutine_threadsafe(
                        system_status_websocket.send_download_update(download_id, progress_data),
                        main_event_loop
                    )
                else:
                    system_status_websocket.send_download_update_thread_safe(download_id, progress_data)
            except Exception as e:
                print(f"Error sending finished WebSocket update: {e}")
           
            print(f"Progress hook: Download finished for {download_id}, filename: {d.get('filename', '')}")
           
        elif d['status'] == 'error':
            progress_data = {
                'status': 'error',
                'error': str(d.get('error', 'Unknown error')),
                'method': download_progress.get(download_id, {}).get('method', 'yt-dlp')
            }
           
            if download_id in download_progress:
                download_progress[download_id].update(progress_data)
            else:
                download_progress[download_id] = progress_data
           
            # Send error update - FIXED: Use thread-safe method
            try:
                if main_event_loop:
                    asyncio.run_coroutine_threadsafe(
                        system_status_websocket.send_download_update(download_id, progress_data),
                        main_event_loop
                    )
                else:
                    system_status_websocket.send_download_update_thread_safe(download_id, progress_data)
            except Exception as e:
                print(f"Error sending error WebSocket update: {e}")
               
    except Exception as e:
        print(f"Error in progress_hook: {e}")
        
        
      
def save_completed_download_to_history(download_id, url, format_id, final_format, final_filename, is_redownload=False, original_entry=None):
    """Save completed download to history"""
    try:
        if not final_filename or not os.path.exists(final_filename):
            print(f"❌ File not found: {final_filename}")
            return False
       
        # Check if it's a final file (not temporary)
        if (final_filename.endswith('.part') or
            '.frag' in final_filename or
            'temp' in final_filename.lower() or
            any(ext in final_filename.lower() for ext in ['.m4a', '.webm', '.audio', '_audio'])):
            print(f"❌ Skipping temporary file: {final_filename}")
            return False
       
        file_size = os.path.getsize(final_filename)
        print(f"💾 Saving to history: {os.path.basename(final_filename)} ({file_size} bytes)")
       
        if is_redownload and original_entry:
            # For redownloads, create a new entry but reference the original
            download_entry = DownloadHistory(
                filename=os.path.basename(final_filename),
                original_url=url,
                download_path=final_filename,
                file_size=file_size,
                format_info=original_entry.format_info,
                status='completed'
            )
        else:
            # For new downloads
            download_entry = DownloadHistory(
                filename=os.path.basename(final_filename),
                original_url=url,
                download_path=final_filename,
                file_size=file_size,
                format_info={
                    'format_id': format_id,
                    'final_format': final_format,
                    'is_audio': 'audio' in format_id.lower()
                },
                status='completed'
            )
       
        download_entry.save()
       
        # Mark as saved to prevent duplicates
        download_progress[download_id]['history_saved'] = True
        print(f"✅ Successfully saved to DownloadHistory: {os.path.basename(final_filename)}")
        return True
       
    except Exception as e:
        print(f"❌ Error saving to DownloadHistory: {e}")
        return False



def download_with_ytdlp_internal(url, format_id, download_id):
    """Internal yt-dlp download function (separated for fallback)"""
    final_format = resolve_format_with_audio(format_id)
    opts = {
        'format': final_format,
        'merge_output_format': 'mp4',
        'quiet': True,
        'noplaylist': True,
        'progress_hooks': [lambda d: progress_hook(d, download_id)],
        'outtmpl': ydl_opts.get('outtmpl', f'{download_folder}/%(title)s.%(ext)s'),
    }
    
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
        title = info.get('title', url.split("/")[-1])
        
        print(f"Downloading with yt-dlp: {title}")
        
        result = ydl.extract_info(url, download=True)
        
        if result and '_filename' in result:
            save_completed_download_to_history(
                download_id=download_id,
                url=url,
                format_id=format_id,
                final_format=final_format,
                final_filename=result['_filename']
            )
    
    return True



def is_ytdlp_supported(url):
    """Check if URL is supported by yt-dlp (but may fail at runtime)"""
    if not url:
        return False
    
    # Common file extensions that should use direct download
    file_extensions = [
        '.pdf', '.zip', '.rar', '.exe', '.msi', '.dmg', '.pkg',
        '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg',
        '.mp3', '.wav', '.flac', '.aac', '.ogg',
        '.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'
    ]
    
    # If URL ends with common file extension, treat as direct download
    if any(url.lower().endswith(ext) for ext in file_extensions):
        return False
    
    # Check if URL pattern matches known yt-dlp sites
    from . import ytdlpsupported
    return any(site in url.lower() for site in ytdlpsupported.ytdlp_sites)

def is_ytdlp_actually_working(url):
    """Actually test if yt-dlp can extract info from this URL"""
    try:
        ydl = yt_dlp.YoutubeDL({
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': True
        })
        info = ydl.extract_info(url, download=False)
        
        # Check if we got valid formats
        if info and info.get('formats'):
            return True
        
        # Some sites return direct URLs without formats list
        if info and (info.get('url') or info.get('direct')):
            return True
            
        return False
    except:
        return False

def get_formats_with_fallback(url: str):
    """Get formats with fallback: torrent → yt-dlp → gallery-dl → regular"""
    
    # First check if it's a playlist
    playlist_info = get_playlist_info(url)
    if playlist_info and playlist_info['is_playlist']:
        print(f"🎵 Detected playlist: {playlist_info['playlist_title']} ({playlist_info['video_count']} videos)")
        
        # Return playlist structure
        return {
            'formats': [],  # No format list for playlist overview
            'is_playlist': True,
            'playlist_info': playlist_info,
            'is_direct_download': False,
            'supported_platform': True,
            'thumbnail': None,
            'thumbnails': [],
            'title': playlist_info['playlist_title'],
            'extractor': 'yt-dlp',
            'success': True
        }
    
    # Continue with original logic if not a playlist...
    # TRY 0: Torrent/magnet URL (NEW ADDITION)
    if is_magnet_url(url) or url.lower().endswith('.torrent'):
        try:
            print(f"🔄 Detected torrent/magnet URL: {url}")
            
            if is_magnet_url(url):
                torrent_info = parse_magnet_info(url)
                if torrent_info:
                    return {
                        'formats': [{
                            'format_id': 'torrent',
                            'ext': 'torrent',
                            'resolution': 'Torrent',
                            'fps': 'N/A',
                            'filesize': 'Unknown',
                            'thumbnail': None,
                            'thumbnails': [],
                            'tbr': 'N/A',
                            'protocol': 'bittorrent',
                            'vcodec': 'N/A',
                            'acodec': 'N/A',
                            'abr': 'N/A',
                            'asr': 'N/A',
                            'note': f'Torrent: {torrent_info.get("name", "Magnet Link")}',
                            'language': 'N/A',
                            'dynamic_range': '',
                            'quality': 1,
                            'is_direct': True,
                            'type': 'torrent',
                            'torrent_info': torrent_info
                        }],
                        'is_direct_download': False,
                        'supported_platform': True,
                        'thumbnail': None,
                        'thumbnails': [],
                        'title': torrent_info.get('name', 'Torrent Download'),
                        'extractor': 'torrent',
                        'success': True
                    }
            else:
                # .torrent file URL
                torrent_info = {
                    'type': 'torrent',
                    'name': url.split('/')[-1].replace('.torrent', ''),
                    'info_hash': 'Unknown',
                    'total_size': 'Unknown',
                    'files': []
                }
                
                return {
                    'formats': [{
                        'format_id': 'torrent',
                        'ext': 'torrent',
                        'resolution': 'Torrent',
                        'fps': 'N/A',
                        'filesize': 'Unknown',
                        'thumbnail': None,
                        'thumbnails': [],
                        'tbr': 'N/A',
                        'protocol': 'bittorrent',
                        'vcodec': 'N/A',
                        'acodec': 'N/A',
                        'abr': 'N/A',
                        'asr': 'N/A',
                        'note': f'Torrent File: {torrent_info["name"]}',
                        'language': 'N/A',
                        'dynamic_range': '',
                        'quality': 1,
                        'is_direct': True,
                        'type': 'torrent',
                        'torrent_info': torrent_info
                    }],
                    'is_direct_download': False,
                    'supported_platform': True,
                    'thumbnail': None,
                    'thumbnails': [],
                    'title': torrent_info['name'],
                    'extractor': 'torrent',
                    'success': True
                }
        
        except Exception as e:
            print(f"❌ Torrent handling failed: {e}")
            # Continue to other methods
    
    # TRY 1: yt-dlp (if it actually works)
    if is_ytdlp_supported(url) and is_ytdlp_actually_working(url):
        try:
            ydl = yt_dlp.YoutubeDL({'quiet': True})
            info = ydl.extract_info(url, download=False)
            
            # Build formats list
            formats_list = []
            thumbnail = info.get('thumbnail')
            thumbnails = info.get('thumbnails', [])
            
            for f in info.get('formats', []):
                size = f.get('filesize') or f.get('filesize_approx')
                
                formats_list.append({
                    'format_id': f.get("format_id"),
                    'ext': f.get('ext', '—'),
                    'resolution': f.get('resolution') or (f'{f.get("height")}p' if f.get('height') else None) or 'Audio',
                    'fps': f.get('fps'),
                    'filesize': size,
                    "thumbnail": thumbnail,
                    "thumbnails": thumbnails,
                    'tbr': str(f.get('tbr'))+"k",
                    'protocol': f.get('protocol'),
                    'vcodec': f.get('vcodec', 'none'),
                    'acodec': f.get('acodec', 'none'),
                    'abr': f.get('abr'),
                    'asr': f.get('asr'),
                    'note': f.get('format_note') or '',
                    'language': f.get('language') or 'None',
                    'dynamic_range': f.get('dynamic_range') or '',
                    'quality': f.get('quality'),
                    'is_direct': False
                })
            
            return {
                'formats': formats_list,
                'is_direct_download': False,
                'supported_platform': True,
                'thumbnail': thumbnail,
                'thumbnails': thumbnails,
                'title': info.get('title', 'Unknown'),
                'extractor': 'yt-dlp',
                'success': True
            }
        except Exception as e:
            print(f"yt-dlp failed, trying gallery-dl: {e}")
    
    # TRY 2: gallery-dl
    if is_gallery_dl_supported(url):
        try:
            gallery_info = get_gallery_dl_info(url)
            
            if gallery_info:
                thumbnail = gallery_info.get('thumbnail')
                thumbnails = gallery_info.get('thumbnails', [])
                title = gallery_info.get('title', 'Gallery Download')
                
                formats_list = []
                for i, format_info in enumerate(gallery_info.get('formats', [])):
                    url = format_info.get('url', '')
                    filename = os.path.basename(url.split('?')[0]) if url else 'unknown'
                    
                    formats_list.append({
                        'format_id': f'gallery_dl_{i}',
                        'ext': format_info.get('ext', get_extension_from_filename(filename)),
                        'resolution': format_info.get('resolution', 'Original'),
                        'fps': format_info.get('fps'),
                        'filesize': format_info.get('filesize'),
                        'thumbnail': thumbnail,
                        'thumbnails': thumbnails,
                        'tbr': format_info.get('tbr'),
                        'protocol': format_info.get('protocol', 'https'),
                        'vcodec': format_info.get('vcodec', 'none'),
                        'acodec': format_info.get('acodec', 'none'),
                        'abr': format_info.get('abr'),
                        'asr': format_info.get('asr'),
                        'note': f'Gallery-dl: {gallery_info.get("extractor", "direct")}',
                        'language': 'Unknown',
                        'dynamic_range': '',
                        'quality': 1,
                        'url': url,
                        'filename': filename,
                        'is_direct': True
                    })
                
                return {
                    'formats': formats_list,
                    'is_direct_download': True,
                    'supported_platform': True,
                    'thumbnail': thumbnail,
                    'thumbnails': thumbnails,
                    'title': title,
                    'extractor': gallery_info.get('extractor', 'gallery-dl'),
                    'direct_urls': gallery_info.get('direct_urls', []),
                    '_type': gallery_info.get('_type', 'image'),
                    'success': True
                }
        except Exception as e:
            print(f"gallery-dl failed: {e}")
    
    # TRY 3: Regular file
    try:
        file_type = detect_file_type_from_url(url)
        thumbnail = url if any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']) else None
        
        formats_list = [{
            'format_id': 'direct',
            'ext_expose': file_type['category'],
            'ext': file_type['extension'].upper() if file_type['extension'] else 'Auto',
            'resolution': file_type.get('resolution', 'Original'),
            'fps': 'Unknown',
            "thumbnail": thumbnail,
            'filesize': 'Unknown',
            'tbr': 'Unknown',
            'protocol': 'http',
            'vcodec': file_type.get('vcodec', 'Auto'),
            'acodec': file_type.get('acodec', 'Auto'),
            'abr': 'Unknown',
            'asr': 'Unknown',
            'note': f'Direct download - {file_type["description"]}',
            'language': 'Unknown',
            'dynamic_range': '',
            'quality': 1,
            'is_direct': True
        }]
        
        return {
            'formats': formats_list,
            'is_direct_download': True,
            'supported_platform': False,
            'thumbnail': thumbnail,
            'thumbnails': [{'url': thumbnail}] if thumbnail else [],
            'title': url.split('/')[-1] or 'Download',
            'file_type': file_type,
            'extractor': 'direct',
            'success': True
        }
    except Exception as e:
        print(f"All methods failed: {e}")
        raise Exception(f'All download methods failed: {e}')
    
    

def download_regular_file_internal(url, download_id):
    """Internal regular file download function"""
    # Generate filename from URL
    filename_from_url = url.split('/')[-1] or f"download_{int(time.time())}"
    if '.' not in filename_from_url:
        filename_from_url += '.download'
    
    download_path = os.path.join(download_folder, filename_from_url)
    
    # Store original URL for progress tracking
    download_progress[download_id] = {
        'status': 'starting',
        'percent': 0,
        'filename': download_path,
        'original_url': url,
        'method': 'direct',
        'can_pause': True,
        'resumable': True
    }
    
    # Run async download
    def async_download_wrapper():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(
                download_regular_file_async(url, download_path, download_id)
            )
            
            # Save to history after completion
            if download_progress[download_id].get('status') == 'finished':
                save_regular_file_to_history(download_id, url, download_path)
                
        except Exception as e:
            print(f"Async download error: {e}")
        finally:
            loop.close()
    
    thread = threading.Thread(target=async_download_wrapper, daemon=True)
    thread.start()
    
    return True


def cleanup_old_uploads():
    """Clean up uploaded torrents older than 1 hour"""
    try:
        with uploaded_torrents_lock:
            current_time = time.time()
            to_delete = []
            
            for upload_id, info in uploaded_torrents.items():
                if current_time - info['timestamp'] > 3600:  # 1 hour
                    to_delete.append(upload_id)
                    # Delete temp file
                    try:
                        if os.path.exists(info['path']):
                            os.remove(info['path'])
                            print(f"🧹 Cleaned up expired upload: {info['name']}")
                    except:
                        pass
            
            # Remove from dictionary
            for upload_id in to_delete:
                uploaded_torrents.pop(upload_id, None)
                
    except Exception as e:
        print(f"Error cleaning up old uploads: {e}")


def get_playlist_info(url: str):
    """Extract playlist information including all videos"""
    try:
        ydl_opts = {
            'ignoreerrors': True,
            'quiet': True,
            'extract_flat': True,  # Only get video info, no download yet
            'skip_download': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            playlist_info = ydl.extract_info(url, download=False)
            
            if not playlist_info:
                return None
            
            # Check if it's a playlist
            is_playlist = playlist_info.get('_type') == 'playlist'
            playlist_title = playlist_info.get('title', 'Untitled Playlist')
            playlist_id = playlist_info.get('id')
            video_count = playlist_info.get('playlist_count', len(playlist_info.get('entries', [])))
            
            videos = []
            entries = playlist_info.get('entries', [])
            
            for idx, video in enumerate(entries):
                if not video:
                    continue
                    
                video_id = video.get('id')
                video_url = f"https://www.youtube.com/watch?v={video_id}" if video_id else video.get('url')
                video_title = video.get('title', f'Video {idx + 1}')
                video_duration = video.get('duration')
                
                # Get thumbnail if available
                thumbnail = video.get('thumbnail')
                thumbnails = video.get('thumbnails', [])
                
                # Try to get basic format info without full extraction
                formats_info = []
                if 'formats' in video:
                    for f in video.get('formats', [])[:5]:  # Limit to 5 formats for preview
                        formats_info.append({
                            'format_id': f.get('format_id'),
                            'ext': f.get('ext'),
                            'resolution': f.get('resolution') or f.get('format_note'),
                            'filesize': f.get('filesize'),
                            'vcodec': f.get('vcodec'),
                            'acodec': f.get('acodec')
                        })
                
                videos.append({
                    'index': idx + 1,
                    'id': video_id,
                    'title': video_title,
                    'url': video_url,
                    'duration': video_duration,
                    'thumbnail': thumbnail,
                    'thumbnails': thumbnails,
                    'formats_preview': formats_info,
                    'has_detailed_formats': False  # Will be fetched when user expands
                })
            
            return {
                'is_playlist': is_playlist,
                'playlist_title': playlist_title,
                'playlist_id': playlist_id,
                'video_count': video_count,
                'videos': videos,
                'url': url
            }
            
    except Exception as e:
        print(f"Error getting playlist info: {e}")
        return None


@csrf_exempt
def icyiganza(request):
    try:
        import time
        
        # Add a small delay to prevent rapid toggling
        time.sleep(0.3)
        
        if system_status_websocket.gesture_running:
            # Stop gesture tracking
            print("API: Stopping gesture tracking...")
            success = system_status_websocket.stop_gesture_tracking()
            
            # Wait for cleanup
            time.sleep(1.5)
            
            if success:
                return JsonResponse({
                    "status": 'stopped', 
                    "message": "Gesture tracking stopped",
                    "gesture_running": False
                })
            else:
                return JsonResponse({
                    "status": 'error', 
                    "message": "Failed to stop gesture tracking",
                    "gesture_running": False
                })
        else:
            # Start gesture tracking
            print("API: Starting gesture tracking...")
            success = system_status_websocket.start_gesture_tracking()
            
            # Wait for initialization
            time.sleep(1.5)
            
            # Check current state
            current_state = system_status_websocket.gesture_running
            
            if success and current_state:
                return JsonResponse({
                    'status': 'running', 
                    "message": "Gesture tracking started",
                    "gesture_running": True
                })
            else:
                # Clean up if failed
                system_status_websocket.stop_gesture_tracking()
                return JsonResponse({
                    'status': 'error', 
                    "message": "Gesture tracking failed to start. Camera may be in use.",
                    "gesture_running": False
                })
    except Exception as e:
        print(f"Error in icyiganza view: {e}")
        return JsonResponse({
            "status": 'error', 
            "message": f"Server error: {str(e)}",
            "gesture_running": False
        })  


@csrf_exempt
def get_playlist_video_formats(request):
    """Get detailed formats for a specific video in a playlist"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            video_url = clean_url(data.get('video_url'))
            
            if not video_url:
                return JsonResponse({'error': 'Video URL required'}, status=400)
            
            # Get detailed formats for this single video
            ydl = yt_dlp.YoutubeDL({'quiet': True})
            info = ydl.extract_info(video_url, download=False)
            
            formats_list = []
            thumbnail = info.get('thumbnail')
            thumbnails = info.get('thumbnails', [])
            
            for f in info.get('formats', []):
                size = f.get('filesize') or f.get('filesize_approx')
                
                formats_list.append({
                    'format_id': f.get("format_id"),
                    'ext': f.get('ext', '—'),
                    'resolution': f.get('resolution') or (f'{f.get("height")}p' if f.get('height') else None) or 'Audio',
                    'fps': f.get('fps'),
                    'filesize': size,
                    "thumbnail": thumbnail,
                    "thumbnails": thumbnails,
                    'tbr': str(f.get('tbr'))+"k",
                    'protocol': f.get('protocol'),
                    'vcodec': f.get('vcodec', 'none'),
                    'acodec': f.get('acodec', 'none'),
                    'abr': f.get('abr'),
                    'asr': f.get('asr'),
                    'note': f.get('format_note') or '',
                    'language': f.get('language') or 'None',
                    'dynamic_range': f.get('dynamic_range') or '',
                    'quality': f.get('quality'),
                    'is_direct': False
                })
            
            return JsonResponse({
                'success': True,
                'formats': formats_list,
                'video_title': info.get('title', 'Unknown'),
                'video_url': video_url,
                'thumbnail': thumbnail,
                'thumbnails': thumbnails,
                'duration': info.get('duration'),
                'channel': info.get('channel'),
                'upload_date': info.get('upload_date')
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Failed to get video formats: {str(e)}'}, status=400)
    
    return JsonResponse({'error': 'POST method required'}, status=405)



@csrf_exempt
def formats(request):
    """Handle file uploads and URL formats - Returns formats for user to select"""
    if request.method == 'POST':
        try:
            # Check if it's a file upload
            if request.FILES and 'file' in request.FILES:
                print(f"📁 File upload detected in formats endpoint")
                torrent_file = request.FILES['file']
                
                # Check if it's a torrent file
                if not torrent_file.name.lower().endswith('.torrent'):
                    return JsonResponse({
                        'error': 'Only .torrent files are supported'
                    }, status=400)
                
                # Save uploaded file temporarily
                temp_dir = tempfile.gettempdir()
                upload_id = f"upload_{int(time.time())}_{hashlib.md5(torrent_file.name.encode()).hexdigest()[:8]}"
                temp_path = os.path.join(temp_dir, f'{upload_id}.torrent')
                
                print(f"💾 Saving uploaded torrent to: {temp_path}")
                
                with open(temp_path, 'wb+') as destination:
                    for chunk in torrent_file.chunks():
                        destination.write(chunk)
                
                # Get torrent info
                torrent_info = get_torrent_info_from_file(temp_path)
                
                if not torrent_info:
                    # Clean up temp file
                    try:
                        os.remove(temp_path)
                    except:
                        pass
                    return JsonResponse({'error': 'Failed to parse torrent file'}, status=400)
                
                print(f"✅ Torrent parsed: {torrent_info.get('name', 'Unknown')}")
                print(f"📊 Torrent files: {torrent_info.get('files', [])}")
                print(f"📊 File count: {len(torrent_info.get('files', []))}")
                print(f"📊 Total size (bytes): {torrent_info.get('total_size', 0)}")
                
                # Store in global storage with timestamp
                with uploaded_torrents_lock:
                    uploaded_torrents[upload_id] = {
                        'path': temp_path,
                        'timestamp': time.time(),
                        'name': torrent_file.name,
                        'torrent_info': torrent_info  # Store the full torrent info
                    }
                
                # Clean old uploads (older than 1 hour)
                cleanup_old_uploads()
                
                # Get file count
                file_count = len(torrent_info.get('files', []))
                total_size = torrent_info.get('total_size', 0)
                
                # Return formats information
                return JsonResponse({
                    'formats': [{
                        'format_id': 'torrent',
                        'ext': 'torrent',
                        'resolution': 'Torrent',
                        'fps': 'N/A',
                        'filesize': total_size,  # MUST be a number, not string!
                        'thumbnail': None,
                        'thumbnails': [],
                        'tbr': 'N/A',
                        'protocol': 'bittorrent',
                        'vcodec': 'N/A',
                        'acodec': 'N/A',
                        'abr': 'N/A',
                        'asr': 'N/A',
                        'note': f'Uploaded Torrent: {torrent_info.get("name", "Torrent File")}',
                        'language': 'N/A',
                        'dynamic_range': '',
                        'quality': 1,
                        'is_direct': True,
                        'type': 'torrent',
                        'torrent_info': torrent_info,  # Include full torrent info
                        'upload_id': upload_id,
                        'file_count': file_count,  # This should be a number
                        'files': torrent_info.get('files', [])  # Include files array
                    }],
                    'is_direct_download': False,
                    'supported_platform': True,
                    'thumbnail': None,
                    'thumbnails': [],
                    'title': torrent_info.get('name', 'Torrent Download'),
                    'extractor': 'torrent',
                    'success': True,
                    'is_file_upload': True,
                    'uploaded_filename': torrent_file.name,
                    'upload_id': upload_id,
                    'total_size': total_size,  # Number, not string
                    'file_list': torrent_info.get('files', []),
                    'file_count': file_count  # Also include at top level
                })
            
            
            # Handle URL-based requests (existing logic)
            try:
                data = json.loads(request.body)
            except (json.JSONDecodeError, ValueError) as e:
                return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)
            
            url = data.get('url')
            if not url:
                return JsonResponse({'error': 'URL missing'}, status=400)
            
            # Clean and validate URL
            url = clean_url(url)
            if not url:
                return JsonResponse({'error': 'Invalid URL provided'}, status=400)
            
            # Validate URL
            validation_result = validate_url(url)
            if not validation_result['is_valid']:
                return JsonResponse({'error': validation_result['error']}, status=400)
            
            try:
                result = get_formats_with_fallback(url)
                return JsonResponse(result)
                
            except Exception as e:
                return JsonResponse({
                    'error': f'Failed to get formats: {str(e)}',
                    'url': url,
                    'success': False
                }, status=400)
                
        except Exception as e:
            print(f"❌ Exception in formats: {e}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'POST method required'}, status=405)
        
        

def download_with_ytdlp(request, download_id, url, format_id):
    """Your existing yt-dlp download function"""
    download_title = url.split("/")[-1]
    download_progress[download_id] = {
        'original_url': url,
        'format_info': {
            'format_id': format_id,
            'final_format': resolve_format_with_audio(format_id),
            'is_audio': 'audio' in format_id.lower()
        },
        'history_saved': False,
        'method': 'yt-dlp',
        'can_pause': False, # yt-dlp doesn't support pause/resume
        'resumable': False
    }
    def download_thread():
        final_format = resolve_format_with_audio(format_id)
        opts = {
            'format': final_format,
            'merge_output_format': 'mp4',
            'quiet': True,
            'noplaylist': True,
            'progress_hooks': [lambda d: progress_hook(d, download_id)],
            'outtmpl': ydl_opts.get('outtmpl', f'{download_folder}/%(title)s.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
            }],
        }
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
                title = info.get('title') if info.get("title") else url.split("/")[-1]
                download_title = title
                print(f"Downloading: {title} with format {final_format}")
               
                result = ydl.extract_info(url, download=True)
               
                print(f"Download completed for: {title}")
               
                if result and '_filename' in result:
                    final_filename = result['_filename']
                    saved = save_completed_download_to_history(
                        download_id=download_id,
                        url=url,
                        format_id=format_id,
                        final_format=final_format,
                        final_filename=final_filename
                    )
                    if saved:
                        print(f"✅ Successfully saved '{title}' to DownloadHistory")
                    else:
                        print(f"❌ Failed to save '{title}' to DownloadHistory")
                        alternative_filename = find_downloaded_file(title)
                        if alternative_filename:
                            saved = save_completed_download_to_history(
                                download_id=download_id,
                                url=url,
                                format_id=format_id,
                                final_format=final_format,
                                final_filename=alternative_filename
                            )
                else:
                    alternative_filename = find_downloaded_file(title)
                    if alternative_filename:
                        saved = save_completed_download_to_history(
                            download_id=download_id,
                            url=url,
                            format_id=format_id,
                            final_format=final_format,
                            final_filename=alternative_filename
                        )
                       
        except Exception as e:
            download_progress[download_id] = {
                'status': 'error',
                'error': str(e),
                "url": url
            }
            print(f"Download error: {e}")
    thread = threading.Thread(target=download_thread, daemon=True)
    thread.start()
    return JsonResponse({
        'status': 'started',
        'download_id': download_id,
        'message': 'Download started',
        "download_title": download_title,
        'method': 'yt-dlp',
        'can_pause': False
    })
def save_regular_file_to_history(download_id, url, filepath):
    """Save completed regular file download to history"""
    try:
        if not filepath or not os.path.exists(filepath):
            print(f"❌ Regular file not found: {filepath}")
            return False
       
        file_size = os.path.getsize(filepath)
        filename = os.path.basename(filepath)
       
        print(f"💾 Saving regular file to history: {filename} ({file_size} bytes)")
       
        download_entry = DownloadHistory(
            filename=filename,
            original_url=url,
            download_path=filepath,
            file_size=file_size,
            format_info={
                'method': 'async_downloader',
                'is_regular_file': True,
                'resumable': True,
                'can_pause': True
            },
            status='completed'
        )
       
        download_entry.save()
       
        # Mark as saved to prevent duplicates
        if download_id in download_progress:
            download_progress[download_id]['history_saved'] = True
           
        print(f"✅ Successfully saved regular file to DownloadHistory: {filename}")
        return True
       
    except Exception as e:
        print(f"❌ Error saving regular file to DownloadHistory: {e}")
        return False
def download_regular_file(request, download_id, url):
    """Download regular files using async downloader"""
    try:
        # Generate filename from URL
        filename_from_url = url.split('/')[-1] or f"download_{int(time.time())}"
        if '.' not in filename_from_url:
            # Try to get extension from Content-Type or use generic
            filename_from_url += '.download'
           
        download_path = os.path.join(download_folder, filename_from_url)
       
        # Store original URL for resume capability
        download_progress[download_id] = {
            'status': 'starting',
            'percent': 0,
            'filename': download_path,
            'original_url': url,
            'method': 'direct',
            'can_pause': True,
            'resumable': True
        }
        def async_download_wrapper():
            """Wrapper to run async download in thread"""
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                loop.run_until_complete(
                    download_regular_file_async(url, download_path, download_id)
                )
               
                # Save to history after completion
                if download_progress[download_id].get('status') == 'finished':
                    save_regular_file_to_history(download_id, url, download_path)
                   
            except Exception as e:
                print(f"Async download error: {e}")
            finally:
                loop.close()
        thread = threading.Thread(target=async_download_wrapper, daemon=True)
        thread.start()
        return JsonResponse({
            'status': 'started',
            'download_id': download_id,
            'message': 'Direct download started',
            'download_title': filename_from_url,
            'method': 'direct',
            'can_pause': True,
            'resumable': True
        })
       
    except Exception as e:
        return JsonResponse({'error': f'Download failed: {str(e)}'}, status=500)
def find_downloaded_file(title):
    """Find the downloaded file by title in the downloads folder"""
    try:
        downloads_dir = os.path.expanduser('~/Downloads')
        if not os.path.exists(downloads_dir):
            return None
           
        # Look for files that might match our title
        for filename in os.listdir(downloads_dir):
            filepath = os.path.join(downloads_dir, filename)
            if (os.path.isfile(filepath) and
                not filename.endswith('.part') and
                not '.frag' in filename and
                not 'temp' in filename.lower()):
               
                # Check if filename contains part of the title
                clean_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
                if clean_title and any(word.lower() in filename.lower() for word in clean_title.split()[:3]):
                    return filepath
                   
                # Also check for recent files (last 2 minutes)
                if os.path.getmtime(filepath) > time.time() - 120:
                    return filepath
                   
    except Exception as e:
        print(f"Error finding downloaded file: {e}")
   
    return None


@csrf_exempt
def progress(request, download_id):
    """Works for yt-dlp, regular file downloads, and torrents"""
    if download_id in download_progress:
        progress_data = download_progress[download_id].copy()
        
        # Add method-specific info
        method = progress_data.get('method', '')
        
        if method == 'direct':
            progress_data.update({
                'can_pause': True,
                'resumable': True,
                'type': 'regular_file'
            })
        elif method == 'torrent':
            progress_data.update({
                'can_pause': True,
                'resumable': True,
                'type': 'torrent'
            })
        else:
            progress_data.update({
                'can_pause': False,
                'resumable': False,
                'type': 'media_file'
            })
        
        return JsonResponse(progress_data)
    else:
        return JsonResponse({'error': 'Download not found'}, status=404)
    
    
@csrf_exempt
def progress_stream(request, download_id):
    """Server-Sent Events - works for both download types"""
    def event_stream():
        while True:
            if download_id in download_progress:
                progress_data = download_progress[download_id].copy()
               
                # Add method info
                if progress_data.get('method') == 'direct':
                    progress_data.update({
                        'can_pause': True,
                        'resumable': True
                    })
                else:
                    progress_data.update({
                        'can_pause': False,
                        'resumable': False
                    })
               
                yield f"data: {json.dumps(progress_data)}\n\n"
               
                if progress_data['status'] in ['finished', 'error', 'paused', 'cancelled']:
                    break
            time.sleep(1)
   
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    return response


@csrf_exempt
def list_downloads(request):
    """List all files in the downloads directory"""
    downloads_dir = os.path.expanduser(Path.home() / 'Downloads')
   
    # Create downloads directory if it doesn't exist
    if not os.path.exists(downloads_dir):
        os.makedirs(downloads_dir)
   
    files = []
    try:
        for filename in os.listdir(downloads_dir):
            filepath = os.path.join(downloads_dir, filename)
            if os.path.isfile(filepath):
                stat = os.stat(filepath)
                files.append({
                    'filename': filename,
                    'size': stat.st_size,
                    'modified': stat.st_mtime,
                    'filepath': filepath
                })
       
        # Sort by modification time (newest first)
        files.sort(key=lambda x: x['modified'], reverse=True)
       
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
   
    return JsonResponse({'files': files})
@csrf_exempt
def delete_download(request, filename):
    """Delete a downloaded file"""
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE method required'}, status=405)
   
    downloads_dir = os.path.expanduser('~/Downloads')
    filepath = os.path.join(downloads_dir, filename)
   
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            return JsonResponse({'status': 'success', 'message': f'Deleted {filename}'})
        else:
            return JsonResponse({'error': 'File not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
def open_download_folder(request):
    """Open the downloads folder in file explorer"""
    downloads_dir = os.path.expanduser('~/Downloads')
   
    try:
        if not os.path.exists(downloads_dir):
            os.makedirs(downloads_dir)
       
        # Open folder based on OS
        if os.name == 'nt': # Windows
            os.startfile(downloads_dir)
        elif os.name == 'posix': # macOS, Linux
            if sys.platform == "darwin":
                subprocess.Popen(['open', downloads_dir])
            else:
                subprocess.Popen(['xdg-open', downloads_dir])
       
        return JsonResponse({'status': 'success', 'message': 'Opened downloads folder'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
def inc_internet(request):
    global ydl_opts
    ydl_opts['ratelimit'] = 1_000_000
    return JsonResponse({"status": "increased"})
@csrf_exempt
def dec_internet(request):
    global ydl_opts
    ydl_opts['ratelimit'] = 200
    return JsonResponse({"status": "decreased"})
@csrf_exempt
def download_settings(request):
    global ydl_opts
    data = json.loads(request.body)
    dl = data.get("downloadLocation")
    dt = data.get("downloadTimeout")
    ydl_opts.update({
        'outtmpl': f'{dl}/%(title)s.%(ext)s',
        'quiet': True,
        'noplaylist': True,
         "socket_timeout": dt
    })
    print(ydl_opts)
    return JsonResponse({"status": "requested"})
@csrf_exempt
def notfound(request):
    """Handle not found requests"""
    return JsonResponse({"error": "Endpoint not found"}, status=404)
@csrf_exempt
def list_home_directory(request):
    """List all files and folders in user's home directory"""
    home_dir = str(Path.home()) # Gets /home/elohe
   
    try:
        items = []
       
        for item_name in os.listdir(home_dir):
            item_path = os.path.join(home_dir, item_name)
           
            # Skip hidden files/folders
            from datetime import datetime
            item_info = {
                'name': item_name,
                'path': item_path,
                "ibinu": len(os.listdir(item_path)) if os.path.isdir(item_path) else "No",
                'is_directory': os.path.isdir(item_path),
                'size': 0,
                'modified': str(datetime.fromtimestamp(os.path.getmtime(item_path)))
            }
            # Get file size if it's a file
            if not item_info['is_directory']:
                item_info['size'] = os.path.getsize(item_path)
               
            items.append(item_info)
       
        # Sort: directories first, then files, both alphabetically
        items.sort(key=lambda x: (not x['is_directory'], x['name'].lower()))
       
        return JsonResponse({
            'path': home_dir,
            'items': items
        })
       
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
def list_directory(request):
    """List contents of any directory"""
    target_path = request.GET.get('path', '')
   
    # Security: Only allow paths within home directory
    home_dir = str(Path.home())
   
    if not target_path:
        target_path = home_dir
   
    # Ensure the path is within home directory
    if not os.path.abspath(target_path).startswith(home_dir):
        return JsonResponse({'error': 'Access denied'}, status=403)
   
    try:
        if not os.path.exists(target_path):
            return JsonResponse({'error': 'Directory not found'}, status=404)
           
        if not os.path.isdir(target_path):
            return JsonResponse({'error': 'Not a directory'}, status=400)
       
        items = []
       
        for item_name in os.listdir(target_path):
            item_path = os.path.join(target_path, item_name)
           
            # Skip hidden files/folders (optional)
            from datetime import datetime
            item_info = {
                'name': item_name,
                'path': item_path,
                "ibinu": len(os.listdir(item_path)) if os.path.isdir(item_path) else "No",
                'is_directory': os.path.isdir(item_path),
                'size': 0,
                'modified': str(datetime.fromtimestamp(os.path.getmtime(item_path)))
            }
            if not item_info['is_directory']:
                item_info['size'] = os.path.getsize(item_path)
            items.append(item_info)
       
        # Sort: directories first, then files
        items.sort(key=lambda x: (not x['is_directory'], x['name'].lower()))
       
        return JsonResponse({
            'path': target_path,
            'items': items
        })
       
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
def get_file_content(request):
    """Get content of a file for preview"""
    file_path = request.GET.get('path', '')
   
    home_dir = str(Path.home())
    if not os.path.abspath(file_path).startswith(home_dir):
        return JsonResponse({'error': 'Access denied'}, status=403)
   
    try:
        if not os.path.exists(file_path):
            return JsonResponse({'error': 'File not found'}, status=404)
           
        if os.path.isdir(file_path):
            return JsonResponse({'error': 'Cannot preview directory'}, status=400)
       
        file_name = os.path.basename(file_path)
        file_extension = os.path.splitext(file_path)[1].lower()
        # EXTENSION GROUPS
        image_ext = ['.jpg','.jpeg','.png','.gif','.bmp','.webp','.tiff','.svg','.ico','.avif']
        video_ext = ['.mp4','.avi','.mov','.mkv','.webm','.flv','.wmv','.m4v','.3gp','.mpeg','.mpg']
        audio_ext = ['.mp3','.wav','.ogg','.flac','.m4a','.aac','.wma','.aiff','.amr', ".opus"]
        text_ext = ['.txt','.py','.js','.html','.css','.json','.md','.yml','.yaml','.xml','.csv',
                    '.ini','.cfg','.log','.sh',".bash",'.bat','.php','.rb','.c','.cpp','.java','.ts', ".conf", ".srt", ".zsh", ".zshrc", ".lua", ".lock"]
        document_ext = ['.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.odt','.ods','.odp','.rtf','.epub']
        archive_ext = ['.zip','.rar','.tar','.gz','.7z','.bz2','.xz','.iso']
        executable_ext = ['.exe','.msi','.apk','.deb','.rpm','.bin','.sh','.appimage']
        font_ext = ['.ttf','.otf','.woff','.woff2']
        design_ext = ['.psd','.ai','.xd','.sketch','.fig']
        model_ext = ['.obj','.fbx','.stl','.glb','.gltf']
       
        # IMAGE
        if file_extension in image_ext:
            import base64
            with open(file_path, 'rb') as f:
                data = base64.b64encode(f.read()).decode('utf-8')
            mime = f"image/{file_extension[1:]}" if file_extension != '.jpg' else 'image/jpeg'
            return JsonResponse({
                'type': 'image',
                'content': f"data:{mime};base64,{data}",
                'name': file_name
            })
        # TEXT / CODE
        elif file_extension in text_ext:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return JsonResponse({
                    'type': 'text',
                    'content': f.read(),
                    'name': file_name
        # VIDEO
                })
        elif file_extension in video_ext:
            return JsonResponse({
                'type': 'video',
                'name': file_name,
                'file_path': file_path,
                'absolute_path': f'file://{file_path}'
            })
        # AUDIO
        elif file_extension in audio_ext:
            return JsonResponse({
                'type': 'audio',
                'name': file_name,
                'file_path': file_path,
                'absolute_path': f'file://{file_path}'
            })
        # DOCUMENTS
        elif file_extension in document_ext:
            return JsonResponse({
                'type': 'document',
                'name': file_name,
                'file_path': file_path
            })
        # ARCHIVES
        elif file_extension in archive_ext:
            return JsonResponse({
                'type': 'archive',
                'name': file_name,
                'message': "Cannot preview archives"
            })
        # EXECUTABLES
        elif file_extension in executable_ext:
            return JsonResponse({
                'type': 'executable',
                'name': file_name,
                'message': "This is an executable file"
            })
        # FONTS
        elif file_extension in font_ext:
            return JsonResponse({
                'type': 'font',
                'name': file_name,
                'file_path': file_path
            })
        # DESIGN FILES (PSD, AI, XD, etc)
        elif file_extension in design_ext:
            return JsonResponse({
                'type': 'design',
                'name': file_name,
                'message': "Preview not supported for design files"
            })
        # 3D MODELS
        elif file_extension in model_ext:
            return JsonResponse({
                'type': '3dmodel',
                'name': file_name,
                'message': "3D preview not implemented"
            })
        # UNKNOWN
        else:
            return JsonResponse({
                'type': 'unknown',
                'name': file_name,
                'message': "Preview not available for this file type"
            })
   
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@csrf_exempt
def preview_file(request):
    filepath = request.GET.get("path")
    if not filepath or not os.path.exists(filepath):
        return JsonResponse({"error": "File not found"}, status=404)
    file_size = os.path.getsize(filepath)
    content_type, _ = mimetypes.guess_type(filepath)
    if content_type is None:
        content_type = "application/octet-stream"
    range_header = request.headers.get("Range")
   
    response = None
    if not range_header:
        response = FileResponse(open(filepath, "rb"), content_type=content_type)
        response["Accept-Ranges"] = "bytes"
    else:
        _, range_value = range_header.split("=")
        start_str, end_str = range_value.split("-")
        start = int(start_str)
        end = int(end_str) if end_str else file_size - 1
        chunk_size = (end - start) + 1
        file = open(filepath, "rb")
        file.seek(start)
        def stream():
            bytes_remaining = chunk_size
            while bytes_remaining > 0:
                chunk = file.read(min(8192, bytes_remaining))
                if not chunk:
                    break
                bytes_remaining -= len(chunk)
                yield chunk
        response = StreamingHttpResponse(stream(), status=206, content_type=content_type)
        response["Content-Range"] = f"bytes {start}-{end}/{file_size}"
        response["Accept-Ranges"] = "bytes"
        response["Content-Length"] = str(chunk_size)
    # **CORS headers**
    response["Access-Control-Allow-Origin"] = "*" # allow frontend to fetch
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Range"
    return response



@csrf_exempt
def apply_filters(request):
    """
    Apply color filter (skin tone replacement) and/or sharpening to video/image using OpenCV
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)
   
    try:
        data = json.loads(request.body)
        input_path = data.get('input_path')
        color_filter = data.get('color_filter') # Contains hue value
        sharpening = data.get('sharpening') # 0-100 value
       
        if not input_path or not os.path.exists(input_path):
            return JsonResponse({'error': 'File not found'}, status=404)
       
        # Generate output filename
        base_name = os.path.splitext(input_path)[0]
        extension = os.path.splitext(input_path)[1].lower()
        timestamp = int(time.time())
        output_path = f"{base_name}_NYX_filtered_{timestamp}{extension}"
       
        # Check file type
        is_image = extension in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']
        is_video = extension in ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']
       
        if not (is_image or is_video):
            return JsonResponse({'error': f'Unsupported file type: {extension}'}, status=400)
       
        # Process based on file type
        if is_image:
            # Process image with OpenCV
            process_image_with_opencv(input_path, output_path, color_filter, sharpening)
        else:
            # Process video with FFmpeg (OpenCV video processing is more complex)
            process_video_skin_only_opencv(input_path, output_path, color_filter, sharpening)
       
        return JsonResponse({
            'success': True,
            'output_path': output_path,
            'input_path': input_path,
            'applied_filters': {
                'skin_tone_replacement': bool(color_filter),
                'sharpening': sharpening is not None
            }
        })
       
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def process_image_with_opencv(input_path, output_path, color_filter, sharpening):
    """
    Process image using OpenCV for skin detection and replacement
    """
    import cv2
    import numpy as np
   
    # Read image
    img = cv2.imread(input_path)
    if img is None:
        raise Exception(f"Could not read image: {input_path}")
   
    # Convert to RGB (OpenCV uses BGR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
   
    # Apply skin tone replacement if requested
    if color_filter and 'hue' in color_filter:
        # Get target hue from color filter
        target_hue = float(color_filter['hue'])
       
        # Convert target hue to RGB color
        target_rgb = hsv_to_rgb(target_hue, 50, 70) # Medium saturation, brightness
       
        # Detect skin in image
        skin_mask = detect_skin_opencv(img)
       
        # Apply skin tone to detected skin areas
        img_rgb = replace_skin_tone(img_rgb, skin_mask, target_rgb)
   
    # Apply sharpening if requested
    if sharpening is not None:
        amount = float(sharpening) / 100.0 # Convert to 0.0-1.0
        img_rgb = apply_sharpening_opencv(img_rgb, amount)
   
    # Convert back to BGR and save
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(output_path, img_bgr)

def detect_skin_opencv(img_bgr):
    """
    Any-skin detection (frame-wide), classic CV:
    - CLAHE on Y
    - Gaussian likelihood on (Cr,Cb)
    - HSV sanity gate
    - morphology + component filtering
    Returns uint8 mask 0..255
    """
    import cv2
    import numpy as np

    H, W = img_bgr.shape[:2]

    # --- YCrCb + CLAHE on Y ---
    ycrcb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
    y, cr, cb = cv2.split(ycrcb)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    y_eq = clahe.apply(y)

    cr_f = cr.astype(np.float32)
    cb_f = cb.astype(np.float32)

    # --- Skin likelihood in CrCb using a Gaussian model ---
    # Tunable parameters (good starting point)
    mu = np.array([150.0, 110.0], dtype=np.float32)   # [Cr, Cb]
    cov = np.array([[420.0, 0.0],
                    [0.0, 420.0]], dtype=np.float32)   # ~ (20.5)^2

    inv_cov = np.linalg.inv(cov)
    d0 = cr_f - mu[0]
    d1 = cb_f - mu[1]
    d2 = inv_cov[0, 0] * d0 * d0 + inv_cov[1, 1] * d1 * d1 + 2 * inv_cov[0, 1] * d0 * d1
    prob = np.exp(-0.5 * d2)  # 0..1

    # Brightness weighting to avoid extremes
    y_norm = y_eq.astype(np.float32) / 255.0
    bright_ok = (y_norm > 0.08) & (y_norm < 0.98)
    prob = prob * bright_ok.astype(np.float32)

    # --- HSV sanity gate (broad, not too strict) ---
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    # OpenCV H: 0..180
    # Skin usually around H in [0..25] plus occasionally near wrap-around.
    hsv_gate = (
        (s >= 20) & (s <= 210) &
        (v >= 35) & (v <= 245) &
        ((h <= 25) | (h >= 160))
    )

    # Combine
    score = prob * hsv_gate.astype(np.float32)

    # Threshold
    mask = (score > 0.18).astype(np.uint8) * 255  # tune 0.15..0.25

    # --- Morphology cleanup ---
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    # Remove tiny components
    num, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    min_area = int(0.0015 * H * W)  # 0.15% frame area; tune per content
    cleaned = np.zeros_like(mask)
    for i in range(1, num):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            cleaned[labels == i] = 255

    # Feather edges for nicer blending
    cleaned = cv2.GaussianBlur(cleaned, (7, 7), 0)
    return cleaned

def replace_skin_tone(img_bgr, skin_mask, target_rgb, strength=0.6):
    import cv2
    import numpy as np

    strength = float(np.clip(strength, 0.0, 1.0))

    alpha = skin_mask.astype(np.float32) / 255.0
    alpha = cv2.GaussianBlur(alpha, (9, 9), 0)

    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = cv2.split(lab)

    # target RGB -> BGR -> LAB
    target_bgr = np.uint8([[[target_rgb[2], target_rgb[1], target_rgb[0]]]])
    target_lab = cv2.cvtColor(target_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    _, A_t, B_t = cv2.split(target_lab)
    A_t = float(A_t[0, 0])
    B_t = float(B_t[0, 0])

    # shift chroma only where mask exists
    A2 = A + (A_t - A) * (strength * alpha)
    B2 = B + (B_t - B) * (strength * alpha)

    out_lab = cv2.merge([L, A2, B2]).astype(np.uint8)
    out_bgr = cv2.cvtColor(out_lab, cv2.COLOR_LAB2BGR)
    return out_bgr

def replace_skin_tone_lab(img_bgr, skin_mask, target_rgb, strength=0.6):
    import cv2
    import numpy as np

    strength = float(np.clip(strength, 0.0, 1.0))

    alpha = skin_mask.astype(np.float32) / 255.0
    alpha = cv2.GaussianBlur(alpha, (9, 9), 0)

    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, A, B = cv2.split(lab)

    # target RGB -> BGR -> LAB
    target_bgr = np.uint8([[[target_rgb[2], target_rgb[1], target_rgb[0]]]])
    target_lab = cv2.cvtColor(target_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    _, A_t, B_t = cv2.split(target_lab)
    A_t = float(A_t[0, 0])
    B_t = float(B_t[0, 0])

    # shift chroma only where mask exists
    A2 = A + (A_t - A) * (strength * alpha)
    B2 = B + (B_t - B) * (strength * alpha)

    out_lab = cv2.merge([L, A2, B2]).astype(np.uint8)
    out_bgr = cv2.cvtColor(out_lab, cv2.COLOR_LAB2BGR)
    return out_bgr


def process_video_skin_only_opencv(input_path, output_path, color_filter, sharpening):
    """
    Real skin-only recolor for video:
    - read frames with OpenCV
    - detect skin per-frame
    - recolor masked skin in Lab
    - optional sharpening
    - write temp video (no audio)
    - mux original audio back with ffmpeg
    """
    import cv2, os, tempfile, subprocess

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise Exception(f"Could not open video: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Temp video (video-only)
    tmp_dir = tempfile.mkdtemp()
    temp_video = os.path.join(tmp_dir, "video_noaudio.mp4")

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(temp_video, fourcc, fps, (w, h))
    if not writer.isOpened():
        cap.release()
        raise Exception("Could not create VideoWriter (try different codec/container).")

    # Prepare filter params
    do_recolor = bool(color_filter and isinstance(color_filter, dict) and "hue" in color_filter)
    if do_recolor:
        target_hue = float(color_filter["hue"])
        target_rgb = hsv_to_rgb(target_hue, 50, 70)  # reuse your function
        strength = 0.6  # tune or expose as parameter

    do_sharp = sharpening is not None
    sharp_amount = float(sharpening) / 100.0 if do_sharp else 0.0

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        # 1) skin mask
        mask = detect_skin_opencv(frame)

        # 2) recolor (skin-only)
        if do_recolor:
            frame = replace_skin_tone_lab(frame, mask, target_rgb, strength=strength)

        # 3) sharpening (whole frame; if you want, you can apply only outside skin too)
        if do_sharp and sharp_amount > 0:
            frame = apply_sharpening_opencv(frame, sharp_amount)

        writer.write(frame)

    cap.release()
    writer.release()

    # Mux audio back in (if present). If no audio, this still succeeds in most cases.
    # -map 0:v from processed temp_video
    # -map 1:a from original input (optional)
    cmd = [
        "ffmpeg", "-y",
        "-i", temp_video,
        "-i", input_path,
        "-map", "0:v:0",
        "-map", "1:a:0?",
        "-c:v", "libx264",
        "-crf", "18",
        "-preset", "veryfast",
        "-c:a", "copy",
        output_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def hsv_to_rgb(h, s, v):
    """
    Convert HSV to RGB (h: 0-360, s: 0-100, v: 0-100)
    Returns RGB tuple (0-255)
    """
    import colorsys
   
    # Convert to 0-1 range
    h = h / 360.0
    s = s / 100.0
    v = v / 100.0
   
    # Convert HSV to RGB
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
   
    # Convert to 0-255 range
    return (int(r * 255), int(g * 255), int(b * 255))
def apply_sharpening_opencv(img, amount):
    """
    Apply sharpening using OpenCV
    """
    import cv2
    import numpy as np
   
    # Create sharpening kernel
    kernel = np.array([[-1, -1, -1],
                       [-1, 9 + amount * 8, -1],
                       [-1, -1, -1]])
   
    # Apply convolution
    sharpened = cv2.filter2D(img, -1, kernel)
   
    # Blend with original based on amount
    result = cv2.addWeighted(img, 1 - amount, sharpened, amount, 0)
   
    return result
def process_video_with_ffmpeg(input_path, output_path, color_filter, sharpening):
    """
    Process video using FFmpeg (simpler than OpenCV for videos)
    """
    import ffmpeg
   
    # Build ffmpeg filter chain
    filters = []
   
    # Note: FFmpeg can't do skin detection, so we use hue filter as fallback
    if color_filter and 'hue' in color_filter:
        hue = float(color_filter['hue'])
        filters.append(f"hue=h={hue}")
   
    if sharpening is not None:
        amount = float(sharpening) / 20.0 # 0-5 range
        filters.append(f"unsharp=5:5:{amount}")
   
    if filters:
        filter_chain = ",".join(filters)
       
        # Run ffmpeg command
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.output(stream, output_path, vf=filter_chain, acodec='copy')
        ffmpeg.run(stream, overwrite_output=True, quiet=True)
    else:
        # No filters, just copy file
        shutil.copy2(input_path, output_path)
   
@csrf_exempt
def change_pitch(request):
    """
    Change video pitch and automatically clean up previous pitch versions
    """
    if request.method == 'POST':
        try:
            # Parse request data
            data = json.loads(request.body)
            input_path = data.get('input_path')
            pitch_factor = float(data.get('pitch_factor', 1.0))
           
            # Validate input
            if not input_path:
                return JsonResponse({'error': 'No input path provided'}, status=400)
           
            if not os.path.exists(input_path):
                return JsonResponse({'error': 'Input file does not exist'}, status=400)
           
            # Generate output path with NYX_ prefix
            base_name = os.path.splitext(input_path)[0] # /path/to/video
            extension = os.path.splitext(input_path)[1] # .mp4
            output_path = f"{base_name}_NYX_pitch_{pitch_factor:.1f}{extension}"
            # STEP 2: Apply pitch change
            change_pitch_video(input_path, output_path, pitch_factor)
           
            return JsonResponse({
                'success': True,
                'output_path': output_path,
                'pitch_factor': pitch_factor,
                'message': f'Pitch changed to {pitch_factor}x and previous versions cleaned up'
            })
           
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
   
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
def cleanup_previous_pitch_files(base_name, extension, output_path):
    """
    Delete all previous pitch-modified files for a specific original file
   
    Args:
        base_name: Original file path without extension (/path/to/video)
        extension: File extension (.mp4, .avi, etc.)
    """
    try:
        # Create pattern to match all pitch files for this original
        # Pattern: /path/to/video_NYX_pitch_*.*
        pattern = f"{base_name}_NYX_pitch_*{extension}"
        print("File to Search for: ", base_name+extension)
        other_nyx_file = f"{Path(base_name).parent}/*_NYX_pitch_*"
       
        # Find all files matching the pattern
        previous_files = glob.glob(pattern)
        other_nyx_files = glob.glob(other_nyx_file)
        for onf in other_nyx_files:
            if (onf == output_path):
                pass
            else:
                os.remove(onf)
                print(f"✓ Deleted: {os.path.basename(onf)}")
           
       
        print(f"Found {len(previous_files)} previous pitch files to clean up:")
       
        deleted_count = 0
        for file_path in previous_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"✓ Deleted: {os.path.basename(file_path)}")
                    print(f"{file_path}: {os.path.exists(file_path)}")
                    deleted_count += 1
                else:
                    print(f"⚠ File not found (already deleted): {file_path}")
            except Exception as e:
                print(f"✗ Error deleting {file_path}: {e}")
       
        print(f"Cleanup completed: {deleted_count} files deleted")
       
    except Exception as e:
        print(f"Error in cleanup process: {e}")
def change_pitch_video(input_file, output_file, pitch_factor=1.0):
    """
    Your existing pitch change function with optimization
    """
    if pitch_factor == 1.0:
        # No pitch change needed
        (
            ffmpeg
            .input(input_file)
            .output(output_file, c='copy')
            .run(overwrite_output=True, quiet=True)
        )
    else:
        # Apply pitch change
        atempo = 1 / pitch_factor
        audio_filter = f"asetrate=44100*{pitch_factor},aresample=44100,atempo={atempo:.4f}"
        (
            ffmpeg
            .input(input_file)
            .output(output_file, **{'filter:a': audio_filter, 'c:v': 'copy'})
            .run(overwrite_output=True, quiet=True)
        )
@csrf_exempt
def siba_ibya_nyx(request):
    data = json.loads(request.body)
    input_path = data.get('path')
   
    # Find all files matching the pattern
    other_nyx_file = f"{download_folder}/*_NYX_*"
    other_nyx_files = glob.glob(other_nyx_file)
    for onf in other_nyx_files:
        if onf != input_path:
            os.remove(onf)
            print(f"✓ Cleared Nyx: {os.path.basename(onf)}")
           
    return JsonResponse({"status": "cleared"}, status=200)
@csrf_exempt
def clear_nyx_path(request):
    data = json.loads(request.body)
    input_path = data.get('path')
    print("INPUT PATH: ", input_path)
   
    # Find all files matching the pattern
    other_nyx_file = f"{Path(input_path).parent}/*_NYX_pitch*"
    other_nyx_files = glob.glob(other_nyx_file)
    for onf in other_nyx_files:
            os.remove(onf)
            print(f"✓ Cleared Nyx: {os.path.basename(onf)}")
           
    return JsonResponse({"status": "cleared"}, status=200)
@csrf_exempt
def change_speed(request):
    """
    Change video speed and automatically clean up previous speed-modified versions
    """
    if request.method == 'POST':
        try:
            # Parse request data
            data = json.loads(request.body)
            input_path = data.get('input_path')
            speed_factor = float(data.get('speed_factor', 1.0))
           
            # Validate input
            if not input_path:
                return JsonResponse({'error': 'No input path provided'}, status=400)
           
            if not os.path.exists(input_path):
                return JsonResponse({'error': 'Input file does not exist'}, status=400)
           
            # Generate output path with NYX_ prefix
            base_name = os.path.splitext(input_path)[0] # /path/to/video
            extension = os.path.splitext(input_path)[1] # .mp4
            output_path = f"{base_name}_NYX_speed_{speed_factor:.2f}{extension}"
                      
            # STEP 2: Apply speed change
            change_video_speed(input_path, output_path, speed_factor)
           
            return JsonResponse({
                'success': True,
                'output_path': output_path,
                'speed_factor': speed_factor,
                'message': f'Video speed changed to {speed_factor}x and previous versions cleaned up'
            })
           
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
   
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
def cleanup_previous_speed_files(base_name, extension, output_path):
    """
    Delete all previous speed-modified files for a specific original file
    """
    try:
        pattern = f"{base_name}_NYX_speed_*{extension}"
        other_nyx_file = f"{Path(base_name).parent}/*_NYX_speed_*"
       
        previous_files = glob.glob(pattern)
        other_nyx_files = glob.glob(other_nyx_file)
       
        for onf in other_nyx_files:
            if onf != output_path:
                os.remove(onf)
                print(f"✓ Deleted: {os.path.basename(onf)}")
       
        deleted_count = 0
        for file_path in previous_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"✓ Deleted: {os.path.basename(file_path)}")
                    deleted_count += 1
            except Exception as e:
                print(f"✗ Error deleting {file_path}: {e}")
       
        print(f"Cleanup completed: {deleted_count} files deleted")
       
    except Exception as e:
        print(f"Error in cleanup process: {e}")
def change_video_speed(input_file, output_file, speed_factor=1.0):
    """
    Change the playback speed of a video.
    """
    if speed_factor == 1.0:
        # No speed change needed
        (
            ffmpeg
            .input(input_file)
            .output(output_file, c='copy')
            .run(overwrite_output=True, quiet=True)
        )
    else:
        # Adjust both video and audio speed
        video_filter = f"setpts={1/speed_factor}*PTS"
        audio_filter = f"atempo={speed_factor:.4f}" if 0.5 <= speed_factor <= 2.0 else None
       
        stream = ffmpeg.input(input_file)
        if audio_filter:
            stream = ffmpeg.output(stream, output_file, vf=video_filter, af=audio_filter)
        else:
            # Handle extreme speeds with multiple atempo filters
            # Example: chain multiple atempo filters for speed >2 or <0.5
            afilter = build_atempo_chain(speed_factor)
            stream = ffmpeg.output(stream, output_file, vf=video_filter, af=afilter)
       
        stream.run(overwrite_output=True, quiet=True)
def build_atempo_chain(speed_factor):
    """
    Chain multiple atempo filters for extreme speeds (>2 or <0.5)
    """
    filters = []
    remaining_speed = speed_factor
    while remaining_speed > 2.0:
        filters.append("atempo=2.0")
        remaining_speed /= 2.0
    while remaining_speed < 0.5:
        filters.append("atempo=0.5")
        remaining_speed /= 0.5
    filters.append(f"atempo={remaining_speed:.4f}")
    return ",".join(filters)
@csrf_exempt
def clear_nyx_speed(request):
    """
    Clear all NYX speed-modified versions of a video
    """
    data = json.loads(request.body)
    input_path = data.get('path')
   
    other_nyx_file = f"{Path(input_path).parent}/*_NYX_speed_*"
    other_nyx_files = glob.glob(other_nyx_file)
    for onf in other_nyx_files:
        os.remove(onf)
        print(f"✓ Cleared Nyx speed file: {os.path.basename(onf)}")
   
    return JsonResponse({"status": "cleared"}, status=200)
       
def split_into_lines(text, words_per_line=4):
    words = text.split()
    lines = []
    for i in range(0, len(words), words_per_line):
        lines.append(" ".join(words[i:i + words_per_line]))
    return "\n".join(lines)
@csrf_exempt
def wikipedia_information(request):
    topic = request.GET.get("topic", "").strip()
    wikipedia.set_lang("en")
    if not topic:
        return JsonResponse({"content": "No topic provided."})
    try:
        results = wikipedia.search(topic)
        if not results:
            return JsonResponse({
                "content": f"No related topics for '{topic}'."
            })
        best_match = results[0]
        page = wikipedia.page(best_match)
        raw_content = page.content
        formatted = split_into_lines(raw_content, 7)
        return JsonResponse({
            "content": formatted,
            "matched_topic": best_match,
            "original_query": topic
        })
    except wikipedia.exceptions.DisambiguationError as e:
        return JsonResponse({
            "content": f"Ambiguous: {', '.join(e.options[:10])}"
        })
    except Exception as e:
        return JsonResponse({"content": f"Error: {str(e)}"})
@csrf_exempt
def stream_video_preview(request):
    """Stream video for preview before download"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            url = clean_url(data.get('url'))
            format_id = data.get('format_id')
           
            if not url:
                return JsonResponse({'error': 'URL required'}, status=400)
           
            # Get video info without downloading
            ydl_opts = {
                'format': 'best[height<=480]', # Limit quality for faster streaming
                'quiet': True,
            }
           
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
               
                # Find the best streamable format
                format_info = find_best_streamable_format(info.get('formats', []))
               
                if format_info and 'url' in format_info:
                    return JsonResponse({
                        'stream_url': format_info['url'],
                        'title': info.get('title', 'Preview'),
                        'duration': format_info.get('duration', info.get('duration')),
                        'thumbnail': info.get('thumbnail'),
                        'width': format_info.get('width'),
                        'height': format_info.get('height'),
                        'direct_stream': True
                    })
           
            return JsonResponse({'error': 'No streamable format found'}, status=400)
           
        except Exception as e:
            return JsonResponse({'error': f'Preview error: {str(e)}'}, status=500)
   
    return JsonResponse({'error': 'POST required'}, status=405)
def find_best_streamable_format(formats):
    """Find the best format for direct streaming preview"""
    streamable_formats = []
   
    for fmt in formats:
        # Look for formats that can be streamed directly
        has_video = fmt.get('vcodec') != 'none'
        has_audio = fmt.get('acodec') != 'none'
        protocol = fmt.get('protocol', '')
       
        # Prefer formats with both audio and video that use HTTP protocols
        if (has_video and has_audio and
            protocol in ['http', 'https', 'http_dash_segments'] and
            fmt.get('height', 0) <= 720): # Limit to 720p for faster streaming
           
            streamable_formats.append(fmt)
   
    # Sort by quality (lower resolution first for faster streaming)
    if streamable_formats:
        streamable_formats.sort(key=lambda x: x.get('height', 0))
        return streamable_formats[0] # Return the smallest for fastest preview
   
    # Fallback: try any format with video
    for fmt in formats:
        if fmt.get('vcodec') != 'none' and fmt.get('url'):
            return fmt
   
    return None


@csrf_exempt
def generate_thumbnail(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            video_path = data.get('video_path')
            timestamp = data.get('timestamp', 1)
            
            if not video_path or not os.path.exists(video_path):
                return JsonResponse({'error': 'Video file not found'}, status=404)
            
            # Create a temporary file for the thumbnail
            temp_dir = tempfile.gettempdir()
            thumbnail_filename = f"thumbnail_{uuid.uuid4().hex}.jpg"
            thumbnail_path = os.path.join(temp_dir, thumbnail_filename)
            
            try:
                # Use ffmpeg-python to generate thumbnail
                (
                    ffmpeg
                    .input(video_path, ss=timestamp)
                    .output(thumbnail_path, vframes=1, qscale=2)
                    .overwrite_output()
                    .run(capture_stdout=True, capture_stderr=True, quiet=True)
                )
                
                if os.path.exists(thumbnail_path):
                    # Move thumbnail to static directory
                    static_dir = os.path.join(os.path.dirname(__file__), 'static', 'thumbnails')
                    os.makedirs(static_dir, exist_ok=True)
                    
                    final_thumbnail_path = os.path.join(static_dir, thumbnail_filename)
                    
                    # Move the file
                    if os.path.exists(final_thumbnail_path):
                        os.remove(final_thumbnail_path)
                    os.rename(thumbnail_path, final_thumbnail_path)
                    
                    # Return URL for the thumbnail
                    thumbnail_url = f'/static/thumbnails/{thumbnail_filename}'
                    
                    return JsonResponse({
                        'success': True,
                        'thumbnail_url': thumbnail_url,
                        'thumbnail_path': final_thumbnail_path
                    })
                else:
                    return JsonResponse({'error': 'Failed to generate thumbnail file'}, status=500)
                    
            except ffmpeg.Error as e:
                error_message = e.stderr.decode('utf-8') if e.stderr else str(e)
                return JsonResponse({'error': f'FFmpeg error: {error_message}'}, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
    
    return JsonResponse({'kora': 'Zose'})

def is_magnet_url(url: str) -> bool:
    """Check if URL is a magnet link"""
    return url.startswith('magnet:') and 'xt=urn:btih:' in url

def parse_magnet_info(magnet_url: str) -> Dict[str, Any]:
    """Parse magnet URL and extract information"""
    try:
        parsed = urllib.parse.urlparse(magnet_url)
        params = urllib.parse.parse_qs(parsed.query)
        
        info = {
            'type': 'torrent',
            'url': magnet_url,
            'info_hash': None,
            'name': None,
            'trackers': [],
            'webseeds': [],
            'files': []
        }
        
        # Extract info hash
        for xt in params.get('xt', []):
            if 'urn:btih:' in xt:
                info['info_hash'] = xt.split('urn:btih:')[1]
                break
        
        # Extract name
        if 'dn' in params:
            info['name'] = params['dn'][0]
        
        # Extract trackers
        if 'tr' in params:
            info['trackers'] = [tr for tr in params['tr'] if tr]
        
        # Extract webseeds
        if 'ws' in params:
            info['webseeds'] = [ws for ws in params['ws'] if ws]
        
        return info
        
    except Exception as e:
        print(f"Error parsing magnet URL: {e}")
        return None
    
    
    
    
    
def get_torrent_info_from_file(torrent_file_path: str) -> Dict[str, Any]:
    """Get torrent information from .torrent file"""
    try:
        with open(torrent_file_path, 'rb') as f:
            metadata = bencode.bdecode(f.read())
        
        info = metadata.get('info', {})
        
        # Calculate info hash
        info_bencoded = bencode.bencode(info)
        info_hash = hashlib.sha1(info_bencoded).hexdigest()
        
        # Get file list
        files = []
        if 'files' in info:
            # Multi-file torrent
            for file_info in info['files']:
                path = '/'.join(file_info['path'])
                files.append({
                    'path': path,
                    'size': file_info['length'],
                    'selected': True
                })
        else:
            # Single file torrent
            files.append({
                'path': info.get('name', 'unknown'),
                'size': info.get('length', 0),
                'selected': True
            })
        
        return {
            'type': 'torrent',
            'name': info.get('name', 'Unknown Torrent'),
            'info_hash': info_hash,
            'total_size': sum(f['size'] for f in files),
            'files': files,
            'trackers': metadata.get('announce-list', []) or [metadata.get('announce')] if metadata.get('announce') else [],
            'created_by': metadata.get('created by', 'Unknown'),
            'creation_date': metadata.get('creation date', 0),
            'comment': metadata.get('comment', ''),
            'file_path': torrent_file_path
        }
        
    except Exception as e:
        print(f"Error reading torrent file: {e}")
        return None


def start_torrent_download(download_id: str, magnet_or_file: str, save_path: str = None, selected_files: List[str] = None):
    """Start torrent download - Saves directly to Downloads folder (no subfolder)"""
    try:
        print(f"Starting torrent download: {download_id}")
        
        # Use provided save_path or default to Downloads folder
        if save_path is None:
            save_path = download_folder  # This is already '~/Downloads/'
        else:
            # Ensure the save path exists
            os.makedirs(save_path, exist_ok=True)
        
        print(f"Saving torrent to: {save_path}")
        
        # Create libtorrent session
        ses = lt.session()
        
        try:
            # Try to listen on ports
            ses.listen_on(6881, 6891)
        except:
            print("Warning: Could not set listen ports")
        
        # Try to enable features (ignore errors for compatibility)
        try:
            ses.start_dht()
        except: pass
        try:
            ses.start_lsd()
        except: pass
        try:
            ses.start_upnp()
        except: pass
        try:
            ses.start_natpmp()
        except: pass
        
        # Add torrent
        try:
            if magnet_or_file.startswith('magnet:'):
                # For magnet links
                handle = lt.add_magnet_uri(ses, magnet_or_file, {'save_path': save_path})
            else:
                # For .torrent files
                info = lt.torrent_info(magnet_or_file)
                handle = ses.add_torrent({'ti': info, 'save_path': save_path})
        except Exception as e:
            print(f"Error adding torrent: {e}")
            # Try alternative method
            if magnet_or_file.startswith('magnet:'):
                params = lt.parse_magnet_uri(magnet_or_file)
                params.save_path = save_path
                handle = ses.add_torrent(params)
            else:
                info = lt.torrent_info(magnet_or_file)
                handle = ses.add_torrent({'ti': info, 'save_path': save_path})
        
        # If selected_files is provided, set file priorities
        if selected_files and handle and handle.is_valid():
            try:
                torrent_info = handle.get_torrent_info()
                for i in range(torrent_info.num_files()):
                    file_entry = torrent_info.files()
                    file_path = file_entry.file_path(i)
                    
                    # Set priority based on selection
                    if file_path in selected_files:
                        handle.file_priority(i, 7)  # Highest priority
                        print(f"Selected file: {file_path}")
                    else:
                        handle.file_priority(i, 0)  # Don't download
                        print(f"Skipping file: {file_path}")
            except Exception as e:
                print(f"Error setting file priorities: {e}")
        
        # Store session and handle
        with torrent_lock:
            torrent_sessions[download_id] = ses
            torrent_torrents[download_id] = handle
            torrent_progress[download_id] = {
                'status': 'downloading',
                'name': 'Torrent',
                'save_path': save_path
            }
        
        # Initialize progress
        download_progress[download_id] = {
            'status': 'downloading',
            'percent': 0,
            'downloaded_bytes': 0,
            'total_bytes': None,
            'speed': 0,
            'eta': None,
            'filename': 'Torrent Download',
            'method': 'torrent',
            'can_pause': True,
            'resumable': True,
            'save_path': save_path  # Store the save path
        }
        
        # Start progress update thread
        def update_torrent_progress():
            last_update = time.time()
            last_bytes = 0
            
            while download_id in torrent_sessions:
                try:
                    status = handle.status()
                    
                    # Calculate progress
                    total = status.total_wanted
                    done = status.total_wanted_done
                    
                    if total > 0:
                        percent = (done / total) * 100
                    else:
                        percent = 0
                    
                    # Calculate speed
                    current_time = time.time()
                    if current_time > last_update:
                        speed = (done - last_bytes) / (current_time - last_update)
                        last_bytes = done
                        last_update = current_time
                    else:
                        speed = 0
                    
                    # Get name
                    name = status.name or 'Torrent'
                    if not name or name == '':
                        name = 'Torrent Download'
                    
                    # Update progress
                    progress_data = {
                        'status': 'downloading',
                        'percent': round(percent, 2),
                        'downloaded_bytes': done,
                        'total_bytes': total,
                        'speed': speed,
                        'eta': calculate_torrent_eta(status),
                        'filename': name,
                        'method': 'torrent',
                        'can_pause': True,
                        'resumable': True,
                        'seeds': status.num_seeds,
                        'peers': status.num_peers,
                        'save_path': save_path,  # Include save path
                        'selected_files_count': len(selected_files) if selected_files else 'all'
                    }
                    
                    # Update global progress
                    download_progress[download_id] = progress_data
                    
                    # Send WebSocket update
                    try:
                        if main_event_loop:
                            asyncio.run_coroutine_threadsafe(
                                system_status_websocket.send_download_update(download_id, progress_data),
                                main_event_loop
                            )
                    except Exception as e:
                        print(f"Error sending torrent WebSocket update: {e}")
                    
                    
                    # Check if download is complete
                    if status.is_seeding or percent >= 99.9:
                        progress_data['status'] = 'finished'
                        progress_data['percent'] = 100
                        download_progress[download_id] = progress_data
                        
                        # Save to history
                        try:
                            save_torrent_to_history(download_id, magnet_or_file, save_path, status)
                        except Exception as e:
                            print(f"Error saving torrent to history: {e}")
                        
                        # Clean up
                        with torrent_lock:
                            torrent_sessions.pop(download_id, None)
                            torrent_torrents.pop(download_id, None)
                            torrent_progress.pop(download_id, None)
                        break
                    
                    # Check for errors
                    if status.state == lt.torrent_status.error:
                        progress_data['status'] = 'error'
                        progress_data['error'] = 'Torrent error'
                        download_progress[download_id] = progress_data
                        break
                        
                except Exception as e:
                    print(f"Torrent progress error: {e}")
                    break
                
                time.sleep(1)
        
        
        
        # Start thread
        threading.Thread(target=update_torrent_progress, daemon=True).start()
        
        print(f"Torrent download started: {download_id}")
        return True
        
    except Exception as e:
        print(f"Error starting torrent download: {e}")
        import traceback
        traceback.print_exc()
        download_progress[download_id] = {
            'status': 'error',
            'error': str(e),
            'method': 'torrent'
        }
        return False

def get_torrent_info_from_url(url: str) -> Dict[str, Any]:
    """Get torrent information from URL (either magnet or .torrent file)"""
    try:
        if url.startswith('magnet:'):
            return parse_magnet_info(url)
        elif url.lower().endswith('.torrent'):
            # Download .torrent file temporarily
            import tempfile
            import requests
            
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, f'temp_{int(time.time())}.torrent')
            
            with open(temp_path, 'wb') as f:
                f.write(response.content)
            
            torrent_info = get_torrent_info_from_file(temp_path)
            
            # Clean up temp file
            try:
                os.remove(temp_path)
            except:
                pass
            
            return torrent_info
        else:
            return None
    except Exception as e:
        print(f"Error getting torrent info from URL: {e}")
        return None    
    

def calculate_torrent_eta(status):
    """Calculate ETA for torrent download"""
    try:
        if status.download_rate > 0:
            remaining = status.total_wanted - status.total_wanted_done
            if remaining > 0:
                return int(remaining / status.download_rate)
    except:
        pass
    return None


def get_torrent_files_info(handle) -> List[Dict]:
    """Get detailed file information from torrent"""
    try:
        torrent_info = handle.get_torrent_info()
        files = []
        
        for i in range(torrent_info.num_files()):
            file_entry = torrent_info.files()
            file_path = file_entry.file_path(i)
            file_size = file_entry.file_size(i)
            file_progress = handle.file_progress(i)
            
            files.append({
                'index': i,
                'path': file_path,
                'size': file_size,
                'downloaded': file_progress,
                'progress': (file_progress / file_size * 100) if file_size > 0 else 0,
                'priority': handle.file_priority(i)
            })
        
        return files
    except:
        return []

def get_torrent_trackers(handle) -> List[Dict]:
    """Get tracker information"""
    try:
        trackers = []
        for tracker in handle.trackers():
            trackers.append({
                'url': tracker.url,
                'tier': tracker.tier,
                'verified': tracker.verified,
                'updating': tracker.updating,
                'fails': tracker.fails,
                'source': tracker.source
            })
        return trackers
    except:
        return []
    
def save_torrent_to_history(download_id: str, url_or_path: str, save_path: str, status):
    """Save torrent download to history"""
    try:
        # Determine if it's magnet or file
        is_magnet = url_or_path.startswith('magnet:')
        
        # Get downloaded files
        downloaded_files = []
        total_size = 0
        
        torrent_info = status.handle.get_torrent_info()
        if torrent_info:
            for i in range(torrent_info.num_files()):
                file_entry = torrent_info.files()
                file_path = os.path.join(save_path, file_entry.file_path(i))
                if os.path.exists(file_path):
                    file_size = os.path.getsize(file_path)
                    downloaded_files.append({
                        'path': file_path,
                        'size': file_size,
                        'name': os.path.basename(file_path)
                    })
                    total_size += file_size
        
        # Save to DownloadHistory
        download_entry = DownloadHistory(
            filename=status.name or 'Torrent Download',
            original_url=url_or_path if is_magnet else None,
            download_path=save_path,
            file_size=total_size,
            format_info={
                'method': 'torrent',
                'type': 'torrent',
                'is_magnet': is_magnet,
                'info_hash': str(status.info_hash),
                'total_files': len(downloaded_files),
                'files': downloaded_files,
                'trackers': [t['url'] for t in get_torrent_trackers(status.handle)],
                'ratio': status.all_time_upload / max(status.all_time_download, 1),
                'download_speed': status.download_rate,
                'upload_speed': status.upload_rate
            },
            status='completed'
        )
        
        download_entry.save()
        
        # Mark as saved in progress
        if download_id in download_progress:
            download_progress[download_id]['history_saved'] = True
        
        print(f"✅ Saved torrent download to history: {status.name}")
        return True
        
    except Exception as e:
        print(f"❌ Error saving torrent to history: {e}")
        return False

def pause_torrent_download(download_id: str):
    """Pause torrent download"""
    try:
        with torrent_lock:
            if download_id in torrent_torrents:
                handle = torrent_torrents[download_id]
                handle.pause()
                
                # Update progress
                download_progress[download_id]['status'] = 'paused'
                
                return True
    except Exception as e:
        print(f"Error pausing torrent: {e}")
    
    return False

def resume_torrent_download(download_id: str):
    """Resume torrent download"""
    try:
        with torrent_lock:
            if download_id in torrent_torrents:
                handle = torrent_torrents[download_id]
                handle.resume()
                
                # Update progress
                download_progress[download_id]['status'] = 'downloading'
                
                return True
    except Exception as e:
        print(f"Error resuming torrent: {e}")
    
    return False

def stop_torrent_download(download_id: str, remove_files: bool = False):
    """Stop torrent download and clean up"""
    try:
        with torrent_lock:
            if download_id in torrent_torrents:
                handle = torrent_torrents[download_id]
                ses = torrent_sessions.get(download_id)
                
                # Remove torrent from session
                if ses:
                    ses.remove_torrent(handle, int(remove_files))
                
                # Clean up
                torrent_sessions.pop(download_id, None)
                torrent_torrents.pop(download_id, None)
                torrent_progress.pop(download_id, None)
                
                # Update progress
                download_progress[download_id]['status'] = 'cancelled'
                
                return True
    except Exception as e:
        print(f"Error stopping torrent: {e}")
    
    return False


@csrf_exempt
def download_torrent(request, download_id, magnet_or_file):
    """Start torrent download"""
    try:
        # Create download directory
        save_dir = os.path.join(download_folder, f'torrent_{download_id}')
        os.makedirs(save_dir, exist_ok=True)
        
        # Initialize progress
        download_progress[download_id] = {
            'status': 'starting',
            'percent': 0,
            'downloaded_bytes': 0,
            'total_bytes': None,
            'speed': 0,
            'eta': None,
            'filename': 'Torrent Download',
            'method': 'torrent',
            'can_pause': True,
            'resumable': True,
            'type': 'torrent',
            'save_path': save_dir
        }
        
        # Get selected files from request
        selected_files = None
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                selected_files = data.get('selected_files')
            except:
                pass
        
        # Start torrent download in thread
        def torrent_thread():
            success = start_torrent_download(download_id, url, save_dir)
            if not success:
                download_progress[download_id] = {
                    'status': 'error',
                    'error': 'Failed to start torrent download',
                    'method': 'torrent'
                }
        
        thread = threading.Thread(target=torrent_thread, daemon=True)
        thread.start()
        
        return JsonResponse({
            'status': 'started',
            'download_id': download_id,
            'message': 'Torrent download started',
            'method': 'torrent',
            'can_pause': True,
            'resumable': True
        })
        
    except Exception as e:
        return JsonResponse({'error': f'Torrent download failed: {str(e)}'}, status=500)


@csrf_exempt
def start_torrent_download_view(request):
    """Start a torrent download from magnet URL or uploaded file"""
    if request.method == 'POST':
        try:
            # Handle file upload
            if request.FILES and 'torrent_file' in request.FILES:
                torrent_file = request.FILES['torrent_file']
                
                # Save uploaded file temporarily
                temp_dir = tempfile.gettempdir()
                temp_path = os.path.join(temp_dir, f'upload_{int(time.time())}.torrent')
                
                with open(temp_path, 'wb+') as destination:
                    for chunk in torrent_file.chunks():
                        destination.write(chunk)
                
                # Use the temp file path
                torrent_source = temp_path
                download_id = f"torrent_{int(time.time())}_{hashlib.md5(temp_path.encode()).hexdigest()[:8]}"
                
            else:
                # Handle magnet URL
                data = json.loads(request.body)
                magnet_url = data.get('magnet_url')
                
                if not magnet_url or not is_magnet_url(magnet_url):
                    return JsonResponse({'error': 'Valid magnet URL required'}, status=400)
                
                torrent_source = magnet_url
                download_id = f"torrent_{int(time.time())}_{hashlib.md5(magnet_url.encode()).hexdigest()[:8]}"
            
            # Get selected files if any
            selected_files = None
            if 'selected_files' in request.POST:
                try:
                    selected_files = json.loads(request.POST['selected_files'])
                except:
                    pass
            
            # Create download directory
            save_dir = os.path.join(download_folder, f'torrent_{download_id}')
            os.makedirs(save_dir, exist_ok=True)
            
            # Initialize progress
            download_progress[download_id] = {
                'status': 'starting',
                'percent': 0,
                'downloaded_bytes': 0,
                'total_bytes': None,
                'speed': 0,
                'eta': None,
                'filename': 'Torrent Download',
                'method': 'torrent',
                'can_pause': True,
                'resumable': True,
                'type': 'torrent',
                'save_path': save_dir
            }
            
            # Start torrent download in thread
            def torrent_thread():
                success = start_torrent_download(download_id, torrent_source, save_dir, selected_files)
                if not success:
                    download_progress[download_id] = {
                        'status': 'error',
                        'error': 'Failed to start torrent download',
                        'method': 'torrent'
                    }
            
            thread = threading.Thread(target=torrent_thread, daemon=True)
            thread.start()
            
            # Clean up temp file if it was uploaded
            if 'temp_path' in locals():
                try:
                    os.remove(temp_path)
                except:
                    pass
            
            return JsonResponse({
                'status': 'started',
                'download_id': download_id,
                'message': 'Torrent download started',
                'method': 'torrent',
                'can_pause': True,
                'resumable': True
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Torrent download failed: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'POST method required'}, status=405)

@csrf_exempt
def get_torrent_info_view(request):
    """Get detailed torrent information"""
    if request.method == 'POST':
        try:
            # Handle file upload
            if request.FILES and 'torrent_file' in request.FILES:
                torrent_file = request.FILES['torrent_file']
                
                # Save uploaded file temporarily
                temp_dir = tempfile.gettempdir()
                temp_path = os.path.join(temp_dir, f'info_{int(time.time())}.torrent')
                
                with open(temp_path, 'wb+') as destination:
                    for chunk in torrent_file.chunks():
                        destination.write(chunk)
                
                # Get torrent info
                torrent_info = get_torrent_info_from_file(temp_path)
                
                # Clean up temp file
                try:
                    os.remove(temp_path)
                except:
                    pass
                
                if torrent_info:
                    return JsonResponse({
                        'success': True,
                        'torrent_info': torrent_info,
                        'type': 'file_upload'
                    })
                else:
                    return JsonResponse({'error': 'Failed to parse torrent file'}, status=400)
            
            else:
                # Handle magnet URL
                data = json.loads(request.body)
                magnet_url = data.get('magnet_url')
                
                if not magnet_url or not is_magnet_url(magnet_url):
                    return JsonResponse({'error': 'Valid magnet URL required'}, status=400)
                
                torrent_info = parse_magnet_info(magnet_url)
                
                if torrent_info:
                    return JsonResponse({
                        'success': True,
                        'torrent_info': torrent_info,
                        'type': 'magnet_url'
                    })
                else:
                    return JsonResponse({'error': 'Failed to parse magnet URL'}, status=400)
                    
        except Exception as e:
            return JsonResponse({'error': f'Error getting torrent info: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'POST method required'}, status=405)

def get_torrent_info_from_file(torrent_file_path: str) -> Dict[str, Any]:
    """Get torrent information from .torrent file"""
    try:
        with open(torrent_file_path, 'rb') as f:
            metadata = bencode.bdecode(f.read())
        
        info = metadata.get('info', {})
        
        # Calculate info hash
        info_bencoded = bencode.bencode(info)
        info_hash = hashlib.sha1(info_bencoded).hexdigest()
        
        # Get file list
        files = []
        if 'files' in info:
            # Multi-file torrent
            for file_info in info['files']:
                path = '/'.join(file_info['path'])
                files.append({
                    'path': path,
                    'size': file_info['length'],
                    'selected': True  # Default all files selected
                })
        else:
            # Single file torrent
            files.append({
                'path': info.get('name', 'unknown'),
                'size': info.get('length', 0),
                'selected': True
            })
        
        return {
            'type': 'torrent',
            'name': info.get('name', 'Unknown Torrent'),
            'info_hash': info_hash,
            'total_size': sum(f['size'] for f in files),
            'files': files,
            'trackers': metadata.get('announce-list', []) or [metadata.get('announce')] if metadata.get('announce') else [],
            'created_by': metadata.get('created by', 'Unknown'),
            'creation_date': metadata.get('creation date', 0),
            'comment': metadata.get('comment', ''),
            'file_path': torrent_file_path
        }
        
    except Exception as e:
        print(f"Error reading torrent file: {e}")
        return None


# Initialize the main event loop when Django starts
def initialize_main_event_loop():
    """Initialize the main event loop for WebSocket updates"""
    try:
        # This should be called when Django starts
        set_main_event_loop()
        print(f"✅ Main event loop initialized: {main_event_loop}")
    except Exception as e:
        print(f"❌ Error initializing main event loop: {e}")

# Call it at module load or in your app config
initialize_main_event_loop()
