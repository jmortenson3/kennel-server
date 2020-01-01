## Kennel App 🐕‍🦺

#### Auth Resources

| Route                   | Desc               | Required fields                         |
| :---------------------- | :----------------- | :-------------------------------------- |
| `POST /api/auth/login`  | User login         | `email` and `password`                  |
| `POST /api/auth/signup` | User signup        | `email` and `password`                  |
| `POST /api/auth/recall` | Login from cookies | Requires a cookie with a `token` object |

#### Appointments

| Route                                                            | Desc                             | Required fields           |
| :--------------------------------------------------------------- | :------------------------------- | :------------------------ |
| `POST /api/appts { user_email: 'test@test.com', loc_id: '123' }` | Create appointment               | `user_email` and `loc_id` |
| `GET /api/appts/:id`                                             | Get appointment by id            |                           |
| `GET /api/appts?loc_id='123'`                                    | Get appointments by location     |                           |
| `GET /api/appts?org_id='123'`                                    | Get appointments by organization |                           |
| `GET /api/appts?user_id='123'`                                   | Get appointments by user         |                           |
| `PUT /api/appts/:id`                                             | Update appointment               | `id`                      |

#### Locations

| Route                                                                      | Desc                                    | Required fields         |
| :------------------------------------------------------------------------- | :-------------------------------------- | :---------------------- |
| `POST /api/loc { org_id: '123', loc_name: 'bridge street doggy daycare' }` | Create location (owned by organization) | `org_id` and `loc_name` |
| `GET /api/loc`                                                             | Get locations                           |                         |
| `GET /api/loc/:id`                                                         | Get location by id                      |                         |
| `GET /api/loc?org_id='123'`                                                | Get locations by organization           |                         |
| `PUT /api/loc/:id`                                                         | Update location                         | `id`                    |

#### Organizations

| Route               | Desc                   | Required fields |
| :------------------ | :--------------------- | :-------------- |
| `POST /api/orgs`    | Create organization    | `org_name`      |
| `GET /api/orgs`     | Get organizations      |                 |
| `GET /api/orgs/:id` | Get organization by id |                 |
| `PUT /api/orgs/:id` | Update organization    | `id`            |

#### Users (created with POST /api/auth/signup)

| Route                             | Desc                                         | Required fields   |
| :-------------------------------- | :------------------------------------------- | :---------------- |
| `GET /api/users`                  | Get users                                    |                   |
| `GET /api/users/:id`              | Get user by id                               |                   |
| `GET /api/users?org_id='123'`     | Get users by organization                    |                   |
| `PUT /api/users/:id`              | Update user                                  |                   |
| `POST /api/users/:id/memberships` | Grants the user a membership to an org       | `id` and `org_id` |
| `GET /api/users/:id/memberships`  | Gets membership details                      | `id`              |
| `PUT /api/users/:id/memberships`  | Update user membership details (permissions) | `id` and `org_id` |

#### Pets

| Route                         | Desc             | Required fields             |
| :---------------------------- | :--------------- | :-------------------------- |
| `POST /api/pets`              | Create pet       | `pet_name` and `user_email` |
| `GET /api/pets`               | Get pets         |                             |
| `GET /api/pets?user_id='123'` | Get pets by user |                             |
| `PUT /api/pets/:id`           | Update pet       | `id`                        |
| `DELETE /api/pets/:id`        | Delete pet       | `id`                        |
