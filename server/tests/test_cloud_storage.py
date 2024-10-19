import os
import unittest
from io import BytesIO
from PIL import Image
from server.app.cloud_storage import upload_image_to_gcs, PROJECT_ID

class TestCloudStorage(unittest.TestCase):
    def setUp(self):
        self.bucket_name = "picaissoimages"
        self.test_image = Image.new('RGB', (100, 100), color='red')
        self.test_image_buffer = BytesIO()
        self.test_image.save(self.test_image_buffer, format='JPEG')
        self.test_image_data = self.test_image_buffer.getvalue()
        self.test_filename = "test_image.jpg"

    def test_upload_image_to_gcs(self):
        print(f"Attempting to upload to bucket: {self.bucket_name}")

        try:
            public_url = upload_image_to_gcs(self.test_image_data, self.test_filename, self.bucket_name)

            self.assertIsNotNone(public_url)
            self.assertTrue(public_url.startswith("https://"))
            self.assertIn(self.bucket_name, public_url)
            self.assertIn(self.test_filename, public_url)

            print(f"Image uploaded successfully. Public URL: {public_url}")
        except Exception as e:
            self.fail(f"Failed to upload image: {str(e)}")

if __name__ == '__main__':
    unittest.main()
