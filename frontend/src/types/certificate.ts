

export interface Certificate {
  id?:number;
  title: string;                // required, max 255 chars
  issuedOrganisation: string;   // required, max 255 chars
  issueDate: string;            // LocalDate -> ISO string (e.g., "2025-08-31")
  mediaUrl: string;             // required
  credentialId: string;         // required, max 255 chars
  credentialUrl: string;        // required
}


