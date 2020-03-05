import { render } from '@testing-library/react'
import React from 'react'
import { I18nProvider } from 'react-i18n-base'

export default async function renderI18n(node, lang = 'en') {
  const authUser = {
    id: 'user-id',
  }
  const authUserProviderValue = [
    authUser,
    () => {
      /** do nothing */
    },
  ]

  return render(<I18nProvider defaultLanguage={lang}>{node}</I18nProvider>)
}
