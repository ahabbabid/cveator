import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/prisma'

async function create(req: NextApiRequest, res: NextApiResponse) {
  const reqBody = JSON.parse(req.body)
  const user = reqBody.user

  try {
    const student = await prisma.students.findFirst({
      where: { user_id: user?.id },
    })
    if (student !== null) {
      await prisma.students.update({
        where: {
          id: student.id,
        },
        data: {
          resume_data: JSON.stringify(reqBody.resumeData),
        },
      })
      res.send({ ok: true })
    }
  } catch (e) {
    res.status(500).send({
      error: 'internal server error',
    })
  }
}
export default create
