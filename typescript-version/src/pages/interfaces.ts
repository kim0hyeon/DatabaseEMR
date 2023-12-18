export interface Patient {
  patient_id: string
  patient_name: string
  patient_gender: string
  patient_birth: string
  patient_residence_number: string
  patient_phone_number: string
  patient_emergency_phone_number: string
  patient_address: string
  patient_agree_essential_term: boolean
  patient_agree_optional_term: boolean
}

export interface Reception {
  reception_id: string
  visit_reason: string
  reception_date: string
  reception_date_only: string
  patient: {
    patient_id: string
    patient_name: string
    patient_gender: string
  }
}

export interface Chart {
  chart_id: string
  diagnosis: string
  datetime: string
  date_only: string
  image_id: string
  image_url: string
  patient: {
    patient_id: string
    patient_name: string
    patient_gender: string
    patient_birth: string
    patient_residence_number: string
    patient_phone_number: string
    patient_emergency_phone_number: string
    patient_address: string
    patient_agree_essential_term: boolean
    patient_agree_optional_term: boolean
  }
  medical: {
    medical_person_id: string
    medical_person_name: string
    medical_person_system_id: string
    medical_person_gender: string
    medical_person_birthday: string
    medical_person_phone_number: string
    medical_person_main_address: string
    medical_person_license: string
    classification_code: string
  }
  inspect: []
  disease: []
  treatment: []
  medication: []
}

export interface Inspect {
  inspect_type_id: string
  inspect_type: string
  inspect_cost: number
}

export interface Disease {
  id: number
  disease_code: string
  disease_name: string
  disease_description: string
}

export interface Treatment {
  treatment_code: string
  treatment_name: string
  treatment_cost: number
}

export interface Medication {
  medication_code: string
  medication_name: string
  medication_type: string
  medication_description: string
  administration_method: string
  medication_cost: number
}

export interface Photo {
  file: File
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  job: string
}

export interface Event {
  date: Date
  hour: number
  minute: number
  title: string
  diagnosis: string
}

export interface Reservation {
  date: string
  hour: number
  minute: number
  patient: {
    patient_id: number
    patient_name: string
    patient_gender: string
  }
}

export interface InBodyTest {
  weight: number
  muscle_mass: number
  body_fat_mass: number
  bmi: number
  percent_body_fat: number
  right_arm: number
  left_arm: number
  trunk: number
  right_leg: number
  left_leg: number
  patient_id: string
  record_date: string
  inbody_id: string
}

export interface BloodTest {
  hemoglobin: number
  fasting_blood_sugar: number
  total_cholesterol: number
  hdl_cholesterol: number
  triglycerides: number
  ldl_cholesterol: number
  serum_creatinine: number
  glomerular_filtration_rate: number
  ast: number
  alt: number
  gamma_gt: number
}

export interface Physio {
  physio_id: string
  physio_name: string
  physio_desciption: string
  physio_kind: string
  physio_value: string
  physio_type: string
  physio_cost: number
}
