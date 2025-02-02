# Refocus Backend

# Required items

- Nodejs v18.20.3
- `npm i -g @nestjs/cli@11.0.2`
- `npm install -g serverless`
- `.env` file for environment variables

# Command

- Local setup
- `create .env copy from sample.env`
- `npm install`
- `npm run migration`
- `npm run offline` Serverless offline
- `npm run start:dev` Watch mode

- Access url on local `http://localhost:3000/dev`

# API List
- `/admin/login` POST ({username, password})
- `/users` GET
- `/users` POST
- `/users/:id` GET
- `/users/:id` Delete
- `/users/:id` PUT

# Refocus Frontend

# Required items

- Nodejs v18.20.3
- Backend must be running
- Change NEXT_PUBLIC_API_URL path in file `.env.local`

# Command

- Local setup
- `cd frontend`
- `npm install && npm run dev`

- Access url on local `http://localhost:4000`

# Site Flow

- Click on Login Page
- Enter username `admin` and password `admin`
- Will take you to dashboard
- Add new user
- Edit user
- Delete user
