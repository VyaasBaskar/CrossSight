import os
import base64

from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()


token = os.environ["OPENAI_API_KEY"]
endpoint = "https://models.inference.ai.azure.com"

model_name = "gpt-4o-mini"

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)


def get_image_data_url(image_file: str, image_format: str) -> str:
    try:
        with open(image_file, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
    except FileNotFoundError:
        print(f"Could not read '{image_file}'.")
        exit()
    return f"data:image/{image_format};base64,{image_data}"

def get_last_image_data_url() -> str:
    return get_image_data_url(os.path.join(os.path.dirname(__file__), "img.png"), "png]")

def vehicular_detection() -> str:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a car detection model. You will NOT return serial numbers, or makes and models. You will only return the number of cars in the image.",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "How many cars in the image?",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": get_last_image_data_url()
                        },
                    },
                ],
            },
        ],
        model=model_name,
    )

    return response.choices[0].message.content

def sign_reading() -> str:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a sign reader. Recognize and list only the following: Stop signs, bus stop signs, yield signs, pedestrian crossings.",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What signs are in the image?",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": get_last_image_data_url()
                        },
                    },
                ],
            },
        ],
        model=model_name,
    )

    return response.choices[0].message.content