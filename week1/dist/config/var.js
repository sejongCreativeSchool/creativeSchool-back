const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
        uri: process.env.NODE_ENV === "test"
            ? process.env.MONGO_URI_TESTS
            : process.env.MONGO_URI
    },
};
