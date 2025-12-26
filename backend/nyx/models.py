# models.py
from django.db import models
import json

class DownloadHistory(models.Model):
    filename = models.CharField(max_length=255)
    original_url = models.TextField()
    download_path = models.TextField()  # Full path to the file
    file_size = models.BigIntegerField(null=True, blank=True)
    format_info = models.JSONField(default=dict)  # Store format details
    status = models.CharField(max_length=20, default='completed')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(auto_now_add=True)
    download_count = models.IntegerField(default=1)  # Track redownloads
    
    class Meta:
        db_table = 'download_history'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} ({self.file_size} bytes)"