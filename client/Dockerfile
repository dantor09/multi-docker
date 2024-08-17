# BUILD PHASE

# Setup the operating system (Linux alpine 5mb) and the runtime (node.js version 16)
FROM node:16-alpine as builder

# Setting up the working directory inside the container
WORKDIR '/app'

# Copying over the packagfe.json file
COPY package.json .

# npm installing the dependencies in package.json 
RUN npm install

# Copying over the source code from local computer
# COPY ./client ./app
COPY . .

# Set up the default command, in this case the
# npm run build command produces a production ready
# package that will be served by nginx
CMD ["npm", "run", "build"]

# RUN PHASE

# Download nginx 
FROM nginx

# Expose port 3000 to the world (this is separate from the container port)
EXPOSE 3000

# The reason for the default.conf file is partly to change the default
# port that nginx listens on from 80 to port 3000 where the react app
# will be served from

# use the default.conf file in the local directory and copy/overwrite
# the file in the nginx based image at /etc/nginx/conf.d/default.conf
# this sets the configuration for the nginx installation.

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Finally, copy over the production ready react file (build) 
# from the build phase (builder) and copy into the directory
# that nginx will serve the files from by default and also
# explicitly stated in the default.conf file
COPY --from=builder /app/build /usr/share/nginx/html

# No need for a start command, nginx already does that by itself.