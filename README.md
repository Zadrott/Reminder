# Reminder
## Introduction
Generic reminder app

This project is mainly intended for practicing some stuff I encountered during my technology watch and may also serve as a basis /  MVP for future projects.

## Examples of tech I want to try or practice within this project 
- Angular
- Angular Material
- Typescript
- CSS
- Express.js
- MongoDB
- Vite
- PWA
- IndexedDB
- Mobile apps

## Next steps
- Being able to create and modify tasks within the front end
- Computing remaining time for tasks
- Sending notifications when the due time is exceeded
- Being able to reuse repeating tasks like weekly or monthly tasks
- Rework desktop layout
- Overall improvements and clean up

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