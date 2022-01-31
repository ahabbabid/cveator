import { ReactElement } from 'react'
import { educationDefaultVals } from '../lib/constants/resume'
const getHTMlFromResumeData = (resumeData: FormValues): ReactElement => {
  return (
    <div className="p-5">
      <div className="flex  justify-between ">
        <div>
          <span className="text-2xl font-bold">
            {resumeData.personalInfo.name}
          </span>
          <br />

          <span className="text-sm">{resumeData.personalInfo.email}</span>
          <br />
          <span className="text-sm">{resumeData.personalInfo.phoneNumber}</span>

          <br />
        </div>
        <div className="text-right">
          <span className="text-base font-semibold">Address</span>
          <br />
          <span className="text-sm">{resumeData.address.houseAddress}</span>
          <br />
          <span className="text-sm">{resumeData.address.city}</span>,{' '}
          <span className="text-sm">{resumeData.address.province}</span>
          <br />
          <span className="text-sm">{resumeData.address.country}</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-2 gap-y-3 border-t-2 border-solid border-black">
        <div className="col-span-2 row-span-1 border-r-2 border-solid pr-2 text-right">
          <div className="font-semibold">Objective</div>
        </div>
        <div className="col-span-10  col-start-3 row-span-1 row-start-1">
          <p className="text-sm">{resumeData.objective}</p>
        </div>
        <div className="col-span-2 col-start-1 row-span-1 border-r-2 border-solid pr-2">
          <div className="flex justify-end">
            <div className="text-right font-semibold">Education</div>
          </div>
        </div>
        <div className="col-span-10  col-start-3 row-span-1 row-start-2">
          <div className="mb-5 flex justify-between last:mb-0">
            <div>
              <p className="text-base font-semibold">
                {resumeData.education.giki.institute}
              </p>

              <p className="text-sm">
                &emsp;Bachelors of Science in{' '}
                {resumeData.education.giki.discipline}
              </p>

              <p className="text-sm ">
                &emsp;CGPA: {resumeData.education.giki.cgpa}/4.00
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">{resumeData.education.giki.location}</p>
              <span className="text-sm">
                {resumeData.education.giki.startDate}
              </span>{' '}
              -{' '}
              <span className="text-sm">
                {resumeData.education.giki.endDate}
              </span>
            </div>
          </div>
          {resumeData.education.other.map((obj) => (
            <div className="mb-5 flex justify-between last:mb-0">
              <div>
                <p className="text-base font-semibold">{obj.institute}</p>

                <p className="text-sm">&emsp;{obj.degree}</p>

                <p className="text-sm ">
                  &emsp;{obj.metric}: {obj.metricValue}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{obj.location}</p>
                <span className="text-sm">{obj.startDate}</span> -{' '}
                <span className="text-sm">{obj.endDate}</span>
              </div>
            </div>
          ))}
        </div>
        <div className=" col-span-2 col-start-1 row-span-1 border-r-2 border-solid pr-2">
          <div className="flex justify-end">
            <div className="w-3/4 text-right font-semibold">
              {' '}
              Work Experience
            </div>
          </div>
        </div>
        <div className="col-span-10  col-start-3 row-span-1 row-start-3">
          {resumeData.work.map((obj) => (
            <div className="mb-5 flex justify-between ">
              <div>
                <p className="text-base font-semibold">{obj.company}</p>

                <p className=" text-sm">&emsp;{obj.desc}</p>
              </div>
              <div>
                <div className="text-right">
                  <span className="text-sm">{obj.location}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm">{obj.startDate}</span> -{' '}
                  <span className="text-sm">{obj.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-2 row-span-1 row-start-4 border-r-2 border-solid pr-2">
          <div className="flex justify-end">
            <div className="w-3/4 text-right font-semibold">
              {' '}
              Academic Projects
            </div>
          </div>
        </div>
        <div className="col-span-10  col-start-3 row-span-1 row-start-4">
          {resumeData.academicProjects.map((obj) => (
            <div>
              <p className="text-base font-semibold">{obj.name}</p>

              <p className=" text-sm">&emsp;{obj.desc}</p>
            </div>
          ))}
        </div>
        <div className=" col-span-2 row-span-1 row-start-5 border-r-2 border-solid pr-2">
          <div className="flex justify-end">
            <div className="w-3/4 text-right font-semibold">
              {' '}
              Awards & Acheivments
            </div>
          </div>
        </div>
        <div className="col-span-10  col-start-3 row-span-1 row-start-5">
          {resumeData.awardsAndAcheivments.map((award) => (
            <div>
              <p className="text-semibold text-base"> - {award}</p>
            </div>
          ))}
        </div>
        <div className="col-span-2 row-span-1 row-start-6 border-r-2 border-solid">
          <div className="flex justify-end">
            <div className="pr-2 text-right font-semibold">Skills</div>
          </div>
        </div>
        <div className="col-span-10  col-start-3 row-span-1 row-start-6">
          {resumeData.skills.map((skill) => (
            <div>
              <p className="text-semibold text-base"> - {skill}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default getHTMlFromResumeData
