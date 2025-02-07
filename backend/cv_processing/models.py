from django.db import models

class UploadedCV(models.Model):
    user_id = models.CharField(max_length=255)  # Reference to the user
    file_id = models.CharField(max_length=255, unique=True)  # GridFS file ID
    filename = models.CharField(max_length=255)  # Filename
    upload_date = models.DateTimeField(auto_now_add=True)  # Timestamp

    def __str__(self):
        return self.filename


