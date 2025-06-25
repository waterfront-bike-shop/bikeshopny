# HTTPS Server for local development for Lightspeed APU OAuth

- Set up a local HTTPS certificate via:
- ```brew install mkcert```
- ```brew install nss```  if using Firefox
- ```mkcert -install```
- run in project folder:
- ```mkcert localhost```

- go mod init
- go mod tidy
- go run .

- AFTERWARDS (OPTIONAL)
- ```mkcert -uninstal```

### Why?

- Lightspeed needs a https server, and when developing locally that DOES NOT come standard with localhost. All just to test this out without deploying as a test branch on Vercel (which would be easy) -- but don't commit things that don't work.

### TODO

- Add this logic to the Next.js endpoint for Production.
- Switch the Lightspeed API App call back to PRODUCTION (https://bikeshopny.com/api/callback)

