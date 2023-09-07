# Explainable AI: An Explanatory Model for a Scheduling COP

## Overview

This repository is dedicated to the development of an Explanatory Model for a CP-based shift scheduling algorithm with optimization. The project aims to deliver human-centered explanations by leveraging cognitive psychology principles.

## Architecture

The software architecture consists of four key components:

- **Frontend**: Developed using ReactJS for a responsive and dynamic UI.
- **Backend**: Built with Python Flask for managing API calls and data manipulation.
- **In-Memory Data Storage**: For efficient data handling and quick retrieval. No Database used here.
- **COP Model**: Constraint Optimization Programming model for generating optimized shift plans. This is based on a master thesis of Sebastian Storcher.

## Features

The Explanatory Model includes the following key features:

- Frequently Asked Questions
- Scenario-Infographic
- Flipped Classroom: Quiz
- Analysis Dashboard
- Educational Drag-and-Drop Optimization Game
- etc.

## Project Structure

This repository is organized as follows:

- **backend**: This directory contains all the server-side logic.

- **cop_model**: This directory contains everything related to the Constraint Optimization Problem (COP) model.

- **frontend**: All client-side code is located here.

- **node_modules**: This directory contains Node.js modules required for the frontend.

## How to Run Locally

### Requirements
- Node.js and npm
- Python 3.x
- Flask


### Steps

1. Clone this repository.
2. Navigate to the project directory.
3. Run `npm install` in the `xai_frontend` folder to install React dependencies.
4. Run `pip install -r requirements.txt` in the project folder to install Flask and other Python dependencies.
5. Use `npm start` in the `xai_frontend` folder to start the React development server.
6. Use `flask run` or `python backend.py` to start the Flask server.
7. Follow the instructions in Terminal and see the model in your internet browser.

## Contributing

Please create a new branch for each new feature or bugfix. Refer to GitLab's branching strategy and workflow for more details.

Contact: giaphong.tran@tum.de
