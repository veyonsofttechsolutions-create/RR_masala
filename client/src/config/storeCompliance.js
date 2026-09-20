// client/src/config/storeCompliance.js

/*
 * IMPORTANT:
 * Replace empty values with VERIFIED business information
 * before production.
 *
 * Never invent GST, FSSAI, IEC, CRES, APEDA or grievance details.
 */

export const storeCompliance = {
  legalName: "RR MASALA",

  // Add only after business documents are verified.
  registeredAddress: "",

  // Tax / food / export registrations
  gstin: "",
  fssaiLicenseNo: "",
  iec: "",
  cres: "",
  apedaRcmc: "",

  // Customer support
  customerCareEmail: "",
  customerCarePhone: "",

  // Grievance contact
  grievanceOfficerName: "",
  grievanceOfficerEmail: "",
  grievanceOfficerPhone: "",

  countryOfOrigin: "India",
};