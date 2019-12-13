## Kennel App

#### Auth Resources

| Route                   | Desc               |
| :---------------------- | :----------------- |
| `POST /api/auth/login`  | User login         |
| `POST /api/auth/signup` | User signup        |
| `POST /api/auth/recall` | Login from cookies |

#### Appointments

| Route                               | Desc                             |
| :---------------------------------- | :------------------------------- |
| `POST /api/appts { loc_id: '123' }` | Create appointment               |
| `GET /api/appts/:id`                | Get appointment by id            |
| `GET /api/appts?loc_id='123'`       | Get appointments by location     |
| `GET /api/appts?org_id='123'`       | Get appointments by organization |
| `GET /api/appts?user_id='123'`      | Get appointments by user         |
| `PUT /api/appts/:id`                | Update appointment               |

#### Locations

| Route                             | Desc                                    |
| :-------------------------------- | :-------------------------------------- |
| `POST /api/loc { org_id: '123' }` | Create location (owned by organization) |
| `GET /api/loc`                    | Get locations                           |
| `GET /api/loc/:id`                | Get location by id                      |
| `GET /api/loc?org_id='123'`       | Get locations by organization           |
| `PUT /api/loc/:id`                | Update location                         |

#### Organizations

| Route               | Desc                   |
| :------------------ | :--------------------- |
| `POST /api/orgs`    | Create organization    |
| `GET /api/orgs`     | Get organizations      |
| `GET /api/orgs/:id` | Get organization by id |
| `PUT /api/orgs/:id` | Update organization    |

#### Users (created with POST /api/auth/signup)

| Route                         | Desc                      |
| :---------------------------- | :------------------------ |
| `GET /api/users`              | Get users                 |
| `GET /api/users/:id`          | Get user by id            |
| `GET /api/users?org_id='123'` | Get users by organization |
| `PUT /api/users/:id`          | Update user               |

#### Pets

| Route                         | Desc             |
| :---------------------------- | :--------------- |
| `POST /api/pets`              | Create pet       |
| `GET /api/pets`               | Get pets         |
| `GET /api/pets?user_id='123'` | Get pets by user |
| `PUT /api/pets/:id`           | Update pet       |
| `DELETE /api/pets/:id`        | Delete pet       |
