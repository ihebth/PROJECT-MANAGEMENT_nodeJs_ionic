module.exports = {
    db: process.env.MONGODB_URI || 'mongodb://localhost/startup',
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || '20192020!',

    mailgun: {
        apiKey: process.env.MAILGUN_API_KEY || '20ec8102dc1159eda530cc308800e468-f7d0b107-a9b0d43a',
        domain: process.env.MAILGUN_DOMAIN || 'sandboxed4767ca87c04679bf5a1334f768f503.mailgun.org',
    },
};