package com.heisenburg.springbootecommerce.dao;

import com.heisenburg.springbootecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "productCategories", path = "product-categories")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
