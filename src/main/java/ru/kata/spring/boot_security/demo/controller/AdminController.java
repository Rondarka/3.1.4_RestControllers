package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;

@Controller
@RequestMapping("admin")
public class AdminController {

    @GetMapping
    public String allUsersPage (@AuthenticationPrincipal User currentAdmin, ModelMap model) {
        model.addAttribute("admInfo", currentAdmin);
        return "admin";
    }
}
