export default {
    port: Number(process.env.PORT || '8000'),
    psqlHost: process.env.POSTGRES_HOST || 'localhost',
    psqlPort: Number(process.env.POSTGRES_PORT || '5432'),
    env: process.env.ENVIRONMENT || 'prod',
    jwtkey: '$2b$10$Prwf2psH3jesT358crKP9uzLDjZf7paumDtQpAIE8HYqf/kwczoZC',
    demo: true,
    emailRegex: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
};
