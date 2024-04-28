package com.heisenburg.springbootecommerce.service;

import com.heisenburg.springbootecommerce.dto.Purchase;
import com.heisenburg.springbootecommerce.dto.PurchaseResponse;


public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
