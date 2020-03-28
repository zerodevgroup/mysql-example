# mysql-example

## Config
Change `app/config/db.config.js` replacing the following:
  - USER
  - PASSWORD
  - DB

## Start Application using pm2 (based on ecosystem.config.js)
```
pm2 start
```

## Create a User
```
curl -X POST \
-H 'accept:application/json' \
-H 'content-type:application/json' \
-d '{"firstName": "Sean", "lastName": "Wright", "email": "sean.wright@zerodevgroup.com"}' \
http://localhost:8080/api/users
```

## Create Users in Bulk
```
curl -X POST \
-H 'accept:application/json' \
-H 'content-type:application/json' \
-d '[
  {"firstName": "Sean", "lastName": "Wright", "email": "sean.wright@zerodevgroup.com"},
  {"firstName": "Noah", "lastName": "Wright", "email": "noah.wright@zerodevgroup.com"}
]' \
http://localhost:8080/api/users/bulk
```

## MySQL Commands (assumes a databased called mydb and a table called users)

### Select all databases
```
show databases;
```

### Connect and start using mydb database
```
use mydb;
```

### Show tables in the mydb database
```
show tables;
```

### Select all rows from the users table
```
SELECT * from users;
```

### Delete all rows from the users table
```
DELETE FROM users;
```
