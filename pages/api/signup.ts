import { withSessionRoute } from '../../lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import { initialResumeData } from '../../lib/constants/resume'
import prisma from '../../prisma/prisma'

export default withSessionRoute(signupRoute)

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
  const reqBody = JSON.parse(req.body)
  let user = await prisma.users.findFirst({
    where: { username: reqBody.regNo.toString() },
  })
  if (user) {
    res.status(401).send({
      error: 'registration number already exists',
    })
  }
  user = await prisma.users.create({
    data: {
      username: reqBody.regNo.toString(),
      password: reqBody.password,
      role: 'student',
    },
  })
  console.log(user)
  await prisma.students.create({
    data: {
      user_id: user.id,
      resume_data: JSON.stringify(
        initialResumeData()
      ),
    },
  })
 
  req.session.user = user

  await req.session.save()
  res.send({ user: req.session.user })
}
