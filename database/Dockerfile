# Use the official PostgreSQL image as a base
FROM postgres:14

# Set environment variables
ENV POSTGRES_DB=dnd
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=projektanto

# Copy the backup file into the container
COPY dndbackup.dump /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432