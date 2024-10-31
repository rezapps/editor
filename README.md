# Collaborative text editor



## Features

Real time collaborative text editor built with:  
server side:
- express
- graphql
- mongodb
- mongoose
- socket.io
- jwt
- bcrypt

client side:
- nextjs
- quill
- socket.io-client
- react-toastify
- tailwindcss


Testing is done using vitest and jest-dom for frontend and jest and supertest for api.  



## Setup and Installation

*Use your favoeite package manager npm, pnpm or yarn to install dependencies.*

Frontend is built with nextjs 14 with app router, wrapped inside `src` directory. Nextjs 15 have the option to use `turbopack` or `webpack`. If you need to use webpack then simply remove **--turbo** from **dev script** in *package.json*

```
"scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest --coverage"
  },

```

### Environment variables in frontend

If you running the client (nextjs app) locally change the `.example.env` to `.env` and put your credential in there. When running in developement mode, Nextjs has access to .env varibles that are prefixed with "NEXT_PUBLIC". example:

```
// .env file
NEXT_PUBLIC_API_URL = "ur api address"

// you can access the variables
const api_url = process.env.NEXT_PUBLIC_API_URL
```

But in production set the environment variables in your projects settings, without prefixing variables with "NEXT_PUBLIC". example:

```
// .env file
API_URL = "ur api address"


// You can access the variables
const api_url = process.env.API_URL
```

#### api url in production server

When backend is deployed to production server, you do not need to add port number to api url.

### Environment variables in backend

Backend environment variables:

```
PORT = 5051
MONGODB_URI = ""
JWT_SECRET = ""
```


### Clone this repository:



```
git clone https://github.com/rezapps/editor.git

# from the root of repo:
cd server
pnpm i
pnpm dev

# from the root of repo:
cd client
pnpm i
pnpm dev

```
