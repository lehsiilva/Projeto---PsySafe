package com.psysafe.controller;

import static spark.Spark.*;

import com.psysafe.util.GsonUtil;
import com.google.gson.Gson;
import com.psysafe.model.Usuario;
import com.psysafe.service.UsuarioService;


import java.util.List;
import java.util.Map;

public class DevController {

    private static final Gson gson = GsonUtil.getGson();
    private static final UsuarioService usuarioService = new UsuarioService();  

 
        
}
