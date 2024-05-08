default: frontend backend

up:
		docker compose -p llm_lab -f docker-compose.yml up -d

down:
		docker compose -p llm_lab -f docker-compose.yml down

frontend:
		docker build -t llm_lab/frontend -f ./app/Dockerfile ./app

backend:
		docker build -t llm_lab/backend -f ./api/Dockerfile ./api

docker-sqlite-migrate:
		docker compose -p llm_lab exec api bash -c ".venv/bin/python -m src.app_cli migrate up"

docker-sqlite-migrate-down:
		docker compose -p llm_lab exec api bash -c ".venv/bin/python -m src.app_cli migrate down"
