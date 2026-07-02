# GTM Event Schema and Tracking Plan

## 1. GTM Event Schema Table

| Event Name | Trigger | Parameters | Business Purpose | GA4 Reporting / Audience Use |
| :--- | :--- | :--- | :--- | :--- |
| `page_view` | Fires on all pages when the page loads (Container Loaded or DOM Ready). | `page_url`, `page_title`, `traffic_source` | Track overall traffic to the landing page and measure campaign volume. | Standard page reporting; create baseline audiences for retargeting. |
| `consultation_form_start` | User focuses on the first input field of the consultation form. | `form_id`, `form_name`, `page_location` | Measure initial intent and interest in booking a consultation. | Analyze top-of-funnel conversion rate; build audiences that abandon forms. |
| `consultation_form_submit` | User clicks the "Submit" or "Book Consultation" button. | `form_id`, `form_name`, `button_text` | Track attempts to submit the form (including errors or validation failures). | Measure form interaction rate; troubleshoot form validation issues. |
| `consultation_form_success` | Form is successfully submitted without errors (e.g., successful AJAX response or thank you message display). | `form_id`, `lead_type`, `service_interest` | Track actual generation of a lead or consultation request. | Track primary conversions; create highly qualified audiences for exclusions or lookalikes. |
| `call_now_click` | User clicks on a phone number link (`tel:` protocol) or "Call Now" button. | `link_url`, `button_name`, `page_location` | Measure direct intent to contact via phone, bypassing the form. | Track secondary conversions; measure inbound call intent from the landing page. |
| `scroll_depth` | User scrolls vertically down the page (e.g., 25%, 50%, 75%, 90%). | `percent_scrolled`, `page_title`, `scroll_direction` | Measure how much of the landing page content is consumed by users. | Analyze content engagement; create audiences of highly engaged users (e.g., >75% scroll). |
| `page_engagement` | User spends a minimum amount of time on the page or actively interacts (e.g., 10 seconds of active time). | `engagement_time_msec`, `session_id`, `page_url` | Differentiate between bounces and users who actually read the page. | Improve bounce rate metrics (GA4 engagement rate); identify high-quality traffic sources. |

## 2. Booking Funnel Overview

The consultation booking process can be tracked as a linear funnel to identify drop-off points:

* **Step 1: Landing Page Viewed**
  * Event: `page_view`
  * Description: User arrives on the OrthoNow landing page.
* **Step 2: Consultation Form Started**
  * Event: `consultation_form_start`
  * Description: User interacts with the form fields, indicating intent.
* **Step 3: Consultation Successfully Submitted**
  * Event: `consultation_form_success`
  * Description: User successfully completes the booking process and generates a lead.

## 3. Example `dataLayer.push()` Implementations

Below are example JSON objects for pushing these events to the dataLayer with realistic values for the OrthoNow landing page.

### `page_view`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'page_view',
  page_title: 'OrthoNow Consultation - Expert Orthopedic Care',
  page_url: 'https://www.orthonow.com/consultation',
  traffic_source: 'google_ads_search'
});
```

### `consultation_form_start`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'consultation_form_start',
  form_id: 'consultation_request_v1',
  form_name: 'Hero Section Booking Form',
  page_location: '/consultation'
});
```

### `consultation_form_submit`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'consultation_form_submit',
  form_id: 'consultation_request_v1',
  form_name: 'Hero Section Booking Form',
  button_text: 'Book Free Consultation'
});
```

### `consultation_form_success`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'consultation_form_success',
  form_id: 'consultation_request_v1',
  lead_type: 'new_patient_inquiry',
  service_interest: 'knee_pain_consultation'
});
```

### `call_now_click`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'call_now_click',
  link_url: 'tel:+18005550199',
  button_name: 'Header Call Button',
  page_location: '/consultation'
});
```

### `scroll_depth`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'scroll_depth',
  percent_scrolled: 50,
  page_title: 'OrthoNow Consultation - Expert Orthopedic Care',
  scroll_direction: 'vertical'
});
```

### `page_engagement`
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'page_engagement',
  engagement_time_msec: 15000,
  session_id: 'sess_987654321',
  page_url: 'https://www.orthonow.com/consultation'
});
```

## 4. GA4 and Google Ads Strategy

### How These Events Are Used in GA4
These events will form the foundation of our GA4 reporting. Standard events like `page_view`, `scroll_depth`, and `page_engagement` will automatically populate engagement metrics and reports. Custom events like the `consultation_form_*` series will be marked as custom dimensions and metrics where appropriate, allowing us to build Custom Explorations to analyze user behavior, traffic quality, and conversion paths in detail. We will also use these events to build specific retargeting audiences (e.g., users who triggered `consultation_form_start` but not `consultation_form_success`).

### Primary Google Ads Conversion
The **`consultation_form_success`** event should be marked as the primary Google Ads conversion. This event represents a fully qualified lead that has completed the required action on the landing page, providing the strongest signal to Google Ads Smart Bidding algorithms to optimize for actual business value. The `call_now_click` event can optionally be set up as a secondary conversion if inbound phone calls are highly valued.

### Measuring Landing Page Performance with the Funnel
The Booking Funnel defined above allows us to measure exactly where users are dropping off on the landing page. By comparing the volume of `page_view`, `consultation_form_start`, and `consultation_form_success` events, we can identify bottlenecks:
* **Step 1 to Step 2 Drop-off:** Indicates that the page content isn't persuasive enough to drive initial intent, or the form is hard to find.
* **Step 2 to Step 3 Drop-off:** Indicates form friction (e.g., too many fields, confusing validation errors, or loss of trust).
This funnel data directly informs A/B testing and Conversion Rate Optimization (CRO) efforts for the landing page.
