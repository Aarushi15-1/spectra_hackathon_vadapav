package com.spectra.health.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hl7MessageDto {
    private String rawHl7V2Message; // Pipe-delimited HL7 V2 message (e.g. MSH|^~\&|HOSPITAL_A|LAB|...)
    private String messageType; // ADT^A01 (Admission), ORU^R01 (Observation/Lab result), RDE^O11 (Pharmacy/Prescription)
    private String transformedFhirBundleJson; // Transformed FHIR R4 Bundle representation
    private String status; // TRANSFORMED_SUCCESSFULLY
}
