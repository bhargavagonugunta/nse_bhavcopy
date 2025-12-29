# NSE Bhavcopy - Server Deployment Guide

## Prerequisites

- Docker and Docker Compose installed on your server
- Valid Google SMTP credentials configured in `.env` file
- Server has internet access to pull the Docker image from GitHub Container Registry

## Deployment Steps

### 1. Prepare the Environment

```bash
# Create project directory on server
mkdir -p ~/nse_bhavcopy
cd ~/nse_bhavcopy

# Copy docker-compose.yml to the server
# (Upload the docker-compose.yml file to this directory)

# Create required directories
mkdir -p downloads logs
```

### 2. Configure Environment Variables

Create a `.env` file with your Google SMTP credentials:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your actual credentials
nano .env
```

**Required Environment Variables:**
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_PORT`: 587
- `SMTP_SECURE`: true
- `SMTP_USER`: Your Gmail address
- `SMTP_PASS`: Your Google App Password (NOT your regular password)
- `SMTP_FROM`: Sender email address
- `SMTP_TO`: Recipient email address(es)

### 3. Pull the Docker Image

```bash
# Login to GitHub Container Registry (if private)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/bhargavagonugunta/nse_bhavcopy:sha-b53af59
```

### 4. Start the Application

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 5. Verify Deployment

```bash
# Check container health
docker ps

# View real-time logs
docker logs -f nse_bhavcopy_production

# Check if files are being downloaded
ls -lah downloads/
```

## Management Commands

### Start/Stop/Restart

```bash
# Start the service
docker-compose start

# Stop the service
docker-compose stop

# Restart the service
docker-compose restart

# Stop and remove containers
docker-compose down
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

### Update to New Version

```bash
# Pull new image
docker pull ghcr.io/bhargavagonugunta/nse_bhavcopy:sha-b53af59

# Recreate container with new image
docker-compose up -d --force-recreate

# Clean up old images
docker image prune -f
```

## Troubleshooting

### Container won't start
```bash
# Check detailed logs
docker-compose logs

# Verify environment variables
docker-compose config

# Check if port is already in use
netstat -tuln | grep <PORT>
```

### Email not sending
```bash
# Verify SMTP credentials in .env file
cat .env

# Test SMTP connection from container
docker exec -it nse_bhavcopy_production node -e "console.log(process.env)"
```

### Disk space issues
```bash
# Check disk usage
df -h

# Clean up old downloads
rm -rf downloads/*.zip

# Clean up Docker resources
docker system prune -a
```

## File Structure

```
~/nse_bhavcopy/
├── docker-compose.yml    # Docker Compose configuration
├── .env                  # Environment variables (never commit!)
├── .env.example          # Example environment file
├── downloads/            # Downloaded NSE bhavcopy files
├── logs/                 # Application logs
└── README.md            # This file
```

## Security Considerations

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use App Passwords** - Don't use your main Google account password
3. **Restrict file permissions**: `chmod 600 .env`
4. **Regular updates**: Keep the Docker image updated
5. **Monitor logs**: Check for any unauthorized access attempts

## Schedule with Cron (Optional)

To run the scraper on a schedule:

```bash
# Edit crontab
crontab -e

# Add this line to run daily at 6 PM IST
0 18 * * * cd ~/nse_bhavcopy && docker-compose restart
```

## Support

For issues or questions, please refer to the project repository.
