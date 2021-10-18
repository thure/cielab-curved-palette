import { Box, Flex, Input, Slider, Text } from '@fluentui/react-northstar'
import React, { ReactNode } from 'react'

interface SliderInputProps {
  value: number
  min: number
  max: number
  label: ReactNode
  id: string
  onChange: (value: number) => void
  reverseInputs?: boolean
  reverseSlider?: boolean
}

export const SliderInput = ({
  value,
  min,
  max,
  label,
  id,
  reverseInputs,
  reverseSlider,
  onChange,
}: SliderInputProps) => {
  const sk = reverseSlider ? -1 : 1
  const numericProps = {
    min: reverseSlider ? max * -1 : min,
    max: reverseSlider ? min * -1 : max,
    step: 0.5,
  }
  const inputs = [
    <Input
      fluid
      type="number"
      {...numericProps}
      aria-labelledby={id}
      value={value.toFixed(1)}
      onChange={(_e, { value }) => onChange(parseFloat(value))}
      styles={{ width: '4.4rem', flex: '0 0 auto' }}
      key="i1"
    />,
    <Slider
      fluid
      {...numericProps}
      aria-labelledby={id}
      value={value * sk}
      onChange={(_e, { value }) => onChange(sk * parseFloat(value))}
      styles={{
        flex: '1 0 0',
        [reverseInputs ? 'marginInlineEnd' : 'marginInlineStart']: '.5rem',
      }}
      key="i2"
    />,
  ]
  return (
    <Box
      styles={{
        flex: '1 0 0',
        marginInlineEnd: '1rem',
        ...(reverseInputs && { textAlign: 'inline-end' }),
      }}
    >
      <Text as="label" id={id}>
        {label}
      </Text>
      <Flex styles={{ margin: '.5rem 0' }} vAlign="center">
        {reverseInputs ? inputs.reverse() : inputs}
      </Flex>
    </Box>
  )
}
