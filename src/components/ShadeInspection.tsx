import React from 'react'
import { Box, Header, Flex, Text, Tooltip } from '@fluentui/react-northstar'
import { Vec3 } from '../lib/interfaces'
import { Lab_to_LCH, rgbToHsv } from '../lib/csswg/conversions'
import { LAB_to_sRGB } from '../lib/csswg/utilities'
import { sRGB_to_hex } from '../lib/paletteShades'

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr min-content',
    gridColumnGap: 0,
    gridRowGap: '.1em',
    marginInlineEnd: '1rem',
  },
  kvk: {
    textAlign: 'center',
    fontWeight: 900,
    marginInlineEnd: '.5rem',
  },
  kvv: {
    margin: 0,
    display: 'contents',
  },
}

const KeyValue = ({
  k,
  v,
  unit = '',
}: {
  k: string
  v: string
  unit?: string
}) => (
  <>
    <Text as="dt" styles={styles.kvk}>
      {k}
    </Text>
    <Box as="dd" styles={styles.kvv}>
      <Text align="end">{v}</Text>
      <Text>{unit}</Text>
    </Box>
  </>
)

export const ShadeInspection = ({
  lab,
  children,
}: {
  lab: Vec3
  children: JSX.Element
}) => {
  const lch = Lab_to_LCH(lab)
  const srgb = LAB_to_sRGB(lab)
  const hsv = rgbToHsv(srgb)
  const hex = sRGB_to_hex(srgb)

  console.log(srgb, hsv)

  return (
    <Tooltip
      pointing
      trigger={children}
      content={
        <Box>
          <Header as="h1" styles={{ margin: 0, fontWeight: 200 }}>
            {hex}
          </Header>
          <Flex styles={{ marginInlineEnd: '-1.5rem' }}>
            <Box as="dl" styles={styles.grid}>
              <KeyValue k="hº" v={`${lch[2].toFixed(1)}`} unit="º" />
              <KeyValue k="C*" v={`${lch[1].toFixed(1)}`} />
              <KeyValue k="L" v={`${lch[0].toFixed(1)}`} />
            </Box>
            <Box as="dl" styles={styles.grid}>
              <KeyValue k="H" v={`${(hsv[0] * 360).toFixed(0)}`} unit="º" />
              <KeyValue k="S" v={`${(hsv[1] * 100).toFixed(0)}`} unit="%" />
              <KeyValue k="V" v={`${(hsv[2] * 100).toFixed(0)}`} unit="%" />
            </Box>
          </Flex>
        </Box>
      }
    />
  )
}
