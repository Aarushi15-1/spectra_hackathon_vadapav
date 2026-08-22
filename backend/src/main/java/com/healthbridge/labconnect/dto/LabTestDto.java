package com.healthbridge.labconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTestDto {
    private String code;
    private String name;
    private String category;
    private BigDecimal price;
    private int parameters;
    private String turnaroundTime;
    private Boolean active;

    public LabTestDto() {
    }

    public LabTestDto(String code, String name, String category, BigDecimal price, int parameters, String turnaroundTime, Boolean active) {
        this.code = code;
        this.name = name;
        this.category = category;
        this.price = price;
        this.parameters = parameters;
        this.turnaroundTime = turnaroundTime;
        this.active = active;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getParameters() { return parameters; }
    public void setParameters(int parameters) { this.parameters = parameters; }

    public String getTurnaroundTime() { return turnaroundTime; }
    public void setTurnaroundTime(String turnaroundTime) { this.turnaroundTime = turnaroundTime; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
