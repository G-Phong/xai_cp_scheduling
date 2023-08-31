# Explainable AI: An explanatory model for a scheduling COP

## Overview

This repository is dedicated to the development of an Explanatory Model for a CP-based shift scheduling algorithm with optimization. The project aims to deliver human-centered explanations by leveraging cognitive psychology principles.

## Architecture

The software architecture consists of four key components:

- **Frontend**: Developed using ReactJS for a responsive and dynamic UI.
- **Backend**: Built with Python Flask for managing API calls and data manipulation.
- **In-Memory Data Storage**: For efficient data handling and quick retrieval.
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
    - **api**: Here, you'll find all the API endpoints.
  
- **frontend**: All client-side code is located here.

- **cop_model**: This directory contains everything related to the Constraint Optimization Problem (COP) model.

- **in_memory_data**: This folder serves as the in-memory data store for quick data access and manipulation.

- **reference_code**: This directory stores reference code which is not in active use but is kept for archival or reference purposes. The implementation was done by Sebastian Storcher.

- **README.md**: Provides a comprehensive overview detailing how to navigate through the project.

- **requirements.txt**: Lists all the Python dependencies required for this project.


## How to Run Locally

### Requirements
- npm
- Python 3.x
- Flask

### Steps

1. Clone this repository.
2. Navigate to the project directory.
3. Run `npm install` to install React dependencies.
4. Run `pip install -r requirements.txt` to install Flask and other Python dependencies.
5. Use `npm start` to start the React development server.
6. Use `flask run` to start the Flask server.

## Contributing

Please create a new branch for each new feature or bugfix. Refer to GitLab's branching strategy and workflow for more details.

Contact: giaphong.tran@tum.de
