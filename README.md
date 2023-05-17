# Project

Wetube Reloaded

## Diagram

[![](https://mermaid.ink/img/pako:eNqVk0tvwjAMgP9KlF2YBNJgL6mTdihF4rBqqDwOoztkxJSIkmRJKkCI_z73EY1xWm91_H2149YnulIcaEAzw_SGzMJUEjJfpnRuwaT0k_R6JKXj2WxCEvguwLqU4tkrSZBJVOHAkM7ooA1Ye4t8qSe1VGXJmEmeC5k12hC1oZLOqDyvCpTCsBYi5hiJmRS6yJkTSjZOjE6MXeakEyuZKWXBl4p_zS9mgbxrMJVqGzcKlxfp2o9Cr0dh0ypYjQ74glev9r1f9JqA5Hj1hYB9k11goTIknUmR-QILP7_4jVwVmZd5nMx26o45kDticShbCG4GsOLP_W4d9vaCu00w0IeXv3y_JT9oyd-35B9a8o8t-aeW_PM_eNqlOzA7JjguwKn0U-o2sMNPFOAjhzUrcvzhU3lGlBVOTY9yRQNnCujSQnPmIBIMV2fnDzWTH0phuGa5xRi4cMrE9Y5Vq-bFUZVpwPMPwk0lmA?type=png)](https://mermaid.live/edit#pako:eNqVk0tvwjAMgP9KlF2YBNJgL6mTdihF4rBqqDwOoztkxJSIkmRJKkCI_z73EY1xWm91_H2149YnulIcaEAzw_SGzMJUEjJfpnRuwaT0k_R6JKXj2WxCEvguwLqU4tkrSZBJVOHAkM7ooA1Ye4t8qSe1VGXJmEmeC5k12hC1oZLOqDyvCpTCsBYi5hiJmRS6yJkTSjZOjE6MXeakEyuZKWXBl4p_zS9mgbxrMJVqGzcKlxfp2o9Cr0dh0ypYjQ74glev9r1f9JqA5Hj1hYB9k11goTIknUmR-QILP7_4jVwVmZd5nMx26o45kDticShbCG4GsOLP_W4d9vaCu00w0IeXv3y_JT9oyd-35B9a8o8t-aeW_PM_eNqlOzA7JjguwKn0U-o2sMNPFOAjhzUrcvzhU3lGlBVOTY9yRQNnCujSQnPmIBIMV2fnDzWTH0phuGa5xRi4cMrE9Y5Vq-bFUZVpwPMPwk0lmA)
graph TB
  U["User"] -- "HTTP Request" --> R["Router (Express)"]
  R -- "Route Handling" --> C["Controller"]
  C -- "Data Manipulation" --> M["Model (Mongoose)"]
  M -- "Database Operations" --> DB["Database (MongoDB)"]
  DB -- "Response" --> M
  M -- "Data" --> C
  C -- "Render View" --> V["View (Pug)"]
  V -- "HTML Response" --> U


## Domain

- Global
- User
- Video

## Routers

_global_
/
/join
/login
/search

_user_
/users/:id
/users/logout
/users/edit
/users/delete

_video_
/videos/:id
/videos/:id/edit
/videos/:id/delete
/videos/upload
