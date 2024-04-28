package com.heisenburg.springbootecommerce.dto;

import com.heisenburg.springbootecommerce.entity.Address;
import com.heisenburg.springbootecommerce.entity.Customer;
import com.heisenburg.springbootecommerce.entity.Order;
import com.heisenburg.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
