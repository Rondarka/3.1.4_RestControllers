package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;

@Controller
@RequestMapping("user")
public class UserController {

	@GetMapping
	public String userPage (@AuthenticationPrincipal User user, ModelMap model) {
		model.addAttribute("user", user);
		return "user";
	}
}