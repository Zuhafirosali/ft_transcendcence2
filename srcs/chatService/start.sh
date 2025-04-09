#!/bin/sh

until pg_isready -h ${USER_DB_HOST} -U ${USER_DB_USER} -p ${USER_DB_PORT}; do
  >&2 echo "Database not ready - waiting..."
  sleep 2
done

>&2 echo "Database is ready"

X=17

while true; do
  TABLE_COUNT=$(PGPASSWORD="$USER_DB_PASS" psql -h "$USER_DB_HOST" -U "$USER_DB_USER" -p "$USER_DB_PORT" -d "$USER_DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

  if [ "$TABLE_COUNT" -ge "$X" ]; then
    echo "Condition met. Total number of tables: $TABLE_COUNT"
    break
  else
    echo "Condition not met. Number of tables: $TABLE_COUNT - Waiting..."
  fi

  sleep 5
done

python manage.py makemigrations
python manage.py migrate --fake

exec "$@"
