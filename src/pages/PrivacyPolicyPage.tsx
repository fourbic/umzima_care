import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <Link to="/" className="text-primary-dark hover:text-primary-bright">
            Return to Dashboard
          </Link>
        </div>
        
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Umzima Health Privacy Policy</h2>
          <p className="text-sm text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-medium mb-3">1. Introduction</h3>
              <p className="mb-2">Umzima Health ("we," "our," or "us") is a digital health platform designed to empower small Primary Health Care (PHC) clinics by creating a networked system for devolving primary healthcare. We facilitate secure information sharing, communication, and care coordination among clinics and between clinics and patients. We do not directly provide healthcare services but serve as a technology platform connecting healthcare providers.</p>
              <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare coordination platform. This policy is designed to comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) and the Health Insurance Portability and Accountability Act (HIPAA).</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">2. Information We Collect</h3>
              <p className="mb-2">As a platform connecting PHC clinics, we collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Personal Identifiers:</strong> Name, date of birth, contact information, and government-issued identification numbers for clinic staff and patients.</li>
                <li><strong>Health Information:</strong> Medical history, diagnoses, treatments, medications, test results, and other health-related information shared between connected clinics.</li>
                <li><strong>Clinic Information:</strong> Clinic profiles, staff credentials, service capabilities, and operational data.</li>
                <li><strong>Communication Data:</strong> Messages, referrals, and coordination communications between clinics and with patients.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies when you use our platform.</li>
                <li><strong>Usage Data:</strong> Information about how clinics and users interact with our platform, including features used and workflow patterns.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">3. How We Use Your Information</h3>
              <p className="mb-2">We use your information to facilitate healthcare coordination and platform operations:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Enabling secure communication and referrals between networked PHC clinics</li>
                <li>Facilitating patient care coordination and continuity across clinics</li>
                <li>Supporting clinic-to-patient communication through SMS, voice, and portal messaging</li>
                <li>Maintaining patient records accessibility across the clinic network</li>
                <li>Providing offline functionality and data synchronization for resource-limited settings</li>
                <li>Improving platform features and developing new coordination tools</li>
                <li>Ensuring platform security, functionality, and HIPAA compliance</li>
                <li>Supporting community health worker (CHW) integration and patient outreach</li>
                <li>Complying with healthcare regulations and legal obligations</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">4. Legal Basis for Processing (GDPR)</h3>
              <p className="mb-2">Under the GDPR, we process your information based on the following legal grounds:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Consent:</strong> Where you have given explicit consent for specific coordination purposes.</li>
                <li><strong>Contractual Necessity:</strong> To fulfill our platform service agreements with clinics.</li>
                <li><strong>Legal Obligation:</strong> To comply with healthcare laws and regulations.</li>
                <li><strong>Legitimate Interests:</strong> To facilitate healthcare coordination and improve health equity, provided they don't override your fundamental rights and freedoms.</li>
                <li><strong>Vital Interests:</strong> To protect your vital interests or those of another person in healthcare emergencies.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">5. Data Sharing and Disclosure</h3>
              <p className="mb-2">As a coordination platform, we facilitate controlled data sharing with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Networked PHC Clinics:</strong> Healthcare providers within our clinic network for patient referrals and care coordination.</li>
                <li><strong>Healthcare Providers:</strong> Doctors, nurses, specialists, and community health workers involved in patient care through our platform.</li>
                <li><strong>Patients:</strong> Access to their own health information through our patient portal, SMS, and voice interfaces.</li>
                <li><strong>Service Providers:</strong> Third parties that help us operate our platform and provide coordination services.</li>
                <li><strong>Regulatory Authorities:</strong> Government agencies and regulatory bodies as required by law.</li>
              </ul>
              <p>We implement appropriate safeguards when facilitating data sharing and require all network participants to protect patient information according to HIPAA standards.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">6. HIPAA Compliance and Business Associate Role</h3>
              <p className="mb-2">As a platform serving healthcare providers, we function as a Business Associate under HIPAA regulations. We maintain appropriate physical, technical, and administrative safeguards to protect Protected Health Information (PHI) shared through our platform. We only facilitate the use and disclosure of PHI as permitted by HIPAA and as described in our Business Associate Agreements with clinics.</p>
              <p>Our platform includes specific features to support HIPAA compliance, including encrypted data transmission, role-based access controls, audit logging, and secure offline data handling.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">7. Data Security and Platform Features</h3>
              <p className="mb-2">We implement comprehensive security measures designed for resource-limited healthcare settings:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>End-to-end encryption for all data transmission and storage</li>
                <li>Secure offline functionality with encrypted local storage</li>
                <li>Role-based access controls for clinic staff and administrators</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Staff training on HIPAA compliance and data protection</li>
                <li>Automated backup and disaster recovery systems</li>
                <li>Multi-factor authentication for platform access</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">8. Health Equity and Accessibility</h3>
              <p className="mb-2">Our platform is designed with health equity principles, ensuring accessibility for underserved populations:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>SMS and voice-based interfaces for users with limited smartphone access</li>
                <li>Multilingual support and content at appropriate literacy levels</li>
                <li>Offline functionality for areas with unreliable internet connectivity</li>
                <li>Voice-assisted navigation and data input capabilities</li>
                <li>High-contrast and adjustable font size options</li>
                <li>Community health worker integration for patient outreach</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">9. Your Rights</h3>
              <p className="mb-2">Depending on your location and role (patient, clinic staff, or administrator), you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access and obtain a copy of your information stored on our platform</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information (subject to legal and medical record retention requirements)</li>
                <li>Restrict or object to certain processing activities</li>
                <li>Data portability (receiving your data in a structured, machine-readable format)</li>
                <li>Withdraw consent at any time (where processing is based on consent)</li>
                <li>Request information about which clinics have accessed your data</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided at the end of this policy.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">10. Data Retention</h3>
              <p>We retain information for as long as necessary to facilitate healthcare coordination, comply with medical record retention requirements, resolve disputes, and enforce our agreements. The specific retention period depends on the type of information, applicable legal requirements, and the needs of the clinic network. Patient health information is retained according to applicable medical record retention laws and clinic policies.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">11. Changes to This Privacy Policy</h3>
              <p>We may update this Privacy Policy to reflect changes in our platform features, legal requirements, or data practices. We will notify clinic administrators and users of any material changes through our platform and, where required by law, seek appropriate consent. Continued use of our platform after policy updates constitutes acceptance of the revised terms.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">12. Contact Us</h3>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:</p>
              <div className="mt-2">
                <p>Email: compliance@fourbic.com</p>
                <p>Phone: +254 737 008 815</p>
              </div>
              <p className="mt-2">For clinic-specific privacy concerns, you may also contact your primary clinic directly through our platform's secure messaging system.</p>
            </section>
          </div>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By using the Umzima Health platform, you acknowledge that you have read and understood this Privacy Policy and agree to the coordination of your healthcare information as described.
          </p>
          <div className="mt-4">
            <Link to="/terms" className="text-primary-dark hover:text-primary-bright mr-4">
              Terms & Conditions
            </Link>
            <Link to="/" className="text-primary-dark hover:text-primary-bright">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;