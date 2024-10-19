from google.cloud import storage
import os

PROJECT_ID = 'poetic-bongo-439118-t6'
storage_client = storage.Client(project=PROJECT_ID)
bucket_name = "picaissoimages"
bucket = storage_client.bucket(bucket_name)

def upload_image_data_to_gcs(image_data, filename):
    blob = bucket.blob(filename)
    blob.upload_from_string(image_data, content_type='image/jpeg')
    return blob.public_url

def upload_image_file_to_gcs(image_file, filename):
    blob = bucket.blob(filename)
    blob.upload_from_file(image_file)
    return blob.public_url