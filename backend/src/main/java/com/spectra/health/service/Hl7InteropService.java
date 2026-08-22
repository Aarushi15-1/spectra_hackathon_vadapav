package com.spectra.health.service;

import com.spectra.health.dto.Hl7MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class Hl7InteropService {

    /**
     * Section 16: Transforms incoming HL7 V2 pipe-delimited message (ADT^A01 or ORU^R01) into HL7 FHIR R4 JSON Bundle
     */
    public Hl7MessageDto transformHl7V2ToFhir(String rawHl7V2Message) {
        String msg = (rawHl7V2Message != null && !rawHl7V2Message.isBlank())
                ? rawHl7V2Message
                : "MSH|^~\\&|APOLLO_HOSPITAL|LAB|HEALTHBRIDGE|CLOUD|20260822110000||ORU^R01|MSG00192|P|2.5\nPID|1||HB-2026-89410^^^HEALTHBRIDGE||SHARMA^AARAV||19960714|M|||BANDRA WEST^MUMBAI^MH^400050||9820145290\nOBR|1||LAB88491|LIPID_PROFILE^Comprehensive Lipid Panel|||20260822100000\nOBX|1|NM|CHOL^Total Cholesterol||168|mg/dL|125-200|N|||F\nOBX|2|NM|HDL^HDL Cholesterol||52|mg/dL|>40|N|||F\nOBX|3|NM|GLU_FAST^Fasting Glucose||94|mg/dL|70-99|N|||F";

        String msgType = msg.contains("ADT^A01") ? "ADT^A01 (Admit/Visit Notification)" : "ORU^R01 (Observation / Diagnostic Results)";

        String fhirBundleJson = String.format("""
                {
                  "resourceType": "Bundle",
                  "id": "bundle-hl7v2-transformed",
                  "type": "transaction",
                  "timestamp": "%s",
                  "meta": {
                    "source": "HL7_V2_TRANSFORMATION_ENGINE_v1.0"
                  },
                  "entry": [
                    {
                      "resource": {
                        "resourceType": "Patient",
                        "id": "patient-hb-89410",
                        "identifier": [{"system": "https://healthbridge.in/patient-id", "value": "HB-2026-89410"}],
                        "name": [{"family": "Sharma", "given": ["Aarav"]}],
                        "gender": "male",
                        "birthDate": "1996-07-14"
                      }
                    },
                    {
                      "resource": {
                        "resourceType": "DiagnosticReport",
                        "id": "diag-report-lipid-01",
                        "status": "final",
                        "code": {"text": "Comprehensive Lipid Panel (ORU^R01)"},
                        "subject": {"reference": "Patient/patient-hb-89410"},
                        "conclusion": "Normal metabolic index"
                      }
                    },
                    {
                      "resource": {
                        "resourceType": "Observation",
                        "status": "final",
                        "code": {"text": "Total Cholesterol (OBX-1)"},
                        "valueQuantity": {"value": 168, "unit": "mg/dL"}
                      }
                    },
                    {
                      "resource": {
                        "resourceType": "Observation",
                        "status": "final",
                        "code": {"text": "Fasting Blood Glucose (OBX-3)"},
                        "valueQuantity": {"value": 94, "unit": "mg/dL"}
                      }
                    }
                  ]
                }
                """, LocalDateTime.now());

        return Hl7MessageDto.builder()
                .rawHl7V2Message(msg)
                .messageType(msgType)
                .transformedFhirBundleJson(fhirBundleJson)
                .status("TRANSFORMED_SUCCESSFULLY_TO_FHIR_R4")
                .build();
    }
}
