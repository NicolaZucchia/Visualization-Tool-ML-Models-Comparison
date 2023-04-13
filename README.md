# Visualization-Tool-ML-Models-Comparison

Authors: Nicola Zucchia, Daniel Kerrigan, Enrico Bertini

This repository includes part of the work I have been doing at Northeastern University, Boston, MA. 
The work focuses on developing a visualization tool that allow users to compare the performances of different Machine Learning models.

Repo contains a visual interface realized with HTML, CSS and JavaScript, and a Jupyter Notebook for the ML part.

Datasets analyzed include:
- Boston Housing Price
- Bike Rental 
- Diabetes (outcome is binary 0/1)

Model compared so far:
- XGBoost
- Linear Regression
- Neural Network (with 1 hidden layer)

First, we created locally the visualization tool with html, css and js. Models were trained in python and results saved in text file then uploaded in the tool.
Then, we included the tool and the training all together in jupyter notebook by means of Svelte, which helped us create the widget already working with predictions resulting from our training. 


