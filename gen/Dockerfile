# Use an official Python runtime as a parent image
FROM python:3.8

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . /app/

# Expose the port that the Django app will run on
EXPOSE 8002

# Run the Django development server when the container launches
CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]