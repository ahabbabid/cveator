// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '../../lib/withSession'
import getHTMlFromResumeData from '../../components/ResumeTemplate'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer from 'puppeteer'
import prisma from '../../prisma/prisma'
import chromium from "chrome-aws-lambda";

export default withSessionRoute(getPDF)

async function getPDF(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user
  if (user) {
    const student = await prisma.students.findFirst({
      where: {
        user_id: user.id,
      },
    })
    // if (!fs.existsSync(`./storage/${student?.batch}/${student?.faculty}`)) {
    //   console.log('true')
    //   fs.mkdirSync(`./storage/${student?.batch}/${student?.faculty}`, {
    //     recursive: true,
    //   })
    // }
    const { resumeData } = JSON.parse(req.body)

    const html = renderToStaticMarkup(
      getHTMlFromResumeData(JSON.parse(resumeData))
    )
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      headless: chromium.headless
    })

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: [
    //     '--no-sandbox',
    //     '—disable-setuid-sandbox',
    //     '--font-render-hinting=none',
    //   ],
    // })
    
    const page = await browser.newPage()
    await page.setContent(html)
    await page.addStyleTag({ path: 'tailwind.css' })

    const pdf = await page.pdf({
      printBackground: true,
      scale: 0.75,
      margin: {right: '0.5in', left: '0.5in', top: '0.5in', bottom: '0.5in'}
    })

    
    await browser.close()
    res.setHeader('Content-Type', 'application/pdf').send(pdf)
  }
}
