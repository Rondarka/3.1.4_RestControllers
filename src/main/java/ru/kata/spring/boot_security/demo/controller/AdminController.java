package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleSerivce;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@Controller
@RequestMapping("admin")
public class AdminController {

    private final UserService userService;
    private final RoleSerivce roleSerivce;

    public AdminController(UserService userService, RoleSerivce roleSerivce) {
        this.userService = userService;
        this.roleSerivce = roleSerivce;
    }

    @GetMapping
    public String allUsersPage (ModelMap model) {

        User currentAdmin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("admInfo", currentAdmin);

        List<Role> roles = roleSerivce.getAllRoles();
        model.addAttribute("user", new User());
        model.addAttribute("roles", roles);

        return "admin";
    }

    @PostMapping("/new_user")
    public String newUserAdd (@ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("edit/{id}")
    public String editUser (@PathVariable("id") Integer id, @ModelAttribute("user") User user) {
        userService.updateUser(id, user);
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String deleteUser (@RequestParam(value = "id") Integer id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
