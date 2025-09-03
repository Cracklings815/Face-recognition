# Face Recognition System

![Python](https://img.shields.io/badge/python-3.7%2B-blue)
![OpenCV](https://img.shields.io/badge/OpenCV-enabled-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Stars](https://img.shields.io/github/stars/Cracklings815/Face-recognition?style=social)

A Python-based face detection and recognition system using **OpenCV** and the **face_recognition** library.

## Features

- **Face Detection**: Locate human faces in images or video streams  
- **Face Recognition**: Identify and verify individuals from a stored dataset  
- **Real-time Processing**: Recognize faces from webcam input in real-time  
- **Dataset Support**: Add and manage multiple faces for recognition  
- **Multiple Face Handling**: Detect and recognize more than one face in the same frame  

## Installation

### Prerequisites
- Python 3.7 or higher  
- pip (Python package manager)  

### Step-by-Step Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Cracklings815/Face-recognition.git
   cd Face-recognition
   ```
2. Install the dependencies:
```bash
pip install -r requirements.txt
`````

3. Run the face recognition script:
```bash
   python main.py
`````

## Usage

- **Place the images of people you want to recognize inside the images/** folder.  
- **Run the program** to start webcam-based face detection and recognition.  
- **Add new images** to expand your recognition dataset.  

## Project Structure
```bash
Face-recognition/
│── images/           # Folder for training images
│── main.py           # Entry point for running recognition
│── requirements.txt  # Python dependencies
│── README.md         # Project documentation
`````


## Dependencies

- **OpenCV**  
- **face_recognition**  
- **numpy**y

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for details.
