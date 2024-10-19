from google.cloud import storage
import os

PROJECT_ID = 'poetic-bongo-439118-t6'  # Replace with your actual project ID

def upload_image_to_gcs(image_data, filename, bucket_name):
    client = storage.Client(project=PROJECT_ID)
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_string(image_data, content_type='image/jpeg')
    return blob.public_url
