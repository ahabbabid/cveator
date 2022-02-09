import prisma from '../../prisma/prisma'
import fs from 'fs'
import { renderToStaticMarkup } from 'react-dom/server'
import getHTMlFromResumeData from '../../components/ResumeTemplate'
import puppeteer from 'puppeteer'
import { NextApiRequest, NextApiResponse } from 'next'

const savePDFs = async (req: NextApiRequest, res: NextApiResponse) => {
  const studentsB28 = await prisma.students.findMany({
    where: {
      batch: 28,
    },
  })
  for (const student of studentsB28) {
    const user = await prisma.users.findUnique({
      where: {
        id: student.user_id,
      },
    })
    if (
      !fs.existsSync(`./storage/resumes/${student?.batch}/${student?.faculty}`)
    ) {
      console.log('true')
      fs.mkdirSync(`./storage/resumes/${student?.batch}/${student?.faculty}`, {
        recursive: true,
      })
    }
    if (student.resume_data) {
      const resumeData: FormValues = JSON.parse(student.resume_data.toString())

      const html = renderToStaticMarkup(getHTMlFromResumeData(resumeData))
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '—disable-setuid-sandbox',
          '--font-render-hinting=none',
        ],
      })
      const page = await browser.newPage()
      await page.setContent(html)
      await page.addStyleTag({ path: 'tailwind.css' })

      const pdf = await page.pdf({
        path: `./storage/resumes/${student?.batch}/${student?.faculty}/${user?.username}.pdf`,
        format: 'a4',
        scale: 0.75,
        printBackground: true,
      })

      await browser.close()
    }
  }
  res.status(200).send({ ok: true })
}
export default savePDFs
