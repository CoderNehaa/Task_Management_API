TASK_MANAGEMENT_API

This is a RESTful API for a task management system and it has following functionalities - 

1. User Registration and authentication
   * User can sign in with username, password.
   * User can sign up username, password, account_type and adminId(null for account_type='admin'). Admin ID is necessary for role-based access.
   * User gets JWT token on signin.
   * Password is hashed before storing in database.

2. Task Mangement
   * If user is logged in, user can create, read, update and delete its tasks.
   * Tasks can be assigned to users by admin(only admin can assign tasks and users can see "tasks assigned to me" by calling API)
   * Users and admin both has access to tasks CRUD operations. Admin has special access to see tasks of any user(getTeamTasks API).
   * One task can be assigned to one user only
   * User can get filtered tasks based on status, priority and date
   * User can search tasks by title or description
     
**SCHEMA**
* userSchema = id(number), username(VARCHAR(255), unique), password(VARCHAR(255)), accountType(enum- admin, user), adminId(0 for account_type='admin')
* taskSchema = id(number), title(VARCHAR(255)), description(TEXT), status (enum- Todo, In Progress, Done), priority(enum- High, Medium, Low), due date(Date), created at(Date), updated at(Date), creatorId(id of user who created task), userId (to indicate the user the task is assigned to).

Technologies/Packages/Languages/frameworks used in this project-
- node
- express
- mysql workbench
- docker
- TypeORM
- Swagger
- dotenv
- bcrypt
- jsonwebtoken
- typescript
- express-validator(for username and password validation),


