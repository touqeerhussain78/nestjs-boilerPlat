# Nest User Authentication module Backend Application
Built on NestJS framework


## Installation (Quick Start)
- Install NodeJS (16 LTS) if not installed by following [this guide](https://github.com/nvm-sh/nvm#install--update-script).
```bash
$ npm i -g pnpm
$ pnpm install
```

- create a new .env file and copy content from the .env.example
```bash
$ cp .env.example .env
```

- The default database is SQLite (Optional otherwise default set SQLite) create as database.sql in the main directory Two of DB we use one is SQLite as default(used for test cases) and the other is MySQL (used for production / local environment ) for Mac user change localhost to 127.0.0.1
```bash
DB_TYPE='mysql'
DB_HOST=localhost
DB_NAME=databasename
DB_USER=root
DB_PASS=password
DB_PORT=3306
```
- jwt secret is used for bearer authentication
```bash
JWT_SECRET=asdfjklqqwoieuoiuwejfsdlk123121l
```

- Setup the SMTP configuration (Optional)
```bash
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=<YOUR_SENDGRID_API_KEY>
MAIL_FROM=<YOUR_FROM_EMAIL>
```

- Migrations
```bash
# table migrate to database
$ pnpm run migration:run
```

- Default Seeders
```bash
# default seeder data fill in the database
$ pnpm run seed:run
```
- For Admin 
> email: admin@mailinator.com
> password: admin@123
- For User
> email: user@mailinator.com
> password: admin@123

- For Swagger documentations http://localhost:3000/api-documentation#/

# Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```


# Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Migrations
Migrations using flowing command defineDirectory like /src/api/moduleName and tableName like create_users_table
```bash
#create migration
$ npm run migration:create --path=defineDirectory --name=tableName

# revert migration
$ pnpm run migration:revert --path=defineDirectory --name=tableName

# generate/migrate specific migration
$ pnpm run migration:generate --path=defineDirectory --name=tableName

# table migrate to database
$ pnpm run migration:run
```

# Role and Permissions

We have two guards that we used one is RoleGuard and the other one is PremissionGuard. You can bind the method of call with permission and role. Default Permissions are in the utility file where the file name is ```permission.json```. In this file, you can write all the default permissions used in the ```project/products```. How to define in ```permission.json```.
.

```bash
{
     "name":"can edit profile",
     "slug":"user.profile.edit",
     "description":"user profile updation",
     "model":"User",
     "role":[
        "admin",
        "user"
     ]
  }
```

And in the class method, we can identify permission checking through the slug. So we can assign slug to particular methods to check the permission before executing.

```bash
 @Get()
  @UseGuards(PermissionGuard('view.users'))
  findAll() {
    return this.rolesService.findAll();
  }
```


# Response
Just return data and it will set default message and code. For example, you return:

```bash
{"name": "projectname"}
```
it will map to 
```bash
{"data": {"name": "projectname"}, "message": "OK", "statusCode": 200}
```
You can override message and code if you want to. Just return in following format.
```bash
{"data": {"name": "projectname"}, "msg": "Bad Request", "code": 400}
```
It will map to
```bash
{"data": {"name": "projectname"}, "message": "Bad Request", "statusCode": 400}

```