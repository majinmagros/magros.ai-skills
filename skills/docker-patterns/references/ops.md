# Ops — .dockerignore, Debugging, Anti-Patterns

## .dockerignore

```
node_modules
.git
.env
.env.*
dist
coverage
*.log
.next
.cache
docker-compose*.yml
Dockerfile*
README.md
tests/
```

## Debugging

### Common Commands

```bash
# View logs
docker compose logs -f app           # Follow app logs
docker compose logs --tail=50 db     # Last 50 lines from db

# Execute commands in running container
docker compose exec app sh           # Shell into app
docker compose exec db psql -U postgres  # Connect to postgres

# Inspect
docker compose ps                     # Running services
docker compose top                    # Processes in each container
docker stats                          # Resource usage

# Rebuild
docker compose up --build             # Rebuild images
docker compose build --no-cache app   # Force full rebuild

# Clean up
docker compose down                   # Stop and remove containers
docker compose down -v                # Also remove volumes (DESTRUCTIVE)
docker system prune                   # Remove unused images/containers
```

### Debugging Network Issues

```bash
# Check DNS resolution inside container
docker compose exec app nslookup db

# Check connectivity
docker compose exec app wget -qO- http://api:3000/health

# Inspect network
docker network ls
docker network inspect <project>_default
```

## Anti-Patterns

```
# BAD: Using docker compose in production without orchestration
# Use Kubernetes, ECS, or Docker Swarm for production multi-container workloads

# BAD: Storing data in containers without volumes
# Containers are ephemeral -- all data lost on restart without volumes

# BAD: Running as root
# Always create and use a non-root user

# BAD: Using :latest tag
# Pin to specific versions for reproducible builds

# BAD: One giant container with all services
# Separate concerns: one process per container

# BAD: Putting secrets in docker-compose.yml
# Use .env files (gitignored) or Docker secrets
```
