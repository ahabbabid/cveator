import { withSessionRoute } from '../../lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import { initialResumeData } from '../../lib/constants/resume'
import { currentBatches } from '../../config.json'
import prisma from '../../prisma/prisma'

export default withSessionRoute(signupRoute)

async function signupRoute(req: NextApiRequest, res: NextApiResponse) {
  const reqBody = JSON.parse(req.body)
  const batches: {
    [batch: number]: string
  } = currentBatches
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
  await prisma.students.create({
    data: {
      user_id: user.id,
      faculty: reqBody.faculty,
      batch: parseInt(reqBody.batch),
      resume_data: JSON.stringify(
        initialResumeData(batches[reqBody.batch] === 'Final Year')
      ),
    },
  })
  req.session.user = user

  await req.session.save()
  res.send({ user: req.session.user })
}
