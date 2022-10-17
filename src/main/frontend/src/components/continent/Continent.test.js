import { render, screen } from '@testing-library/react';
import Culture from './Continent';

test('renders learn react link', () => {
  render(<Culture />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
