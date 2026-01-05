import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Auth/Login';


jest.mock('../api/api', () => ({
  post: jest.fn(),
}));

jest.mock('../hooks/useAuth', () => () => ({
  login: jest.fn(),
}));


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

import api from '../api/api';


beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

   
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

  
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error on failed login', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('redirects to admin dashboard on successful login', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: 'Bearer fakeToken123',
        user: { role: 'ADMIN', name: 'Test Admin' },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'admin@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  test('redirects to seller dashboard on successful login', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: 'Bearer fakeToken123',
        user: { role: 'SELLER', name: 'Test Seller' },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'seller@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/seller/dashboard');
    });
  });

  test('redirects to home on successful login with default role', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: 'Bearer fakeToken123',
        user: { role: 'CUSTOMER', name: 'Test User' },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@mail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
