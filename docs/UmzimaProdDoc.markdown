# Umzima v2 Product Documentation

## Introduction
Umzima v2 is a digital health platform designed to empower small clinics in creating a networked system for devolving primary healthcare. By facilitating secure information sharing, communication, and care coordination among clinics and between clinics and patients, Umzima v2 addresses critical gaps in resource-limited settings. Drawing from research on digital health equity, workflow efficiency, and nurses’ perspectives on digital communication, this platform prioritizes accessibility, continuity of care, operational efficiency, and health equity.

## Research Insights
The MVP specifications are informed by the following studies:

1. **"Digital Health as a Tool to Support Health Equity" by Memora Health**  
   - Emphasizes the digital divide and the need for equitable digital health solutions.  
   - Highlights four pillars of digital health equity: Digital Accessibility, Language and Literacy, Age and Engagement, and Racial Equity.  
   - Advocates for SMS-based solutions to reach 97% of the U.S. population with mobile phones, multilingual support, and content at a 7th/8th-grade reading level.

2. **"Primary Healthcare Nurses' Views on Digital Healthcare Communication and Continuity of Care" by MDPI**  
   - Explores nurses’ experiences with digital tools in primary care, identifying benefits (e.g., improved information access) and challenges (e.g., loss of interpersonal connection).  
   - Stresses the importance of interpersonal, information, and management continuity in care.  
   - Notes concerns about digital suitability for all patients, especially those with cognitive impairments or limited tech access.

3. **"Leveraging Digital Tools for Small Clinic Efficiency" (Hypothetical Research, 2025)**  
   - Highlights the need for offline functionality to support clinics with unreliable internet.  
   - Recommends automated task prioritization to reduce staff workload in understaffed settings.  
   - Suggests modular tools that allow clinics to adopt features incrementally based on budget.

4. **"Health Equity in Resource-Limited Primary Care" (Hypothetical Research, 2025)**  
   - Advocates for low-cost, scalable solutions tailored to underserved populations.  
   - Emphasizes community health worker (CHW) integration to bridge gaps in patient outreach.  
   - Recommends voice-assisted interfaces to support low-literacy users.

## MVP Specifications

### Core Objectives
- **Health Equity**: Ensure inclusivity for underserved populations (e.g., older adults, non-English speakers, low-income individuals) by addressing the four pillars of digital health equity, with added voice-assisted options.
- **Continuity of Care**: Support seamless care transitions and coordination across clinics, maintaining interpersonal, information, and management continuities.
- **Scalability and Efficiency**: Provide a cost-effective, easy-to-adopt solution with offline capabilities and automated workflows for small clinics with limited resources.

### Functional Requirements
The MVP features are customized based on the research insights:

#### 1. Clinic and User Management
- **Purpose**: Enable clinics to join the network and manage staff efficiently.
- **Features**:
  - Clinic registration with profile setup.
  - Staff account creation with role-based access (e.g., nurse, doctor, admin).
  - Training resources tailored to varying digital literacy levels, including voice-guided tutorials.
- **Equity Focus**: Simple onboarding with voice-assisted setup to reduce barriers for resource-limited clinics.

#### 2. Patient Management
- **Purpose**: Allow providers to manage patient records securely and equitably.
- **Features**:
  - Add/edit patient records (demographics, medical history, treatment plans) with offline sync.
  - Multilingual record support (e.g., Spanish) and voice input for low-literacy users.
  - Community health worker (CHW) module for patient outreach in underserved areas.
- **Equity Focus**: Accessible via SMS and offline modes to patients with limited internet access.

#### 3. Referral System
- **Purpose**: Facilitate patient referrals between networked clinics.
- **Features**:
  - Create/send referrals with attached patient data, syncable offline.
  - Track referral status (sent, received, accepted).
  - Secure data sharing with encryption.
- **Continuity Focus**: Ensures information continuity across clinics with offline support.

#### 4. Communication Tools
- **Purpose**: Enable secure, efficient communication among providers and with patients.
- **Features**:
  - Inter-clinic messaging with offline queueing.
  - Patient-provider SMS messaging and voice call options for interpersonal continuity.
  - Automated task prioritization for follow-ups based on urgency.
- **Equity Focus**: SMS and voice ensure access for 97% of mobile users, including low-literacy populations.

#### 5. Patient Portal
- **Purpose**: Empower patients to engage with their care.
- **Features**:
  - View medical records and appointments with offline caching.
  - Send/receive messages with providers via SMS or voice response.
  - SMS notifications and voice-assisted navigation for non-smartphone users.
  - Accessibility options (e.g., high-contrast, adjustable font sizes).
- **Equity Focus**: Content at 7th/8th-grade reading level, with voice support.

### Non-Functional Requirements
- **Usability**: Intuitive interface with voice assistance for users with varying digital literacy.
- **Reliability**: 99.9% uptime for SMS and core functions, with offline mode resilience.
- **Security**: HIPAA-compliant encryption and role-based access control.
- **Scalability**: Support 50-500 patients per clinic initially, with modular feature adoption.

## Core User Flow (Ishikawa Framework)
The Ishikawa Diagram distills the core user flow by analyzing key factors influencing clinic operations:

### Categories and User Flow
1. **People**
   - **Users**: Nurses, doctors, patients, administrators, CHWs.
   - **Flow**:
     - Nurse logs in (voice-assisted), views patient list offline.
     - Patient receives SMS/voice reminder to register/access portal.
   - **Factors**: Staff training, patient digital literacy, CHW integration.

2. **Processes**
   - **Flow**:
     1. Clinic registers and sets up staff accounts (voice-guided).
     2. Nurse adds patient data offline, syncs later.
     3. Nurse creates referral, shares data with offline queueing.
     4. Receiving clinic accepts referral, accesses data.
     5. Patient views records/messages provider via portal/SMS/voice.
   - **Factors**: Referral protocols, automated task prioritization.

3. **Technology**
   - **Flow Enablement**: Web-based platform with SMS fallback, offline sync, voice interfaces.
   - **Factors**: Usability, offline resilience, low-bandwidth optimization.

4. **Environment**
   - **Flow Adaptation**: Works in low-bandwidth settings, supports multilingual voice prompts.
   - **Factors**: Rural connectivity, cultural diversity.

5. **Management**
   - **Flow Oversight**: Admins monitor usage, ensure compliance, prioritize tasks.
   - **Factors**: Clinic leadership support, equity metrics tracking.

### Distilled Core User Flow
1. **Clinic Onboarding**: Clinic joins network, sets up profiles/accounts with voice assistance.
2. **Patient Registration**: Nurse adds patient data offline, syncs when online.
3. **Care Coordination**: Nurse refers patient, shares data with offline support.
4. **Communication**: Providers collaborate, patient engages via portal/SMS/voice.
5. **Monitoring**: Admins review usage and equity outcomes with automated reports.

## Customization of Dashboards and Pages

### Provider Dashboard
- **Purpose**: Central hub for clinic staff to manage patients and tasks.
- **Components**:
  - **Patient List**: Filterable by name/status, with new message indicators, offline viewable.
  - **Referrals**: Incoming/outgoing referral statuses, syncable offline.
  - **Messages**: Inbox for inter-clinic and patient communication, voice-enabled.
  - **Quick Actions**: Add patient, create referral, with voice input.
- **Design Notes**: Intuitive layout, minimal training, voice-guided navigation.

### Patient Portal Dashboard
- **Purpose**: Accessible interface for patients to engage with care.
- **Components**:
  - **Health Summary**: Medical history, current treatments, offline cacheable.
  - **Appointments**: Upcoming visits with SMS/voice reminders.
  - **Messages**: Threaded communication with providers, voice response option.
- **Design Notes**: Multilingual, high-contrast, voice-assisted options.

### Additional Pages
- **Referral Management**: Detailed view of referral history and status, offline accessible.
- **Patient Profile**: Comprehensive record with editable fields, voice input support.
- **Settings**: Clinic/user preferences, accessibility adjustments, offline mode toggle.

## Next Steps
- Conduct pilot testing with small clinics, focusing on offline usability.
- Iterate based on feedback to refine usability, equity, and efficiency features.