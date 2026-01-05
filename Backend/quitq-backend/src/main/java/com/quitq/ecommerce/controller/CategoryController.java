package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.CategoryDTO;
import com.quitq.ecommerce.service.CategoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<CategoryDTO> addCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        logger.info("Request to add new category: {}", categoryDTO);
        CategoryDTO savedCategory = categoryService.addCategory(categoryDTO);
        logger.info("Category added successfully with id: {}", savedCategory.getId());
        return ResponseEntity.ok(savedCategory);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','USER')")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        logger.info("Request to get all categories");
        List<CategoryDTO> categories = categoryService.getAllCategories();
        logger.info("Returning {} categories", categories.size());
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDTO categoryDTO) {
        logger.info("Request to update category with id: {} with data: {}", id, categoryDTO);
        CategoryDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
        logger.info("Category updated successfully with id: {}", updatedCategory.getId());
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        logger.info("Request to delete category with id: {}", id);
        categoryService.deleteCategory(id);
        logger.info("Category with id: {} deleted successfully", id);
        return ResponseEntity.ok().build();
    }
}
