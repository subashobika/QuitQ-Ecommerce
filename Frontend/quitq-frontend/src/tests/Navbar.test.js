import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import React from 'react';


const mockLogout = jest.fn();
let mockUser = null;

jest.mock('../hooks/useAuth', () => () => ({
  user: mockUser,
  logout: mockLogout,
}));


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ children, ...props }) => (
      <a {...props}>{children}</a> 
    ),
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  };
});

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Login and Register when no user', () => {
    mockUser = null;

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('renders USER menu items', () => {
    mockUser = { role: 'USER', name: 'TestUser' };

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/categories/i)).toBeInTheDocument();
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getAllByText(/profile/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('renders ADMIN menu items', () => {
    mockUser = { role: 'ADMIN', name: 'AdminUser' };

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/order management/i)).toBeInTheDocument();
    expect(screen.getByText(/category management/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('renders SELLER menu items', () => {
    mockUser = { role: 'SELLER', name: 'SellerUser' };

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/business details/i)).toBeInTheDocument();
    expect(screen.getByText(/seller dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/manage products/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('logout button works', () => {
    mockUser = { role: 'USER' };

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
