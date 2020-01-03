# Le Baguette: Spaced repetition API!
# About
Server is used for back end of app and connects to client and uses spaced repetition to learn a language. 

## WEBSITE: [click here](https://spaced-repetition-app.mal3905.now.sh/learn)

## Technoligies Used
Client side: React, Javascript, Zeit, HTML and CSS.

Server side: Express.js, Node.js, PostgreSQL and Heroku. 

## Links to repos: [Client](https://github.com/thinkful-ei-heron/Dan_Maria_Spaced-Repetition.git) | [Server](https://github.com/thinkful-ei-heron/Dan_Maria_Spaced-Repitition-API.git)

# URL/ Endpoints: 

## /api/auth : 
POST: responds with JWT auth token using secrete when user enters valid user credentials.

PATCH: Refreshes token every few mins
    
    {
        user_name: String,
        password: String
    }

        res.body
    {
        authToken: String
    }

## /api/language
GET: Gets language chart owned by the logged in user

        {
            language: Object, 
            words: Array
        }

GET/head: Gets language head with next words/ scores.  

        {
        nextword: String,
        wordCorrectCount: Interger,
        wordIncorrectCount: Interger,
        totalScore: Interger
        }

POST: Submits a guess for specified language and responds with incorrect/correct feedback. 

        {
        guess: String
        }

        {
        nextWord: String, 
        wordCorrectCount: Interger,
        wordIncorrectCount: Interger,
        totalScore: Interger,
        answer: String,
        isCorrect: Boolean
        }



### /api/user
POST: Lets user register for an account and posts data into the database so user can login next time.

    {
    user_name: String,
    password: String
    }

    {
    id: userId,
    user_name: String,
    date_created: Date
    }



# Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
