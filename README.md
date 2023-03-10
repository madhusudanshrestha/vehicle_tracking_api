# VEHICLE TRACKING
## Overview
This software is designed to track vehicles and the location they visited.


## Installation Guide

### Requirements
1. [NodeJS](https://nodejs.org/) >=19.2.0
2. [yarn](https://classic.yarnpkg.com)
3. [MySQL](https://www.mysql.com)

### How to run 

```
git clone https://github.com/madhusudanshrestha/vehicle_tracking_api.git
cd vehicle_tracking_api
cp .env.example .env
cp .env.test.example .env.test
yarn

```
Change the DATABASE_URL in the .env file as mentioned in https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

Migrate and seed the database with Admin user
```
npx prisma migrate dev --name init
npx prisma db seed
```
Your admin email and password will be displayed in the console. ADMIN_EMAIL email and ADMIN_PASSWORD can also be changed in the .env file. If ADMIN_PASSWORD is empty. It'll generate a random password.
```
_______________________________________
Your email:  admin@example.com
Your password:  p@ssw0rd123
_______________________________________
```

Run the application

```
yarn start
```

## Testing
### Unit testing
```
yarn unit-test
```
### Integration testing
```
yarn integration-test
```

## DOC
#### API doc route. https://localhost:3001/api-docs
#### Also included is a postman collection called [Vehicle Tracker](Vehicle_Tracker.postman_collection.json)