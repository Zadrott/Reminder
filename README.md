# Reminder
Generic reminder app

## Example env files
### App/environement.ts
```
export const environment = {
    API_URL: 'http://10.0.0.12:8090',
    USER_TOKEN_KEY: 'USER_TOKEN',
    USER_EXPIRE_KEY: 'USER_EXPIRE',
    USER_ID_KEY: 'USER_ID',
};
```
### Server/.env
```
DB_HOST=test.mongodb.net
DB_NAME=reminder
DB_USER=user
DB_PASS=password
PORT = 80
USERS_SECRET=ABC1234
```