import { withSessionRoute } from '../../lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/prisma'

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // get user from database then:
  res.setHeader('cache-control', 'no-store, max-age=0')
  req.session.destroy()
  res.send({ ok: true })
}
