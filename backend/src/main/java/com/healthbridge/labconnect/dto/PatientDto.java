package com.healthbridge.labconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private String id;
    private String name;
    private int age;
    private String gender;
    private String bloodGroup;
    private String phone;
    private int ordersCount;
    private String lastVisit;

    public PatientDto() {
    }

    public PatientDto(String id, String name, int age, String gender, String bloodGroup, String phone, int ordersCount, String lastVisit) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.ordersCount = ordersCount;
        this.lastVisit = lastVisit;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getOrdersCount() { return ordersCount; }
    public void setOrdersCount(int ordersCount) { this.ordersCount = ordersCount; }

    public String getLastVisit() { return lastVisit; }
    public void setLastVisit(String lastVisit) { this.lastVisit = lastVisit; }
}
