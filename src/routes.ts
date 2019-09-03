/* eslint-disable @typescript-eslint/no-explicit-any */
import Database from '@withkoji/database'
import uuid from 'uuid'
import express from 'express'

/* eslint-disable prettier/prettier */
interface Idata {
  name: string;
  score: number;
  dateCreated: number;
  privateAttributes?: object;
}
/* eslint-enable prettier/prettier */

export default (app: express.Application, tableName = 'leaderboard'): void => {
  // To get the Leaderboard Scores
  app.get(
    `/${tableName}`,
    async (req: express.Request, res: express.Response) => {
      const database = new Database()
      const rawScores = await database.get(tableName)

      /**
       * @description We don't want to return private attributes to consumers of this
       *              endpoint, so strip them out, sort the records so the top scores
       *              appear first, and then only return the top 100 scores
       */
      const scores = rawScores
        .map(
          (data: Idata): Idata => ({
            name: data.name,
            score: data.score,
            dateCreated: data.dateCreated,
          })
        )
        .sort((a: Idata, b: Idata) => b.score - a.score)
        .slice(0, 100)

      res.status(200).json({
        success: true,
        scores,
      })
    }
  )

  // To save the Leaderboard Scores
  app.post(
    `/${tableName}`,
    async (req: express.Request, res: express.Response) => {
      const recordId = uuid.v4()

      const recordBody: Idata = {
        name: req.body.name,
        score: req.body.score,
        privateAttributes: req.body.privateAttributes,
        dateCreated: Math.round(Date.now() / 1000),
      }

      if (
        typeof recordBody.name === 'string' &&
        recordBody.name.length > 3 &&
        typeof recordBody.score === 'number' &&
        recordBody.score > 1 &&
        (typeof recordBody.privateAttributes === 'object' ||
          recordBody.privateAttributes === null)
      ) {
        const database = new Database()
        await database.set(tableName, recordId, recordBody)

        res.status(200).json({
          success: true,
          data: {
            ...recordBody,
          },
        })
      } else {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid, Incomplete or Inaccurate data provided',
            developerNotice:
              'Please read the documentation carefully and provide the correct parameters.',
            documentationURL:
              'https://github.com/KumarAbhirup/koji-leaderboard-api',
          },
        })
      }
    }
  )
}
