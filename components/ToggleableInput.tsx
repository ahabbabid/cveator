import {
  useState,
  ReactElement,
  useRef,
  useEffect,
  MutableRefObject,
} from 'react'
import { Field, FieldProps } from 'formik'

import classNames from 'classnames'
interface ToggleAbleInputProps {
  value?: string
  name: string
  customComponent?: (onClick: () => void) => ReactElement
  customField?: (
    field: any,
    onBlur: () => void,
    ref?: MutableRefObject<HTMLInputElement | undefined> | undefined
  ) => ReactElement
  classes?: {
    input?: string
    span?: string
  }
  emptyFieldDefaultVal?: string
}

const ToggleableInput = (props: ToggleAbleInputProps) => {
  const {
    value,
    name,
    classes,
    customComponent,
    customField,
    emptyFieldDefaultVal,
  } = props
  const ref = useRef<HTMLInputElement>()
  const [isInputVisible, setIsInputVisible] = useState(false)
  const toggle = () => {
    setIsInputVisible((curr) => !curr)
  }
  // useEffect(() => {
  //   if (ref && ref.current) ref.current.focus()
  //   ref.current?.setSelectionRange(
  //     ref.current.value.length,
  //     ref.current.value.length
  //   )
  // }, [])

  return (
    <>
      {!isInputVisible ? (
        customComponent ? (
          customComponent(toggle)
        ) : (
          <span
            onClick={toggle}
            className={classNames(classes?.span, 'whitespace-pre-wrap')}
          >
            {value}
          </span>
        )
      ) : customField ? (
        <Field name={name}>
          {({ field, form }: FieldProps) =>
            customField(
              field,
              () => {
                if (emptyFieldDefaultVal && field.value === '')
                  form.setFieldValue(name, emptyFieldDefaultVal)
                setIsInputVisible(false)
              },
              ref ? ref : undefined
            )
          }
        </Field>
      ) : (
        <Field name={name}>
          {({ field, form }: FieldProps) => (
            <input
              type="text"
              autoFocus
              {...field}
              onBlur={() => {
                if (emptyFieldDefaultVal && field.value === '')
                  form.setFieldValue(name, emptyFieldDefaultVal)
                setIsInputVisible(false)
              }}
              className={classNames(
                classes?.input,
                'border-2 border-dotted border-gray-700 outline-none'
              )}
            />
          )}
        </Field>
      )}
    </>
  )
}
export { ToggleableInput }
export type { ToggleAbleInputProps }
