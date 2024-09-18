# Development

### Deployment Process

#### Branches:
- **main**: Production URL uses the Admin-fts environment.
  - **Prod URL**: [https://logitech.3kit.com/](https://logitech.3kit.com/)
- **pre-main**: Intermediate branch for data to be deployed to production (switching environment to Threekit). 
- **staging**: Development environment connected to `preview.threekit`.
  - **Staging URLs**:
    - [https://logitech-staging.3kit.com/](https://logitech-staging.3kit.com/)

#### Deployment Steps:
1. **Pull Request to `staging`**:
   - Performed when a task is completed and sent for testing.
   - Update the task status in Asana to indicate it is in testing on `staging`.

2. **Pull Request from `staging` to `pre-main`**:
   - Performed when the task has passed testing and is ready for deployment to production.
   - During this step, perform a migration of Threekit changes from the `preview` environment to the `admin-fts` environment.

3. **Pull Request from `pre-main` to `main`**:
   - Performed when the task has passed testing, and the necessary Threekit migration is completed.
   - Changes are now available on the production version.

#### Threekit Migration:
- Migration is required when `Item`, `Asset`, or `DataTable` is updated.
---------------------



### Steps for start Frontend part 
```
npm install
npm run dev
```

### Steps for start Backend part 
```
cd server
npm install
npm start:dev
```

### Steps for starting a project
- start backend
- start frontend

### Branches
- main (for production)
- staging (for development)

### Architecture
 - UML diagrams, located in the docs folder (use StarUML)
 - Data modification process diagrams, located in the docs folder (use excalidraw to change the view)

# Production

### Steps
```
docker-compose up --build -d
```
