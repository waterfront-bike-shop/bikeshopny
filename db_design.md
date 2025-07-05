# DB Design / Postgres for Bike App

## This database for Bikeshopny.com needs to:
- Do authentication for an Admin user(s) (few in number) quite securely, 
- Hold the info necessary for the Site to connect to Lightspeed's API
- Act as a minimal CMS for content for the website

## Needs

- Admin User
- Lightspeed API section that holds expiration, token, and future token
- Local copy of items? Like a cache for when can't connect to lightspeed
- CARDS and CONTENT (Can it have MD?)
- PAGES/LOCATIONS
- IMAGES (ALSO, uploads to VERCEL BLOB?)

## Tables

### user
id          UNIQUE PRIMARYU KEY INT SERIAL (OR TRICKY NUMBER so not easy to guess)
username    VARCHAR 40
first_name  STRING
last_name   STRING
admin       boolean
password    VARCHAR 50 (WILL BE HASHED WITH ARGON2)
date_added  CURRENT TIMESTAMP
email       VARCHAR 40 UNIQUE (Could be used to reset password)

### lightspeed_api
id              UNIQUE PRIMARY KEY INT
account_id      INT (i.e. `123456`) Optional (because needs to be filled in after getting the other keys)
access_token    VARCHAR
refresh_token   VARCHAR
timestamp       timestamp 
expires_in      int (time in seconds)

