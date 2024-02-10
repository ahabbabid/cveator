import { withSessionRoute } from '../../lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/prisma'

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // get user from database then:
  const reqBody = JSON.parse(req.body)
 console.log(process.env.TURSO_DATABASE_URL) 
  const user = await prisma.users.findFirst({
    where: {
      username: reqBody.regNo,
      password: reqBody.password,
    },
  })
  if (!user)
    res.status(400).send({
      error: 'Regstration or Password Incorrect',
    })
  else {
    req.session.user = user

    await req.session.save()
    // res.status(200).send({
    //   ok: true,
    // })

    res.setHeader('cache-control', 'no-store, max-age=0')
    res.redirect('/resume')
  }
}
