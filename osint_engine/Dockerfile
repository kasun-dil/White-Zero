# Use the official Microsoft Playwright Python image with Python 3.10 and browsers pre-installed
FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

# Set work directory
WORKDIR /app

# Install dependencies first (for caching layers)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Expose port (FastAPI default, overridden dynamically by the host PORT environment variable)
EXPOSE 8001

# Run uvicorn dynamically binding to the port assigned by Render ($PORT)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}"]
