import { NextPage } from 'next'
import { Formik, Field, FieldProps } from 'formik'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

interface LoginFormErrorType {
  regNo?: string
  password?: string
}

const LoginPage: NextPage = () => {
  const router = useRouter()
  const [loginError, setLoginError] = useState('')
  return (
    <div className="flex h-screen items-center justify-center bg-sky-900">
      <div className="flex h-3/4 w-1/3 items-center justify-center rounded-lg bg-gray-100">
        <Formik
          validate={(values) => {
            const errors: LoginFormErrorType = {}
            if (values.password === '') {
              errors['password'] = 'required'
            }
            if (values.regNo === '') {
              errors['regNo'] = 'required'
            }

            return errors
          }}
          initialValues={{
            regNo: '',
            password: '',
          }}
          onSubmit={async (values, actions) => {
            try {
              const res = await fetch('/api/login', {
                method: 'post',
                body: JSON.stringify(values),
              })
              if (res.status === 200) {
                router.push('/')
              } else if (res.status === 400) {
                const body = await res.json()
                if (body.error) {
                  setLoginError(body.error)
                }
              }
            } catch (e) {
              console.log(e)
            }
          }}
        >
          {({ values, handleSubmit, isSubmitting }) => (
            <form className="w-3/4" onSubmit={handleSubmit}>
              <div className="mb-5 ">
                {loginError && (
                  <div className="rounded-md border-gray-700 bg-white p-2 text-center text-red-800">
                    {loginError}
                  </div>
                )}
              </div>
              <div className=" mb-5 flex">
                <div className="mr-3 flex w-1/4 text-right font-semibold text-sky-900">
                  <label>Registration Number </label>
                </div>
                <Field name="regNo">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-3/4">
                      <input
                        {...field}
                        type="text"
                        className={classNames(
                          'w-full rounded-md border-2 border-sky-900 p-2 focus:outline-none',
                          {
                            'border-red-800': meta.error && meta.touched,
                          }
                        )}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-sm text-red-800">
                          {meta.error}{' '}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              <div className="mb-5 flex">
                <div className="mr-3  w-1/4 text-right font-semibold text-sky-900">
                  <label>Password</label>
                </div>
                <Field type="password" placeholder="Password" name="password">
                  {({ field, meta }: FieldProps) => (
                    <div className="w-3/4">
                      <input
                        {...field}
                        type="text"
                        placeholder="Password"
                        className={classNames(
                          'w-full rounded-md border-2 border-sky-900 p-2 focus:outline-none',
                          {
                            'border-red-800': meta.error && meta.touched,
                          }
                        )}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-sm text-red-800">
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
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default LoginPage
