# Node + Express

A simple Node.js API, written using Typescript, and Express.

## Getting Started

**1. Clone the application**

```bash
git clone https://github.com/nicolaspearson/node.api.express.git
```

**2. Start the database**

```bash
docker-compose up
```

**3. Build and run the app using cargo**

#### Run the app in development mode:

```bash
npm run start
```

The app will start running at <http://localhost:8000>

#### Run the app in release mode:

```bash
npm install -g http-server
npm run build
http-server -p 8000 ./build
```

The app will start running at <http://localhost:8000>

## Endpoints

The following endpoints are available:

```
GET /hero/{heroId}
```

```
GET /heroes
```

```
POST /hero
```

```
PUT /hero/{heroId}
```

```
DELETE /hero/{heroId}
```

## Migrations

```
npm run typeorm:cli -- migration:create -n Initial
```

## Contribution Guidelines

Never commit directly to master, create a feature branch and submit a pull request.
