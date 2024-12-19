import { render } from '@testing-library/react'
import { renderWithStore } from './utils/test-utils'
import Page from '@/app/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

describe('Page', () => {
  it('renders the chat interface', () => {
    const { getByPlaceholderText } = renderWithStore(<Page />)
    expect(getByPlaceholderText(/type your message/i)).toBeInTheDocument()
  })
}) 