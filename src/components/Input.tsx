import React, { useCallback, useState, memo } from 'react'
import identity from 'lodash/identity'
import {
  Input as FluentInput,
  InputProps as FluentInputProps,
} from '@fluentui/react-northstar'

type InputProps = Omit<FluentInputProps, 'onChange'> & {
  getter?: (value: any) => string
  setter?: (valueStr: string) => any
  onChange: (value: any) => void
}

export const Input = ({
  value,
  onChange,
  getter = identity,
  setter = identity,
  ...props
}: InputProps) => {
  console.log('[value]', value)

  const [internalValue, setInternalValue] = useState(getter(value))

  const onUpdate = useCallback(() => {
    const settableValue = setter(internalValue)
    onChange(settableValue)
    setInternalValue(getter(settableValue))
  }, [internalValue])

  return (
    <FluentInput
      value={internalValue}
      onChange={(_e, { value }) => setInternalValue(value)}
      onBlur={onUpdate}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          onUpdate()
        }
      }}
      onClick={onUpdate}
      {...props}
    />
  )
}
