import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Auth/Register';


jest.mock('../api/api', () => ({
  post: jest.fn(),
}));
import api from '../api/api';


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows error if name is empty', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    
    expect(screen.getAllByText(/name is required/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/registration failed: name is required/i)
    ).toBeInTheDocument();
  });

  test('shows password validation error', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'abc' }, 
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

   
    expect(
      screen.getByText(/min 6 chars, 1 uppercase, 1 lowercase, 1 number/i)
    ).toBeInTheDocument();
  });

  test('prevents registration if role is ADMIN', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1' },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'ADMIN' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(
      screen.getByText(/role cannot be admin or empty/i)
    ).toBeInTheDocument();
  });

  test('shows server error on API failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: 'Email already exists' },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1' },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'USER' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(
      await screen.findByText(/email already exists/i)
    ).toBeInTheDocument();
  });

  test('navigates to login on successful registration', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'success' } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1' },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'USER' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
