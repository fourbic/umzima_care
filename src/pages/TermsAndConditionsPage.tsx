import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

const TermsAndConditionsPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms & Conditions</h1>
          <Link to="/" className="text-primary-dark hover:text-primary-bright">
            Return to Dashboard
          </Link>
        </div>
        
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Umzima Health Terms and Conditions</h2>
          <p className="text-sm text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-medium mb-3">1. Acceptance of Terms</h3>
              <p>By accessing or using Umzima Health's platform and services ("Services"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Services.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">2. Description of Services</h3>
              <p className="mb-2">Umzima Health provides a digital healthcare platform designed for small clinics to manage primary healthcare operations, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Patient registration and management</li>
                <li>Appointment scheduling</li>
                <li>Medical record keeping</li>
                <li>Healthcare provider coordination</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">3. User Accounts and Responsibilities</h3>
              <p className="mb-2">When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Restricting access to your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use or security breach</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">4. Healthcare Provider Obligations</h3>
              <p className="mb-2">If you are a healthcare provider using our Services, you acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You are solely responsible for the healthcare services you provide</li>
                <li>You will comply with all applicable laws, regulations, and professional standards</li>
                <li>You will maintain appropriate professional licenses and credentials</li>
                <li>You will obtain informed consent from patients as required by law</li>
                <li>You will maintain accurate and complete medical records</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">5. Privacy and Data Protection</h3>
              <p className="mb-2">We are committed to protecting your privacy and maintaining the confidentiality of your personal and health information. Our collection, use, and disclosure of your information are governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
              <p>We comply with applicable data protection laws, including GDPR and HIPAA, and implement appropriate technical and organizational measures to protect your information.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">6. Intellectual Property Rights</h3>
              <p className="mb-2">All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Umzima Health or our licensors and are protected by copyright, trademark, and other intellectual property laws.</p>
              <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Services without our prior written consent.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">7. Limitations of Liability</h3>
              <p className="mb-2">To the fullest extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Our Services are provided "as is" and "as available" without any warranties of any kind</li>
                <li>We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services</li>
                <li>Our total liability for any claims arising from these Terms or your use of our Services shall not exceed the amount you paid to us for the Services in the 12 months preceding the claim</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">8. Indemnification</h3>
              <p>You agree to indemnify, defend, and hold harmless Umzima Health and our affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of our Services, your violation of these Terms, or your violation of any rights of a third party.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">9. Termination</h3>
              <p>We may terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms. Upon termination, your right to use our Services will immediately cease.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">10. Governing Law and Dispute Resolution</h3>
              <p className="mb-2">These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles.</p>
              <p>Any dispute arising from or relating to these Terms or your use of our Services shall be resolved through:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Informal negotiation: We will attempt to resolve any disputes informally by contacting you.</li>
                <li>Mediation: If the dispute cannot be resolved through negotiation, either party may initiate mediation conducted by a mutually agreed-upon mediator.</li>
                <li>Arbitration: If the dispute is not resolved through mediation, it shall be resolved through binding arbitration conducted in accordance with the laws in Kenya.</li>
              </ol>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">11. Changes to Terms</h3>
              <p>We may revise these Terms from time to time. The most current version will always be posted on our platform. By continuing to use our Services after any changes, you accept and agree to the revised Terms.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-medium mb-3">12. Contact Information</h3>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <div className="mt-2">
                <p>Email: compliance@fourbic.com</p>
                <p>Phone: +254 737 008 815</p>
              </div>
            </section>
          </div>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By using Umzima Health services, you acknowledge that you have read and understood these Terms and Conditions.
          </p>
          <div className="mt-4">
            <Link to="/privacy-policy" className="text-primary-dark hover:text-primary-bright mr-4">
              Privacy Policy
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

export default TermsAndConditionsPage;