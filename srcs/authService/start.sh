#!/bin/sh

until pg_isready -h users_db -U authuser -p 5432; do
  >&2 echo "Database not ready - waiting..."
  sleep 2
done


>&2 echo "The database is ready."

python manage.py makemigrations
python manage.py migrate

exec "$@"
