from openai import AzureOpenAI
import os
from dotenv import load_dotenv
import requests
import app.services.prompts as prompts
import json


load_dotenv()

class OpenAIClient:
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
            api_version="2024-07-01-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

    def classify_text(self, text: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompts.classify_text_prompt},
                {"role": "user", "content": text}
            ]
        ).choices[0].message.content
        if response not in ["none", "illustration", "diagram", "flyer"]:
            return self.classify_text(text)
        return response
    
    def generate_prompt(self, text: str, category: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompts.generate_prompt_prompts[category]},
                {"role": "user", "content": text}
            ]
        ).choices[0].message.content

        return response
    
    def generate_image(self, prompt: str) -> str:
        response = self.client.images.generate(
            model="dalle",
            prompt=prompt
        )
        return response.data[0].url
    
    def generate_diagram(self, prompt: str) -> str:
        payload = { "text": prompt }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer " + os.getenv("ERASER_API_TOKEN")
        }
        response = requests.post(os.getenv("ERASER_API_URL"), json=payload, headers=headers)
        return json.loads(response.text)["imageUrl"]
