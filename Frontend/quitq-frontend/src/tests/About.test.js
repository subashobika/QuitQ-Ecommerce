import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../pages/User/About';

describe('About Component', () => {
  test('renders main heading', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /about quitq/i })
    ).toBeInTheDocument();
  });

  test('renders mission section', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /our mission/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/customer satisfaction first/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/innovation in every click/i)
    ).toBeInTheDocument();
  });

  test('renders contact info', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /get in touch/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/support@quitq.com/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/1-800-quitq/i)).toBeInTheDocument();
  });

  test('renders inspirational quote', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/we don't just sell products/i)
    ).toBeInTheDocument();
  });
});
