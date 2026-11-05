SHELL := /bin/sh

COMPOSE ?= docker compose
POWERSHELL ?= powershell.exe
BACKEND := $(COMPOSE) run --rm --no-deps backend

.PHONY: help check-files check-compose start migrate-answers-dry-run migrate-answers migrate-images-dry-run migrate-images migrate-family-images-dry-run migrate-family-images status logs down

help:
	@printf '%s\n' \
	  'make start                       Sobe os containers e prepara o banco' \
	  'make migrate-answers-dry-run    Simula a migração das respostas' \
	  'make migrate-answers             Executa a migração das respostas' \
	  'make migrate-images-dry-run     Simula a migração das imagens' \
	  'make migrate-images              Executa a migração das imagens' \
	  'make status                     Mostra o estado dos containers' \
	  'make logs                       Mostra os logs' \
	  'make down                       Para os containers sem remover volumes'

check-files:
	@test -f 'Dados para serem migrados.xlsx' || { echo 'Erro: planilha não encontrada.'; exit 1; }
	@test -f 'athis-drive-migration-dd29e56d2788.json' || { echo 'Erro: credencial do Google Drive não encontrada.'; exit 1; }
	@test -f 'minio.license/minio.license' || { echo 'Erro: licença do MinIO não encontrada.'; exit 1; }

check-compose: check-files
	@$(COMPOSE) config --quiet

start: check-compose
	$(COMPOSE) up -d --build
	$(COMPOSE) run --rm --no-deps minio-init

migrate-answers-dry-run: check-compose
	$(BACKEND) npm run migrate:dry-run

migrate-answers: check-compose
	$(BACKEND) npm run migrate:execute

migrate-images-dry-run: check-compose
	$(BACKEND) npm run migrate:images:dry-run

migrate-images: check-compose
	$(COMPOSE) run --rm --no-deps minio-init
	$(BACKEND) npm run migrate:images
	$(BACKEND) npm run migrate:family-images

migrate-family-images-dry-run: check-compose
	$(BACKEND) npm run migrate:family-images:dry-run

migrate-family-images: check-compose
	$(COMPOSE) run --rm --no-deps minio-init
	$(BACKEND) npm run migrate:family-images

status:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs --tail=100 -f

down:
	$(COMPOSE) down

start-powershell:
	$(POWERSHELL) -NoProfile -ExecutionPolicy Bypass -File .\migrate.ps1 -Command Start
