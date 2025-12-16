package com.psysafe.model;

public class RespostaItem {

    private Integer id;
    private String respostaId;  // UUID da resposta pai
    private Integer perguntaId;
    private Integer valor;

    public RespostaItem() {}

    public RespostaItem(Integer id, String respostaId, Integer perguntaId, Integer valor) {
        this.id = id;
        this.respostaId = respostaId;
        this.perguntaId = perguntaId;
        this.valor = valor;
    }

    // Getters e Setters
    public Integer getId() { 
        return id; 
    }
    
    public void setId(Integer id) { 
        this.id = id; 
    }

    public String getRespostaId() { 
        return respostaId; 
    }
    
    public void setRespostaId(String respostaId) { 
        this.respostaId = respostaId; 
    }

    public Integer getPerguntaId() { 
        return perguntaId; 
    }
    
    public void setPerguntaId(Integer perguntaId) { 
        this.perguntaId = perguntaId; 
    }

    public Integer getValor() { 
        return valor; 
    }
    
    public void setValor(Integer valor) { 
        this.valor = valor; 
    }
}