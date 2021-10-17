import React from 'react'
import { EntityName, MainContent } from '../components'
import { useParams, useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { themesSlice } from '../state/themes'

export const Theme = () => {
  const { themeId } = useParams()
  const history = useHistory()
  const dispatch = useAppDispatch()

  const themeName = useAppSelector((state) => state.themes[themeId].name)

  return (
    <MainContent back>
      <EntityName
        name={themeName}
        emptyNameValue={'Untitled theme'}
        onChange={(value) =>
          dispatch(
            themesSlice.actions.setName({
              id: themeId,
              name: value,
            })
          )
        }
        onDelete={() => {
          dispatch(themesSlice.actions.delete({ id: themeId }))
          history.push('/')
        }}
      />
    </MainContent>
  )
}
