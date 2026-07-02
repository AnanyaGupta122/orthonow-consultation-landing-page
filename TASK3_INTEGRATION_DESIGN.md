# Integration Design & Architecture

## 1. Integration Architecture
The system utilizes a modern, decoupled architecture connecting the frontend to marketing, CRM, and communication platforms:
* **Landing Page:** Captures user information through the consultation form.
* **GTM & GA4:** Google Tag Manager captures frontend events (`consultation_form_success`) and pushes them to Google Analytics 4 for reporting.
* **Google Ads:** GA4 primary conversion events are synced to Google Ads for Smart Bidding optimization.
* **Backend API:** Acts as the central orchestrator. It receives form data securely from the landing page.
* **HubSpot CRM:** Stores patient lead data. The Backend API interfaces with HubSpot via its REST API.
* **Karix WhatsApp API:** Sends automated confirmation messages. The Backend API triggers this upon successful CRM entry.

## 2. Data Flow
When a user submits the consultation form:
1. The frontend validates the input and sends a POST request to the Backend API.
2. The frontend simultaneously pushes the `consultation_form_success` event to the GTM dataLayer.
3. The Backend API validates the payload and checks for existing records (deduplication).
4. The Backend API creates or updates a Contact record in HubSpot CRM.
5. Upon CRM success, the Backend API triggers the Karix API to send a WhatsApp confirmation message.
6. The Backend API returns a success response to the frontend, which displays a "Thank You" message.

## 3. Failure Point
The **biggest technical failure point** is the synchronous dependency on external APIs (HubSpot or Karix) during the form submission. If the Karix API times out or HubSpot is undergoing maintenance, the backend might fail to process the lead, causing the frontend to hang or display an error, leading to a poor user experience and lost conversion data.

## 4. Fallback Strategy
To ensure system resilience:
* **Asynchronous Processing:** Implement a message queue (e.g., RabbitMQ, AWS SQS). The Backend API should immediately acknowledge the frontend submission and safely save the lead to a local database.
* **Retry Mechanism:** Queue workers will handle HubSpot and Karix API calls. If either service is unavailable, the system will apply exponential backoff retries.
* **Dead Letter Queue (DLQ):** Messages that fail repeatedly are moved to a DLQ for manual intervention by the operations team.

## 5. Monitoring & SLA
To monitor the 2-minute callback SLA:
* **Timestamp Tracking:** Record `Lead_Created_At` and `First_Call_Attempted_At` custom properties in HubSpot.
* **Automated Alerting:** Create a HubSpot workflow or use a monitoring tool (e.g., Datadog) to trigger a Slack or email escalation alert to the sales manager if a lead sits in the "New" stage for more than 90 seconds without a call attempt logged.

## 6. Phone Number Deduplication
Before creating a new record in HubSpot:
* Normalize all phone numbers to the standard E.164 format (e.g., +1234567890).
* The Backend API must query HubSpot for an existing contact using the normalized phone number.
* If a match is found, the API should *update* the existing contact (e.g., appending a note or timeline event about the new consultation inquiry) rather than creating a duplicate entry.
* If no match is found, a completely new contact record is created.
