import { render, screen } from '@testing-library/react';
import Culture from './Race';

test('renders learn react link', () => {
  render(<Culture />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
