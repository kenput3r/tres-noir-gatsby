## Steps needed to successfully have a running developer build


1. Update gatsby to the latest version (v.4.1.0)
    ```sh
    npm install gatsby@latest
    ```
2. Update gatsby-plugin-gatsby-cloud to the latest version
    ```sh
    npm install gatsby-plugin-gatsby-cloud@latest
    ```
3. Add resolutions and peer dependency objects to package.json
    ```json
    // package.json
    "resolutions": {
        "webpack": "^5.61.0",
        "graphql": "^15.1.1"
    },
    "peerDependencies": {
        "gatsby": "^4.1.0"
    }
    ```
- The resolutions object must be added because all modules running graphql must have the same version.
4. Remove /node_modules and package-lock.json
    ```sh
    rm -rf node_modules && rm package-lock.json
    # if it exists, remove .cache as well
    rm -rf .cache
    ```
5. Run npm install and the develop build should be ready!
    ```sh
    npm install
    ```

## Notes

- This branch only updates the minimum dependencies to get a working version of the developer build, more updates could be made to remove deprecation warnings
- Here is Gatbsy's [migration guide](https://v4.gatsbyjs.com/docs/reference/release-notes/migrating-from-v3-to-v4/) for more reference.
- if gatsby-source-plugin is updated, the access keys in gatsby-config.js must be updated
shopName -> storeUrl: process.env.GATSBY_STORE_MY_SHOPIFY
accessToken -> password: process.env.GATSBY_STORE_PASSWORD