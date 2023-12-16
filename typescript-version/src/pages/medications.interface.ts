// medications.interface.ts
interface Medication {
  code: string;
  name: string;
  type: string;
  description: string;
}

interface MedicationsData {
  medications: Medication[];
}

export default MedicationsData;
