import '@testing-library/jest-dom'

// Mock components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />
}))

// Mock store
jest.mock('@/lib/store/chat-store', () => ({
  useChatStore: () => ({
    messages: [],
    isLoading: { chat: false },
    addMessage: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn()
  })
}))

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
}) 