package com.quitq.ecommerce.service;

public class DashboardStats {
    private long totalOrders;
    private double totalRevenue;

    public DashboardStats(long totalOrders, double totalRevenue) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalOrders() { return totalOrders; }
    public double getTotalRevenue() { return totalRevenue; }
}