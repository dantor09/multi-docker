FROM nginx:latest

# Copy custom configuration file to NGINX configuration directory
# take my default.conf file and overwrite the existing default.conf file.
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
