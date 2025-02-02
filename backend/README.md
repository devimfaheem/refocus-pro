# Refocus Backend

# Required items

- Nodejs v18.20.3
- `npm i -g @nestjs/cli@11.0.2`
- `.env` file for environment variables

# Command

- Local setup
`create .env copy from sample.env`
`npm install`
`npm run migration`
`npm run start`

- Access url on local `http://localhost:3000`

# API List
- `/admin/login` POST ({username, password})
- `/users` GET
- `/users` POST
- `/users/:id` GET
- `/users/:id` Delete
- `/users/:id` PUT


# API Doc

- `http://localhost:3000/api-docs`
