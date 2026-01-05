import adminService from '../services/adminService'; 
import api from '../api/api';


jest.mock('../api/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllUsers should fetch users', async () => {
    const mockData = [{ id: 1, name: 'User1' }];
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await adminService.getAllUsers();

    expect(api.get).toHaveBeenCalledWith('/admin/users');
    expect(result).toEqual(mockData);
  });

  test('deleteUser should call API with user id', async () => {
    api.delete.mockResolvedValueOnce({});

    await adminService.deleteUser(123);

    expect(api.delete).toHaveBeenCalledWith('/admin/users/123');
  });

  test('getAllOrders should fetch orders', async () => {
    const mockData = [{ id: 1, item: 'Product A' }];
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await adminService.getAllOrders();

    expect(api.get).toHaveBeenCalledWith('/admin/orders');
    expect(result).toEqual(mockData);
  });

  test('updateOrderStatus should send status update', async () => {
    const mockData = { id: 1, status: 'SHIPPED' };
    api.put.mockResolvedValueOnce({ data: mockData });

    const result = await adminService.updateOrderStatus(1, 'SHIPPED');

    expect(api.put).toHaveBeenCalledWith('/admin/orders/1/status', null, {
      params: { status: 'SHIPPED' },
    });
    expect(result).toEqual(mockData);
  });

  test('getDashboardStats should fetch dashboard data', async () => {
    const mockData = { users: 10, orders: 5 };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await adminService.getDashboardStats();

    expect(api.get).toHaveBeenCalledWith('/admin/dashboard');
    expect(result).toEqual(mockData);
  });
});
