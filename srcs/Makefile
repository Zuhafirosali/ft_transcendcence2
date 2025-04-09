SSL_DIR=nginx/conf
SSL_CERT=$(SSL_DIR)/localhost.crt
SSL_KEY=$(SSL_DIR)/localhost.key

up: generate_ssl
	@mkdir -p /tmp/user_db /tmp/authService /tmp/chatService /tmp/apigateway /tmp/tournament /tmp/matchmaking /tmp/game $(SSL_DIR)
	@chmod 777 /tmp/user_db /tmp/authService /tmp/chatService /tmp/apigateway /tmp/tournament /tmp/matchmaking /tmp/game $(SSL_DIR)
	@docker compose up -d --build

down:
	@docker compose down

clean: down
	@docker system prune -a -f
	@docker volume prune -f
	@docker network prune -f
	@docker compose down --volumes --remove-orphans
	@rm -rf /tmp/authService /tmp/chatService /tmp/apigateway /tmp/tournament /tmp/matchmaking /tmp/game $(SSL_DIR)/*.crt $(SSL_DIR)/*.key

re: clean up

status:
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

restart:
	@docker compose down
	@docker compose up -d

generate_ssl:
	@mkdir -p $(SSL_DIR)
	@if [ ! -f "$(SSL_CERT)" ] || [ ! -f "$(SSL_KEY)" ]; then \
		echo "🔐 Generating SSL Certificate..."; \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout $(SSL_KEY) -out $(SSL_CERT) \
		-subj "/C=AE/ST=ABU DHABI/L=ABU DHABI/O=TranPong/OU=Developer/CN=localhost"; \
		echo "✅ SSL Certificate Generated."; \
	else \
		echo "✅ SSL Certificate already exists."; \
	fi

.PHONY: all re down clean generate_ssl