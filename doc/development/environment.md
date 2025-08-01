# Adonis & Svelte Starter Kit - Development Environment Variables

---

### Development backend .env (back/.env)

Note that `FRONT_URI` and `API_URI` are automatically generated from `FRONT_PORT` and `PORT` backend environment variables respectively by Docker.

```
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=
LOG_LEVEL=debug

DB_CONNECTION=pg

DB_HOST=db
DB_PORT=5432
DB_USER=superadmin
DB_PASSWORD=xxx
DB_DATABASE=adonis_svelte_starter_kit_db

LOGS_DB_USER=superadmin
LOGS_DB_PASSWORD=xxx
LOGS_DB_DATABASE=adonis_svelte_starter_kit_db_logs

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FRONT_PORT=5173
GITHUB_REPOSITORY=https://github.com/Tassadar921/Adonis-Svelte-starter-kit
ACCOUNT_SENDER_EMAIL=account@adonis_svelte_starter_kit.fr
BREVO_API_KEY=
ADMIN_EMAIL=
FRIEND_EMAILS=[]
```

| Variable                | Value                                                                       |
|-------------------------|-----------------------------------------------------------------------------|
| `PORT`                  | 3333                                                                        |
| `HOST`                  | 0.0.0.0                                                                     |
| `NODE_ENV`              | development                                                                 |
| `APP_KEY`               | **Run `cd back && node ace generate:key` to generate this field**           |
| `LOG_LEVEL`             | debug                                                                       |
| `DB_CONNECTION`         | pg                                                                          |
| `DB_HOST`               | db                                                                          |
| `DB_PORT`               | 5432                                                                        |
| `DB_USER`               | superadmin                                                                  |
| `DB_PASSWORD`           | xxx                                                                         |
| `DB_DATABASE`           | adonis_svelte_starter_kit_db                                                |
| `LOG_DB_USER`           | superadmin                                                                  |
| `LOG_DB_PASSWORD`       | xxx                                                                         |
| `LOG_DB_DATABASE`       | adonis_svelte_starter_kit_db_logs                                           |
| `REDIS_HOST`            | 127.0.0.1                                                                   |
| `REDIS_PORT`            | 6379                                                                        |
| `REDIS_PASSWORD`        |                                                                             |
| `DISCORD_CLIENT_ID`     | **`A valid Discord client ID`**                                             |
| `DISCORD_CLIENT_SECRET` | **`A valid Discord client secret`**                                         |
| `GITHUB_CLIENT_ID`      | **`A valid GitHub client ID`**                                              |
| `GITHUB_CLIENT_SECRET`  | **`A valid GitHub client secret`**                                          |
| `GOOGLE_CLIENT_ID`      | **`A valid Google client ID`**                                              |
| `GOOGLE_CLIENT_SECRET`  | **`A valid Google client secret`**                                          |
| `FRONT_PORT`            | 5173                                                                        |
| `GITHUB_REPOSITORY`     | https://github.com/Tassadar921/Adonis-Svelte-starter-kit                    |
| `ACCOUNT_SENDER_EMAIL`  | account@adonis_svelte_starter_kit.fr                                        |
| `BREVO_API_KEY`         | **`A valid Brevo API key`**                                                 |
| `ADMIN_EMAIL`           | **`Put your email here`**                                                   |
| `FRIEND_EMAILS`         | [] **Feel free to add other emails to create other users or test emailing** |

---

### Development frontend .env (front/.env)

Note that `PUBLIC_FRONT_URI` and `PUBLIC_API_BASE_URI` are automatically generated from `FRONT_PORT` and `PORT` backend environment variables respectively by Docker.

`PUBLIC_FRONT_PORT` and `PUBLIC_GITHUB_REPOSITORY` are also injected from backend environment variables.

```
PUBLIC_FRONT_PORT=""
PUBLIC_FRONT_URI=""
PUBLIC_API_BASE_URI=""
PUBLIC_API_REAL_URI=""
PUBLIC_GITHUB_REPOSITORY=""
PUBLIC_DEFAULT_IMAGE=/assets/default/image.png
PUBLIC_TWITTER_HANDLE=""
```

| Variable                   | Value                                                     |
|----------------------------|-----------------------------------------------------------|
| `PUBLIC_FRONT_PORT`        | ""                                                        |
| `PUBLIC_FRONT_URI`         | ""                                                        |
| `PUBLIC_API_BASE_URI`      | ""                                                        |
| `PUBLIC_API_REAL_URI`      | ""                                                        |
| `PUBLIC_GITHUB_REPOSITORY` | ""                                                        |
| `PUBLIC_DEFAULT_IMAGE`     | /assets/default/image.png                                 |
| `PUBLIC_TWITTER_HANDLE`    | **`Put your twitter @ here, for example : @Tassadar921`** |

---

### Development index documentation

&larr; [Back to index](index.md)
