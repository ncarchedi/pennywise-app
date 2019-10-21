# Pennywise App

Clone the repo:

```
git clone https://github.com/ncarchedi/pennywise-app.git
```

Install packages:

```
yarn install
```

Run the production version:

```
cd pennywise-app
yarn start
```

Run the development version:

```
cd pennywise-app
git checkout dev
yarn start
```

Run tests:

```
yarn test
```

Link to the backend: https://github.com/BGordts/pennywise-app-backend.git

## Environment variables

Environment variables are kept in the .env file in the root of the repository.

### ENVIORNMENT setting

To send the plaid environment, assign either 'sandbox' (only allows 'user_good' and 'pass_good' bank account) or 'development' (allows to use your real bank account) to the ENVIRONMENT key. After making the change in the .env file, make a 'real' (one that is not removed by the prettier, like adding a space) change to GlobalContext.js and save this file to reload the .env file.

Every time you change the environment, you'll need to authenticate with plaid again.
