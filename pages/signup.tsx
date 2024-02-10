import { NextPage } from 'next'
import Link from 'next/link'
import { Formik, Field, FieldProps } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import config from '../config.json'
import classNames from 'classnames'

interface SignupFormErrorType {
  username?: string
  password?: string
  passwordConfirm?: string
}

export async function getStaticProps() {
  const { currentBatches, faculties } = config
  return {
    props: {
      currentBatches,
      faculties,
    },
  }
}

const SignUpPage: NextPage<{
  currentBatches: {
    [batch: number]: string
  }
  faculties: Array<string>
}> = ({ currentBatches, faculties }) => {
  const router = useRouter()
  return (
    <div className="flex h-screen items-center justify-center bg-sky-900">
      <div className="flex h-3/4 w-1/3 items-center justify-center rounded-lg border-2 border-dashed border-sky-100 bg-gray-100">
        <Formik
          validate={(values) => {
            const errors: SignupFormErrorType = {}
            if (values.password !== values.passwordConfirm) {
              errors['passwordConfirm'] = 'passwords must match'
            }
            if (values.password === '') {
              errors['password'] = 'required'
            }

            return errors
          }}
          initialValues={{
            regNo: '',
            password: '',
            passwordConfirm: '',
            faculty: faculties[0],
            batch: Object.keys(currentBatches)[0],
          }}
          onSubmit={async (values, actions) => {
            try {
              const res = await fetch('/api/signup', {
                method: 'post',
                body: JSON.stringify(values),
              })
              if (res.status === 200) {
                router.replace('/resume')
              } else if (res.status === 401) {
                const body = await res.json()
                if (body.error) {
                  actions.setFieldError('regNo', 'username already exists')
                }
              }
            } catch (e) {
              console.log(e)
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className="w-3/4" onSubmit={handleSubmit}>
              <div className="text-center text-2xl font-bold text-sky-900">
                CVeator(Beta)
              </div>
              <div className="mb-5 mt-5 flex">
                <div className="mr-3 w-1/4 text-right font-semibold text-sky-900">
                  <label>Username</label>
                </div>
                <Field name="regNo">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-3/4">
                      <input
                        {...field}
                        placeholder="Registration Number "
                        className={classNames(
                          'w-full rounded-md border-2 border-sky-800 p-2 focus:outline-none',
                          {
                            'border-red-700': meta.error && meta.touched,
                          }
                        )}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-sm text-red-700">
                          {meta.error}{' '}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div className="mb-5 flex ">
                <div className="mr-3  w-1/4 text-right font-semibold text-sky-900">
                  <label>Password</label>
                </div>
                <Field placeholder="Password" name="password">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-3/4">
                      <input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className={classNames(
                          'w-full rounded-md border-2 border-sky-800 p-2 focus:outline-none',
                          {
                            'border-red-700': meta.error && meta.touched,
                          }
                        )}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-sm text-red-700">
                          {meta.error}{' '}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div className="mb-5 flex ">
                <div className="mr-3  w-1/4 text-right font-semibold text-sky-900">
                  <label>Confirm Password</label>
                </div>
                <Field placeholder="Password" name="passwordConfirm">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-3/4">
                      <input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className={classNames(
                          'w-full rounded-md border-2 border-sky-800 p-2 focus:outline-none',
                          {
                            'border-red-700': meta.error && meta.touched,
                          }
                        )}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-sm text-red-700">
                          {meta.error}{' '}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="rounded-md bg-sky-900 p-3 text-sky-100"
                  type="submit"
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
              <div className="mt-5 text-center text-sm text-sky-900">
                Already registered?{' '}
                <Link href={'/'}>
                  <a className="underline">Click here</a>
                </Link>{' '}
                to login
              </div>
              <div className="mt-5 text-center text-sm text-sky-400">
                Made with <FontAwesomeIcon icon={faHeart} /> by&nbsp;
                <a
                  target="_blank"
                  href="https://www.linkedin.com/in/ahabb-abid/"
                  className="underline"
                >
                  Muhammad Ahabb Abid
                </a>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SignUpPage
