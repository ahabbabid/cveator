import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { saveAs } from 'file-saver'
import { Formik, FieldArray } from 'formik'
import { ToggleableInput } from '../../components/ToggleableInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusCircle,
  faTimesCircle,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons'
import { withSessionSsr } from '../../lib/withSession'
import {
  educationDefaultVals,
  workExperienceDefaultVals,
  academicProjectsDefaultVals,
  awardsAndAchievementsDefaultVal,
  skillDefaultVal,
  defaultVals,
} from '../../lib/constants/resume'
import prisma from '../../prisma/prisma'
import config from '../../config.json'
import { useState } from 'react'
import classNames from 'classnames'
import editIcon from '../../public/edit-solid.svg'

export const getServerSideProps = withSessionSsr(
  //@ts-ignore
  async function getServerSideProps({ req }) {
    const { disciplines, currentBatches } = config
    console.log(req.session.user)
    if (!req.session.user)
      return {
        redirect: {
          destination: '/',
        },
        props: {},
      }
    const user = req.session.user
    try {
      const resumeData = await prisma.students.findFirst({
        where: {
          user_id: user.id,
        },
      })

      return {
        props: {
          user: { ...req.session.user},
          resumeData: resumeData?.resume_data,
          disciplines,
          currentBatches,
        },
      }
    } catch (e) {
      return {
        props: {
          user: req.session.user,
          resumeData: null,
          disciplines,
          currentBatches,
        },
      }
    }
  }
)

const Home: NextPage<{
  user: { id: number; username: string; batch: number }
  resumeData: string
  disciplines: Array<string>
  currentBatches: { [batch: number]: string }
}> = ({ user, resumeData, disciplines, currentBatches }) => {
  const initialFormValues: FormValues = JSON.parse(resumeData)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const router = useRouter()

  return (
    <div>
      <div className="flex h-10 w-full items-center justify-end bg-sky-900 pr-5 pl-5">
        <a
          className="cursor-pointer text-sm text-sky-100 underline"
          onClick={async (e) => {
            e.preventDefault()
            await fetch('/api/logout', {
              method: 'POST',
              credentials: 'include',
            })

            router.replace('/')
          }}
        >
          logout
        </a>
      </div>
      <div className="flex flex-col justify-start p-10">
        <div className="text-2xl font-semibold">Instructions</div>
        <div className="text-sm">
          <ul className="list-disc">
            <li>
              Fields showing <Image alt='editIcon' src={editIcon}></Image> upon hovering can be
              edited by clicking on them and changing the values
            </li>
            <li>
              After changes have been made, click the 'Save' button to save them
            </li>
            <li>
              A PDF of your resume can be downloaded by clicking the 'Download
              PDF' button
            </li>
            <li>
              Sections showing the <FontAwesomeIcon icon={faPlusCircle} /> icon
              can have multiple values added to them. Clicking on the icon will
              add editable fields to that section.
            </li>
            <li>
              Clicking on the <FontAwesomeIcon icon={faTimesCircle} /> icon
              removes the field from the section
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-10 flex w-full flex-col items-center bg-gray-100">
        <div className=" mt-2 max-w-screen-lg border-2 border-dashed border-black  bg-white p-5">
          <Formik
            initialValues={initialFormValues}
            onSubmit={async (values) => {
              try {
                const res = await fetch('/api/resume', {
                  method: 'post',
                  body: JSON.stringify({
                    user: user,
                    resumeData: values,
                  }),
                })
              } catch (e) {
                console.log('an error occured')
              }
            }}
          >
            {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <button
                  className="mr-3 w-20 rounded-md  bg-sky-900 p-2 text-sky-100 "
                  type="submit"
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                  ) : (
                    'Save'
                  )}
                </button>

                <button
                  className="w-40 rounded-md bg-sky-900  p-2 text-sky-100"
                  disabled={downloadingPDF}
                  onClick={async (e) => {
                    try {
                      e.preventDefault()
                      setDownloadingPDF(true)
                      const res = await fetch('/api/getPDF', {
                        method: 'post',
                        body: JSON.stringify({
                          resumeData: JSON.stringify(values),
                        }),
                      })
                      const blob = await res.blob()

                      saveAs(blob, `${user.username}.pdf`)
                      setDownloadingPDF(false)
                    } catch (e) {
                      console.log(e)
                    }
                  }}
                >
                  {downloadingPDF ? (
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                  ) : (
                    'Download PDF'
                  )}
                </button>
                <div className="flex  justify-between ">
                  <div>
                    <ToggleableInput
                      classes={{
                        input: 'text-2xl font-bold',
                        span: 'text-2xl font-bold cursor-edit',
                      }}
                      name="personalInfo.name"
                      value={values.personalInfo.name}
                      emptyFieldDefaultVal={defaultVals.personalInfo.name}
                    />
                    <br />
                    <ToggleableInput
                      classes={{
                        input: 'text-sm',
                        span: 'text-sm cursor-edit',
                      }}
                      name="personalInfo.email"
                      value={values.personalInfo.email}
                      emptyFieldDefaultVal={defaultVals.personalInfo.email}
                    />
                    <br />
                    <ToggleableInput
                      classes={{
                        input: 'text-sm',
                        span: 'text-sm cursor-edit',
                      }}
                      name="personalInfo.phoneNumber"
                      value={values.personalInfo.phoneNumber}
                      emptyFieldDefaultVal={
                        defaultVals.personalInfo.phoneNumber
                      }
                    />
                    <br />
                  </div>
                  <div className="text-right">
                    <span className="text-base font-semibold">Address</span>
                    <br />
                    <ToggleableInput
                      classes={{
                        input: 'text-sm',
                        span: 'text-sm cursor-edit',
                      }}
                      name="address.houseAddress"
                      value={values.address.houseAddress}
                      emptyFieldDefaultVal={defaultVals.address.houseAddress}
                    />
                    <br />
                    <ToggleableInput
                      classes={{
                        input: 'text-sm',
                        span: 'text-sm cursor-edit',
                      }}
                      name="address.city"
                      value={values.address.city}
                      emptyFieldDefaultVal={defaultVals.address.city}
                    />
                    ,{' '}
                    <ToggleableInput
                      classes={{
                        input: 'text-sm',
                        span: 'text-sm cursor-edit',
                      }}
                      name="address.province"
                      value={values.address.province}
                      emptyFieldDefaultVal={defaultVals.address.province}
                    />
                    <br />
                    <ToggleableInput
                      classes={{
                        input: 'text-sm',
                        span: 'text-sm cursor-edit',
                      }}
                      name="address.country"
                      value={values.address.country}
                      emptyFieldDefaultVal={defaultVals.address.country}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-2 gap-y-3 border-t-2 border-solid border-black">
                  <div className="col-span-2 row-span-1 mt-2 border-r-2 border-solid pr-2 text-right">
                    <div className="font-semibold">Objective</div>
                  </div>
                  <div className="col-span-10  col-start-3 row-span-1 row-start-1  mt-2">
                    <ToggleableInput
                      classes={{
                        input: 'text-sm w-full',
                        span: 'text-sm cursor-edit',
                      }}
                      name="objective"
                      value={values.objective}
                      customField={(field, onBlur, ref) => (
                        <textarea
                          {...field}
                          onBlur={(e) => {
                            if (values.objective === '') {
                              setFieldValue('objective', defaultVals.objective)
                            }
                            onBlur()
                          }}
                          className="w-full border-2 border-dotted border-gray-700 text-base outline-none"
                          ref={ref}
                        >
                          {values.objective}
                        </textarea>
                      )}
                    />
                  </div>
                  <div className="col-span-2 col-start-1 row-span-1 border-r-2 border-solid pr-2">
                    <div className="flex justify-between">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="ml-2 mt-1 hover:cursor-pointer "
                        onClick={() =>
                          setFieldValue('education.other', [
                            ...values.education.other,
                            educationDefaultVals,
                          ])
                        }
                      />
                      <div className="text-right font-semibold">Education</div>
                    </div>
                  </div>
                  <div className="col-span-10  col-start-3 row-span-1 row-start-2">
                    <FieldArray name="education.other">
                      {(arrayHelpers) => (
                        <div>
                          {values.education.other &&
                          values.education.other.length > 0 ? (
                            values.education.other.map((obj, index) => (
                              <div className="flex justify-between">
                                <div className="w-3/4">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input:
                                          'mr-2 text-base font-semibold w-full',
                                        span: 'mr-2 text-base font-semibold cursor-edit',
                                      }}
                                      name={`education.other[${index}].institute`}
                                      value={
                                        values.education.other[index].institute
                                      }
                                      emptyFieldDefaultVal={
                                        defaultVals.education.institute
                                      }
                                    />

                                    <FontAwesomeIcon
                                      className="hover:cursor-pointer"
                                      icon={faTimesCircle}
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  </div>
                                  <div className="pl-5">
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm  w-full',
                                        span: 'text-sm  cursor-edit',
                                      }}
                                      name={`education.other.${index}.degree`}
                                      value={
                                        values.education.other[index].degree
                                      }
                                      emptyFieldDefaultVal={
                                        defaultVals.education.degree
                                      }
                                    />
                                  </div>
                                  <div className="pl-5">
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm',
                                        span: 'text-sm  cursor-edit',
                                      }}
                                      name={`education.other.${index}.metric`}
                                      value={
                                        values.education.other[index].metric
                                      }
                                      customField={(field, onBlur) => (
                                        <select
                                          {...field}
                                          onBlur={onBlur}
                                          defaultValue={
                                            defaultVals.education.metric
                                          }
                                          autoFocus
                                          className="border-2 border-dotted border-gray-700 text-sm outline-none"
                                        >
                                          <option value="CGPA">CGPA</option>
                                          <option value="Grades">Grades</option>
                                          <option value="Result">Result</option>
                                        </select>
                                      )}
                                    />
                                    :{' '}
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm ',
                                        span: 'text-sm  cursor-edit',
                                      }}
                                      name={`education.other.${index}.metricValue`}
                                      value={
                                        values.education.other[index]
                                          .metricValue
                                      }
                                      emptyFieldDefaultVal={
                                        defaultVals.education.metricValue
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="w-1/4 text-right">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm ',
                                        span: 'text-sm  cursor-edit',
                                      }}
                                      name={`education.other.${index}.location`}
                                      value={
                                        values.education.other[index].location
                                      }
                                      emptyFieldDefaultVal={
                                        defaultVals.education.location
                                      }
                                    />
                                  </div>
                                  <ToggleableInput
                                    classes={{
                                      input: 'text-sm ',
                                      span: 'text-sm  cursor-edit',
                                    }}
                                    name={`education.other.${index}.startDate`}
                                    value={
                                      values.education.other[index].startDate
                                    }
                                    emptyFieldDefaultVal={
                                      defaultVals.education.startDate
                                    }
                                  />
                                  -{' '}
                                  <ToggleableInput
                                    classes={{
                                      input: 'text-sm ',
                                      span: 'text-sm  cursor-edit',
                                    }}
                                    name={`education.other.${index}.endDate`}
                                    value={
                                      values.education.other[index].endDate
                                    }
                                    emptyFieldDefaultVal={
                                      defaultVals.education.endDate
                                    }
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div className=" col-span-2 col-start-1 row-span-1 border-r-2 border-solid pr-2">
                    <div className="flex justify-between">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="ml-2 mt-1 hover:cursor-pointer"
                        onClick={() =>
                          setFieldValue('work', [
                            ...values.work,
                            workExperienceDefaultVals,
                          ])
                        }
                      />
                      <div className="w-3/4 text-right font-semibold">
                        {' '}
                        Work Experience
                      </div>
                    </div>
                  </div>
                  <div className="col-span-10  col-start-3 row-span-1 row-start-3">
                    <FieldArray name="work">
                      {(arrayHelpers) => (
                        <div>
                          {values.work && values.work.length > 0 ? (
                            values.work.map((obj, index) => (
                              <div className="flex justify-between ">
                                <div className="w-3/4">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input:
                                          'mr-2 text-base font-semibold w-full',
                                        span: 'mr-2 text-base font-semibold cursor-edit',
                                      }}
                                      name={`work[${index}].company`}
                                      value={values.work[index].company}
                                      emptyFieldDefaultVal={
                                        defaultVals.work.company
                                      }
                                    />
                                    <FontAwesomeIcon
                                      className="hover:cursor-pointer"
                                      icon={faTimesCircle}
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  </div>
                                  <div className="pl-5">
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm  w-full',
                                        span: 'text-sm  cursor-edit whitespace-pre-wrap',
                                      }}
                                      name={`work[${index}].desc`}
                                      value={values.work[index].desc}
                                      customField={(field, onBlur, ref) => (
                                        <textarea
                                          {...field}
                                          onBlur={onBlur}
                                          className="w-full border-2 border-dotted border-gray-700 text-base outline-none"
                                          ref={ref}
                                        >
                                          {values.work[index].desc}
                                        </textarea>
                                      )}
                                      emptyFieldDefaultVal={
                                        defaultVals.work.desc
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm ',
                                        span: 'text-sm  cursor-edit',
                                      }}
                                      name={`work[${index}].location`}
                                      value={values.work[index].location}
                                      emptyFieldDefaultVal={
                                        defaultVals.work.location
                                      }
                                    />
                                  </div>
                                  <ToggleableInput
                                    classes={{
                                      input: 'text-sm ',
                                      span: 'text-sm  cursor-edit',
                                    }}
                                    name={`work[${index}].startDate`}
                                    value={values.work[index].startDate}
                                    emptyFieldDefaultVal={
                                      defaultVals.work.startDate
                                    }
                                  />
                                  -{' '}
                                  <ToggleableInput
                                    classes={{
                                      input: 'text-sm ',
                                      span: 'text-sm  cursor-edit',
                                    }}
                                    name={`work[${index}].endDate`}
                                    value={values.work[index].endDate}
                                    emptyFieldDefaultVal={
                                      defaultVals.work.endDate
                                    }
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div
                    className={classNames(
                      'col-span-2 row-span-1  border-r-2 border-solid pr-2',
                      {
                        'row-start-4':
                          currentBatches[user.batch] !== 'Final Year',
                        'row-start-5':
                          currentBatches[user.batch] === 'Final Year',
                      }
                    )}
                  >
                    <div className="flex justify-between">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="ml-2 mt-1 hover:cursor-pointer"
                        onClick={() =>
                          setFieldValue('academicProjects', [
                            ...values.academicProjects,
                            academicProjectsDefaultVals,
                          ])
                        }
                      />
                      <div className="w-3/4 text-right font-semibold">
                        {' '}
                        Projects
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'col-span-10 row-span-1   border-solid pr-2',
                      {
                        'row-start-4':
                          currentBatches[user.batch] !== 'Final Year',
                        'row-start-5':
                          currentBatches[user.batch] === 'Final Year',
                      }
                    )}
                  >
                    <FieldArray name="academicProjects">
                      {(arrayHelpers) => (
                        <div>
                          {values.academicProjects &&
                          values.academicProjects.length > 0 ? (
                            values.academicProjects.map((obj, index) => (
                              <div>
                                <div className="w-3/4">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input:
                                          'mr-2 text-base font-semibold w-full',

                                        span: 'mr-2 text-base font-semibold cursor-edit',
                                      }}
                                      name={`academicProjects[${index}].name`}
                                      value={
                                        values.academicProjects[index].name
                                      }
                                      emptyFieldDefaultVal={
                                        defaultVals.academicProjects.name
                                      }
                                    />
                                    <FontAwesomeIcon
                                      className="hover:cursor-pointer"
                                      icon={faTimesCircle}
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  </div>
                                  <div className="pl-5">
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm  w-full',
                                        span: 'text-sm  cursor-edit',
                                      }}
                                      name={`academicProjects[${index}].desc`}
                                      value={
                                        values.academicProjects[index].desc
                                      }
                                      customField={(field, onBlur, ref) => (
                                        <textarea
                                          {...field}
                                          onBlur={onBlur}
                                          className="w-full border-2 border-dotted border-gray-700 text-sm outline-none"
                                          ref={ref}
                                        >
                                          {values.academicProjects[index].desc}
                                        </textarea>
                                      )}
                                      emptyFieldDefaultVal={
                                        defaultVals.academicProjects.desc
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div
                    className={classNames(
                      'col-span-2 row-span-1  border-r-2 border-solid pr-2',
                      {
                        'row-start-5':
                          currentBatches[user.batch] !== 'Final Year',
                        'row-start-6':
                          currentBatches[user.batch] === 'Final Year',
                      }
                    )}
                  >
                    <div className="flex justify-between">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="ml-2 mt-1 hover:cursor-pointer"
                        onClick={() =>
                          setFieldValue('awardsAndAchievements', [
                            ...values.awardsAndAchievements,
                            awardsAndAchievementsDefaultVal,
                          ])
                        }
                      />
                      <div className="w-3/4 text-right font-semibold">
                        {' '}
                        Awards & Acheivments
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'col-span-10 row-span-1 border-solid pr-2',
                      {
                        'row-start-5':
                          currentBatches[user.batch] !== 'Final Year',
                        'row-start-6':
                          currentBatches[user.batch] === 'Final Year',
                      }
                    )}
                  >
                    <FieldArray name="awardsAndAchievements">
                      {(arrayHelpers) => (
                        <div>
                          {values.awardsAndAchievements &&
                          values.awardsAndAchievements.length > 0 ? (
                            values.awardsAndAchievements.map((obj, index) => (
                              <div>
                                <div className="w-3/4">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input: 'mr-2 text-sm  w-3/4',
                                        span: ' cursor-edit',
                                      }}
                                      name={`awardsAndAchievements[${index}]`}
                                      value={
                                        values.awardsAndAchievements[index]
                                      }
                                      customComponent={(onClick) => (
                                        <span
                                          onClick={onClick}
                                          className="mr-2 cursor-edit text-sm"
                                        >
                                          -{' '}
                                          {values.awardsAndAchievements[index]}
                                        </span>
                                      )}
                                      emptyFieldDefaultVal={
                                        defaultVals.awardsAndAchievements
                                      }
                                    />
                                    <FontAwesomeIcon
                                      className="hover:cursor-pointer"
                                      icon={faTimesCircle}
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div
                    className={classNames(
                      'col-span-2 row-span-1  border-r-2 border-solid pr-2',
                      {
                        'row-start-6':
                          currentBatches[user.batch] !== 'Final Year',
                        'row-start-7':
                          currentBatches[user.batch] === 'Final Year',
                      }
                    )}
                  >
                    <div className="flex justify-between">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        className="ml-2 mt-1 hover:cursor-pointer"
                        onClick={() =>
                          setFieldValue('skills', [
                            ...values.skills,
                            skillDefaultVal,
                          ])
                        }
                      />
                      <div className="pr-2 text-right font-semibold">
                        {' '}
                        Skills
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'col-span-10  col-start-3 row-span-1',
                      {
                        'row-start-6':
                          currentBatches[user.batch] !== 'Final Year',
                        'row-start-7':
                          currentBatches[user.batch] === 'Final Year',
                      }
                    )}
                  >
                    <FieldArray name="skills">
                      {(arrayHelpers) => (
                        <div>
                          {values.skills && values.skills.length > 0 ? (
                            values.skills.map((obj, index) => (
                              <div>
                                <div className="w-3/4">
                                  <div>
                                    <ToggleableInput
                                      classes={{
                                        input: 'text-sm w-3/4  mr-2',
                                        span: 'text-sm  mr-2',
                                      }}
                                      name={`skills.${index}`}
                                      value={values.skills[index]}
                                      emptyFieldDefaultVal={defaultVals.skills}
                                      customComponent={(onClick) => (
                                        <span
                                          onClick={onClick}
                                          className="mr-2 cursor-edit text-sm"
                                        >
                                          - {values.skills[index]}
                                        </span>
                                      )}
                                    />
                                    <FontAwesomeIcon
                                      className="hover:cursor-pointer"
                                      icon={faTimesCircle}
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Home
