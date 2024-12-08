# Use the official PostgreSQL image as a base
FROM postgres:14

# Set environment variables
ENV POSTGRES_DB=${DBNAME}
ENV POSTGRES_USER=${DBUSERNAME}
ENV POSTGRES_PASSWORD=${DBPASSWORD}

# Copy the backup file into the container
COPY dndbackup.dump /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432