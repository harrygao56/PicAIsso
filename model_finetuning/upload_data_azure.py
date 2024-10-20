import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT_FINETUNE"), 
  api_key=os.getenv("AZURE_OPENAI_API_KEY_FINETUNE"),  
  api_version="2024-07-01-preview"
)

training_file_name = 'training.jsonl'
validation_file_name = 'validation.jsonl'

training_response = client.files.create(
    file=open(training_file_name, "rb"), purpose="fine-tune"
)
training_file_id = training_response.id

validation_response = client.files.create(
    file=open(validation_file_name, "rb"), purpose="fine-tune"
)
validation_file_id = validation_response.id

print("Training file ID:", training_file_id)
print("Validation file ID:", validation_file_id)