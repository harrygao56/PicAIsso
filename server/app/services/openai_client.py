from openai import AzureOpenAI
import os
from dotenv import load_dotenv
import requests


load_dotenv()

class OpenAIClient:
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
            api_version="2024-07-01-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

    def classify_text(self, text: str) -> str:
        print( "classifying text")
        print(text)
        prompt = """
        You are a specialized algorithm that classifies text messages so that it can be passed to an appropriate image generation model.

        You will be given a text message and you will need to classify it into one of the following categories:
        - none
        - illustration
        - diagram
        - flyer

        The purpose of this classification is to determine the most helpful image that can be sent along with the text message that can help the user convey what they are trying to communicate.
        For the case of "none", this means that an image would not be helpful to be sent along with the text message. For example, if the user is asking a question or they are saying hello.
        For the case of "illustration", this mean that an illustrative image would help the recipient visualize what the sender is describing. For example, if the user is describing a food item or scenery.
        For the case of "diagram", this means that a diagram would help the recipient visualize and understand what the sender is describing. For example, if the user is describing a complex process, a concept, or a plan.
        For the case of "flyer", this means that a flyer (a graphic with words on it) would be helpful. For example, if the user is congratulating someone on their birthday, anniversary, etc or if the user is inviting people to an event.

        Please respond with the category only.
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ]
        ).choices[0].message.content
<<<<<<< Updated upstream:server/app/services/openai_client.py

=======
        if response not in ["none", "illustration", "diagram", "flyer"]:
            return self.classify_text(text)
>>>>>>> Stashed changes:server/app/services/openai-client.py
        return response
    
    def generate_flyer_prompt(self, text: str) -> str:
        return ""
    
    def generate_illustration_prompt(self, text: str) -> str:
        return ""
    
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
        return response.text
