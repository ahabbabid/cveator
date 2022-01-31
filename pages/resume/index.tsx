import type { NextPage } from 'next'
import { useRouter } from 'next/router'
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
  awardsAndAcheivmentsDefaultVal,
  skillDefaultVal,
  defaultVals,
} from '../../lib/constants/resume'
import prisma from '../../prisma/prisma'
import config from '../../config.json'
import { useState } from 'react'
import classNames from 'classnames'

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
          user: { ...req.session.user, batch: resumeData?.batch },
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
    <div className="flex flex-col items-center bg-gray-100">
      <div className="flex h-10 w-screen items-center justify-end bg-sky-900 pr-5 pl-5">
        <a
          className="cursor-pointer text-sm text-sky-100 underline"
          onClick={async (e) => {
            e.preventDefault()
            await fetch('/api/logout')
            router.replace('/login')
          }}
        >
          logout
        </a>
      </div>
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

                    saveAs(blob, 'example.pdf')
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
                    classes={{ input: 'text-sm', span: 'text-sm cursor-edit' }}
                    name="personalInfo.email"
                    value={values.personalInfo.email}
                    emptyFieldDefaultVal={defaultVals.personalInfo.email}
                  />
                  <br />
                  <ToggleableInput
                    classes={{ input: 'text-sm', span: 'text-sm cursor-edit' }}
                    name="personalInfo.phoneNumber"
                    value={values.personalInfo.phoneNumber}
                    emptyFieldDefaultVal={defaultVals.personalInfo.phoneNumber}
                  />
                  <br />
                </div>
                <div className="text-right">
                  <span className="text-base font-semibold">Address</span>
                  <br />
                  <ToggleableInput
                    classes={{ input: 'text-sm', span: 'text-sm cursor-edit' }}
                    name="address.houseAddress"
                    value={values.address.houseAddress}
                    emptyFieldDefaultVal={defaultVals.address.houseAddress}
                  />
                  <br />
                  <ToggleableInput
                    classes={{ input: 'text-sm', span: 'text-sm cursor-edit' }}
                    name="address.city"
                    value={values.address.city}
                    emptyFieldDefaultVal={defaultVals.address.city}
                  />
                  ,{' '}
                  <ToggleableInput
                    classes={{ input: 'text-sm', span: 'text-sm cursor-edit' }}
                    name="address.province"
                    value={values.address.province}
                    emptyFieldDefaultVal={defaultVals.address.province}
                  />
                  <br />
                  <ToggleableInput
                    classes={{ input: 'text-sm', span: 'text-sm cursor-edit' }}
                    name="address.country"
                    value={values.address.country}
                    emptyFieldDefaultVal={defaultVals.address.country}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-2 gap-y-3 border-t-2 border-solid border-black">
                <div className="col-span-2 row-span-1 border-r-2 border-solid pr-2 text-right">
                  <div className="font-semibold">Objective</div>
                </div>
                <div className="col-span-10  col-start-3 row-span-1 row-start-1">
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
                      className="ml-2 mt-1 opacity-50 hover:cursor-pointer hover:opacity-100  "
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
                  <div className="mb-5 flex justify-between last:mb-0">
                    <div>
                      <p className="text-base font-semibold">
                        {values.education.giki.institute}
                      </p>

                      <p className="text-sm">
                        &emsp;Bachelors of Science in{' '}
                        <ToggleableInput
                          classes={{
                            input: 'text-sm',
                            span: 'text-sm  cursor-edit',
                          }}
                          name={`education.giki.discipline`}
                          value={values.education.giki.discipline}
                          customField={(field, onBlur) => (
                            <select
                              {...field}
                              onBlur={onBlur}
                              defaultValue={'Computer Science'}
                              autoFocus
                              className="cursor-edit border-2 border-dotted border-gray-700 text-sm outline-none"
                            >
                              {disciplines.map((discipline) => (
                                <option value={discipline}>{discipline}</option>
                              ))}
                            </select>
                          )}
                        />
                      </p>

                      <p className="text-sm ">
                        &emsp;CGPA:{' '}
                        <ToggleableInput
                          classes={{
                            span: 'text-sm cursor-edit',
                            input: 'text-sm',
                          }}
                          name="education.giki.cgpa"
                          value={values.education.giki.cgpa}
                          emptyFieldDefaultVal="3.00"
                        />
                        /4.00
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {values.education.giki.location}
                      </p>
                      <ToggleableInput
                        name="education.giki.startDate"
                        value={values.education.giki.startDate}
                        emptyFieldDefaultVal="2022"
                      />
                      -{' '}
                      <ToggleableInput
                        classes={{
                          span: 'text-sm cursor-edit',
                          input: 'text-sm',
                        }}
                        name="education.giki.endDate"
                        value={values.education.giki.endDate}
                        emptyFieldDefaultVal="2022"
                      />
                    </div>
                  </div>
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
                                    value={values.education.other[index].degree}
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
                                    value={values.education.other[index].metric}
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
                                      values.education.other[index].metricValue
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
                                ,{' '}
                                <ToggleableInput
                                  classes={{
                                    input: 'text-sm ',
                                    span: 'text-sm  cursor-edit',
                                  }}
                                  name={`education.other.${index}.endDate`}
                                  value={values.education.other[index].endDate}
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
                                      span: 'text-sm  cursor-edit',
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
                                    emptyFieldDefaultVal={defaultVals.work.desc}
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
                                ,{' '}
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
                {currentBatches[user.batch] === 'Final Year' && (
                  <>
                    <div
                      className={classNames(
                        'col-span-2 row-span-1 row-start-4 border-r-2 border-solid pr-2'
                      )}
                    >
                      <div className="text-right font-semibold">
                        Final Year Project
                      </div>
                    </div>
                    <div
                      className={classNames(
                        'col-span-10 col-start-3 row-span-1 border-solid pr-2',
                        {
                          'row-start-3':
                            currentBatches[user.batch] !== 'Final Year',
                          'row-start-4':
                            currentBatches[user.batch] === 'Final Year',
                        }
                      )}
                    >
                      <div className="w-3/4">
                        <div>
                          <ToggleableInput
                            classes={{
                              input: 'mr-2 text-base font-semibold w-full',

                              span: 'mr-2 text-base font-semibold cursor-edit',
                            }}
                            name={`fyp.name`}
                            value={
                              values.fyp?.name
                                ? values.fyp.name
                                : defaultVals.fyp.name
                            }
                            emptyFieldDefaultVal={defaultVals.fyp.name}
                          />
                        </div>
                        <div className="pl-5">
                          <ToggleableInput
                            classes={{
                              input: 'text-sm  w-full',
                              span: 'text-sm  cursor-edit',
                            }}
                            name={`fyp.desc`}
                            value={
                              values.fyp?.desc
                                ? values.fyp.desc
                                : defaultVals.fyp.desc
                            }
                            customField={(field, onBlur, ref) => (
                              <textarea
                                {...field}
                                onBlur={onBlur}
                                className="w-full border-2 border-dotted border-gray-700 text-sm outline-none"
                                ref={ref}
                              >
                                {values.fyp?.desc}
                              </textarea>
                            )}
                            emptyFieldDefaultVal={defaultVals.fyp.desc}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
                      Academic Projects
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
                                    value={values.academicProjects[index].name}
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
                                    value={values.academicProjects[index].desc}
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
                        setFieldValue('awardsAndAcheivments', [
                          ...values.awardsAndAcheivments,
                          awardsAndAcheivmentsDefaultVal,
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
                  <FieldArray name="awardsAndAcheivments">
                    {(arrayHelpers) => (
                      <div>
                        {values.awardsAndAcheivments &&
                        values.awardsAndAcheivments.length > 0 ? (
                          values.awardsAndAcheivments.map((obj, index) => (
                            <div>
                              <div className="w-3/4">
                                <div>
                                  <ToggleableInput
                                    classes={{
                                      input: 'mr-2 text-sm  w-3/4',
                                      span: ' cursor-edit',
                                    }}
                                    name={`awardsAndAcheivments[${index}]`}
                                    value={values.awardsAndAcheivments[index]}
                                    customComponent={(onClick) => (
                                      <span
                                        onClick={onClick}
                                        className="mr-2 cursor-edit text-sm"
                                      >
                                        - {values.awardsAndAcheivments[index]}
                                      </span>
                                    )}
                                    emptyFieldDefaultVal={
                                      defaultVals.awardsAndAcheivments
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
                    <div className="pr-2 text-right font-semibold"> Skills</div>
                  </div>
                </div>
                <div
                  className={classNames('col-span-10  col-start-3 row-span-1', {
                    'row-start-6': currentBatches[user.batch] !== 'Final Year',
                    'row-start-7': currentBatches[user.batch] === 'Final Year',
                  })}
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
  )
}

export default Home
