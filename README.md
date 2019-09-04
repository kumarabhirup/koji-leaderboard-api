<div align="center">

<br />

<h1>koji-leaderboard-api</h1>

[![Type](https://img.shields.io/badge/type-API-yellow.svg?style=flat-square)](https://www.npmjs.com/package/koji-leaderboard-api)
[![stage](https://img.shields.io/badge/stage-BetaTesting%20%F0%9F%94%A5-000000.svg?style=flat-square)](https://github.com/KumarAbhirup/koji-leaderboard-api)
[![npm](https://img.shields.io/badge/npm-koji--leaderboard--api-CB3837.svg?style=flat-square)](https://www.npmjs.com/package/koji-leaderboard-api)
[![Version](https://img.shields.io/badge/version-v1.0.0-green.svg?style=flat-square)](https://www.npmjs.com/package/koji-leaderboard-api)
[![Prefers](https://img.shields.io/badge/prefers-NPM%20Installation-blue.svg?style=flat-square)](https://www.npmjs.com/package/koji-leaderboard-api)
[![Twitter](https://img.shields.io/twitter/follow/kumar_abhirup.svg?style=social&label=@kumar_abhirup)](https://twitter.com/kumar_abhirup)
<!-- [![GitHub stars](https://img.shields.io/github/stars/KumarAbhirup/koji-leaderboard-api.svg?style=social&label=Stars)](https://github.com/KumarAbhirup/koji-leaderboard-api) -->

</div>

<br /><br />

# 📦 `koji-leaderboard-api`
### **Koji Database based Leaderboard API setup, at your doorsteps.**

When you create games or any competitive webapp on Koji, you need to have Leaderboards. Setting them up in the backend could sometimes be a horrific task. So, you have this simple **plugNplay Express API** that runs smoothly with the most minimal setup!

<br /><br />

# 💃 Documentation

## Install `koji-leaderboard-api`

To install the API on your Node.js backend, run the following.

```bash
$ npm i -S koji-leaderboard-api
```

## Summary

```js
kojiLeaderboardApi(app, 'leaderboard')
```

- 1st parameter: `app` 👉 (type: `Express App Instance`, Required)
- 2nd parameter: `tableName` 👉 (type: `String`, Optional, Default: `leaderboard`) - The table name you want your data to be stored under. For eg. if your `tableName` is `leaderboard`, then your API endpoints will be `GET /leaderboard` and `POST /leaderboard`.

<br />

## Usage

See the following example 👇

```javascript
import express from 'express'
import bodyParser from 'body-parser'

import kojiLeaderboardApi from 'koji-leaderboard-api' // The library you are using

const app = express() // This is the Express App Instance

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}))

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // use '*' as second param to allow any client to hack in
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Jiro-Request-Tag')
  next()
})

/**
 * @name kojiLeaderboardApi
 * @description Doing `kojiLeaderboardApi(app)` activates the `/leaderboard` GET and POST API endpoints
 *              that your frontend can use to Display and Update Leaderboard
 * 
 * @param {Express App Instance} app - (required)
 * @param {String} tableName - (optional) Default: `leaderboard`
 */
kojiLeaderboardApi(app)

// Listen on Port 8080. Visit http://localhost:8080 to see the backend.
app.listen(8080, null, async err => {
    if (err) console.log(err.message)
    console.log('[koji] Backend Started 👏')
})
```

In the above example, we make use of an express server. What you need to do, is to just pass the `Express App Instance` as the only parameter to the `kojiLeaderboardApi()` function. That activates your Leaderboard API.

## API Endpoints

|   | **Method** | **Endpoint**   | **Parameters (JSON Body)**                                                                             |
|---|------------|----------------|--------------------------------------------------------------------------------------------------------|
| 1 | GET        | `/leaderboard` |                                                    -                                                   |
| 2 | POST       | `/leaderboard` | name: String 👈 _required_ <br /> score: Number 👈 _required_ <br /> privateAttributes: Object 👈 _optional_ |

<br />

> **Important note:** The above mentioned API endpoints only work if you haven't filled in the second parameter. If you have, the second parameter will be your GET and POST endpoint.

<br />

### GET `/leaderboard`

#### JavaScript fetch example

```javascript
import Koji from 'koji-tools'

async function fetchData() {
  const response = await fetch(`${Koji.config.serviceMap.backend}/leaderboard`)
                          .then(response => response.json())
                          .catch(err => throw new Error('Fetch Error: ', err))

  return response
}
```

#### Successful Example Response 👇

```json
{
   "success": true,
   "scores": [
      {
         "name": "Rafa",
         "score": 4766,
         "dateCreated": 1567290764
      },
      {
         "name": "Sean",
         "score": 833,
         "dateCreated": 1567178966
      }
   ]
}
```

<br />

### POST `/leaderboard`

#### Parameters

The parameters have to be a Body in a JSON format, to be processed correctly.

- `name` 👉 **String: { strLength should be more than 3 } (required)**
- `score` 👉 **Number: { Score should be more than 1 } (required)**
- `privateAttributes` 👉 **Object or null (optional)** The Object can contain email, or any private information that shouldn't be accessed from the `GET /leaderboard` endpoint.

#### JavaScript fetch example

```javascript
import Koji from 'koji-tools'

async function saveData() {
  const body = {
    name: "Kumar Abhirup",
    score: 5280,
    privateAttributes: {
      email: "kumarsExampleMail@gmail.com"
    },
  }

  await fetch(`${Koji.config.serviceMap.backend}/leaderboard`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(response => response.json())
  .then(jsonResponse => {
    console.log(jsonResponse) // see example response
  })
  .catch(err => {
    console.log(err)
  })
}
```

#### Successful Example Response 👇

```json
{
  "success": true,
  "data": {
    "name": "Kumar Abhirup",
    "score": 5280,
    "privateAttributes": {
      "email": "kumarsExampleMail@gmail.com"
    },
    "dateCreated": 1567186095
  }
}
```

<br /><br />

# 📝 License

**MIT © [Kumar Abhirup](https://www.twitter.com/kumar_abhirup)**
<br />
_Follow me 👋 **on Twitter**_ →   [![Twitter](https://img.shields.io/twitter/follow/kumar_abhirup.svg?style=social&label=@kumar_abhirup)](https://twitter.com/kumar_abhirup/)
