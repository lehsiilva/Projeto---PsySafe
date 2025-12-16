package com.psysafe.model;

public class Departamento {
    private String value;
    private String label;
    
    public Departamento(String value, String label) {
        this.value = value;
        this.label = label;
    }
    
    // Getters e Setters
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}