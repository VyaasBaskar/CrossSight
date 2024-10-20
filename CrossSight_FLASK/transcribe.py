import speech_recognition as sr
import os
import subprocess


def transcribe():
    # Initialize recognizer
    recognizer = sr.Recognizer()

    # Load the audio file
    input_file = "./audio.wav"
    output_file = "./output_audio.wav"
    command = [
        "ffmpeg",
        "-i", "audio.wav",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "output_audio.wav"
    ]

    text = ""

    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print("Command executed successfully")
        print("Output:", result.stdout)
    except subprocess.CalledProcessError as e:
        print("An error occurred while executing the command")
        print("Error output:", e.stderr)
    with sr.AudioFile(output_file) as source:
        audio = recognizer.record(source)  # Record the audio
        try:
            # Convert speech to text
            text = recognizer.recognize_google(audio)
            print("Transcription:", text)
        except sr.UnknownValueError:
            print("Speech Recognition could not understand the audio")
        except sr.RequestError:
            print("Could not request results from Google Speech Recognition service")


    # delete the output file
    os.remove(output_file)

    return text