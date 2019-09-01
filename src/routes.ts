/* eslint-disable @typescript-eslint/no-explicit-any */
import Database from '@withkoji/database'
import uuid from 'uuid'

/* eslint-disable prettier/prettier */
interface Idata {
  name: string;
  score: number;
  dateCreated: number;
  privateAttributes?: object;
}
/* eslint-enable prettier/prettier */

export default (app: any): void => {
  // To get the Leaderboard Scores
  app.get('/leaderboard', async (req: any, res: any) => {
    const database = new Database()
    const rawScores = await database.get('leaderboard')

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
  })

  // To save the Leaderboard Scores
  app.post('/leaderboard', async (req: any, res: any) => {
    const recordId = uuid.v4()
    const recordBody: Idata = {
      name: req.body.name,
      score: req.body.score,
      privateAttributes: req.body.privateAttributes,
      dateCreated: Math.round(Date.now() / 1000),
    }

    const database = new Database()
    await database.set('leaderboard', recordId, recordBody)

    res.status(200).json({
      success: true,
      data: {
        ...recordBody,
      },
    })
  })
}
