import { withSessionRoute } from '../../lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/prisma'

export default withSessionRoute(logoutRoute)

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  // get user from database then:

  req.session.destroy()
  res.setHeader('cache-control', 'no-store, max-age=0')
  res.send({ ok: true })
}
