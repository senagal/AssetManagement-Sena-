# AssetManagement-Sena-

A simple asset management system that allows a company to manage its assets and handle requests for it.

Tech stack used

- ASP.NET for backend
- React for frontend
- Postgresql for database

---

## Features

- Role-based access (Admin & Employee)
- Asset creation, editing, deletion
- Image upload and preview
- Request asset with approval/rejection
- Search and filter assets or requests
- Responsive UI with Bootstrap

---

## Setup Instructions

##Backend
Install dotnet and postgres, create .env with variables listed below
The run following in backend directory
-dotnet ef migrations add InitialCreate
-dotnet build

- after this always do 'dotnet run' to run backend
  ##Frontend
  Install react, create .env with variables listed below
  -npm install
  -npm start

#### Environment Configuration

Create a `.env` file in the backend root:

```env
JWT_SECRET=generated string of key to use for jwt
DB_HOST=your host
DB_PORT=your postgres port
DB_NAME=
DB_USER=your postgres username
DB_PASSWORD=your postgres password
```

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=the base url the backend is being served from
REACT_APP_API_BASE_URL=the backend url without the api part for serving the images from wwwroot
```

##Demo seeded data
-for Admin email -'admin@company.com' and password - 'Admin@123'
-for employee email -'employee@company.com' and password - 'Employee@123'
