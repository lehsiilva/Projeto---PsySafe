package com.psysafe.service;

import com.psysafe.model.UserProfile;
import java.util.ArrayList;
import java.util.List;

public class UsuarioService {

    private List<UserProfile> usuarios = new ArrayList<>();

    public List<UserProfile> getAllUsers() {
        return usuarios;
    }

    public UserProfile getUserById(String id) {
        return usuarios.stream()
                       .filter(u -> u.getId().equals(id))
                       .findFirst()
                       .orElse(null);
    }

    public void addUser(UserProfile user) {
        usuarios.add(user);
    }
}
