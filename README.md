# Pennywise App

Clone the repo:

```
git clone https://github.com/ncarchedi/pennywise-app.git
```

Install packages:

```
cd pennywise-app
yarn
```

Run the production version:

```
yarn start
```

Run tests:

```
yarn test
```

Backend: https://github.com/BGordts/pennywise-app-backend.git

## Environment Variables

Environment variables are kept in the .env file in the root of the repository.

To send the plaid environment, assign either 'sandbox' (only allows 'user_good' and 'pass_good' bank account) or 'development' (allows you to use your real bank account) to the ENVIRONMENT key. After making the change in the .env file, make a 'real' change (one that is not removed by the prettier, like adding a space) to GlobalContext.js and save the file to reload the .env file.

Every time you change the environment, you'll need to authenticate with plaid again.

## Deploying the App

Based on the instructions [here](https://docs.expo.io/versions/latest/distribution/uploading-apps/). This only works if you have the `EXPO_APPLE_ID` and `EXPO_APPLE_ID_PASSWORD` environment variables set:

```
expo build:ios
expo upload:ios --apple-id $EXPO_APPLE_ID --apple-id-password $EXPO_APPLE_ID_PASSWORD
```

You may be required to input an app-specific password, which can be generated [here](https://appleid.apple.com/).
