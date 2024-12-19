import { render, screen } from '@testing-library/react';
import ChatInterface from '@/components/chat/chat-interface';

describe('ChatInterface', () => {
  it('renders chat input', () => {
    render(<ChatInterface />);
    
    // Look for the message input
    const input = screen.getByPlaceholderText(/type your message/i);
    expect(input).toBeInTheDocument();

    // Look for send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeInTheDocument();
  });
}); 