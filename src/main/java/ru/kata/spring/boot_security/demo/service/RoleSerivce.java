package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

public interface RoleSerivce {
    List<Role> getAllRoles();
    Role getRoleById(Integer id);
    Role save(Role role);
    Role findByName(String name);
}
