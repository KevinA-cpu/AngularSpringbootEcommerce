package com.heisenburg.springbootecommerce.service;

import com.heisenburg.springbootecommerce.dao.CustomerRepository;
import com.heisenburg.springbootecommerce.dto.Purchase;
import com.heisenburg.springbootecommerce.dto.PurchaseResponse;
import com.heisenburg.springbootecommerce.entity.Customer;
import com.heisenburg.springbootecommerce.entity.Order;
import com.heisenburg.springbootecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImplementation implements CheckoutService {

    private final CustomerRepository customerRepository;

    public CheckoutServiceImplementation(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase){
        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItemSet = purchase.getOrderItems();
        orderItemSet.forEach(order::add);

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();
        customer.add(order);

        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
