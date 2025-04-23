# Security Testing Report

## Table of Contents

- [Security Testing](#security-testing)
  - [Step-by-Step Process](#step-by-step-process)
- [Vulnerability Fixes](#vulnerability-fixes)
- [Testing Tools](#testing-tools)
- [Lessons Learned](#lessons-learned)
  - [What Worked Well](#what-worked-well)
  - [Challenges Faced](#challenges-faced)
  - [Areas for Improvement](#areas-for-improvement)
- [Ethical and Legal Considerations](#ethical-and-legal-considerations)

---

## Security Testing

### Step-by-Step Process

1. **Threat Modeling**

   - Created data flow diagrams using Visual Paradigm to identify potential threat entry points in the application architecture.
   - Focused on attack vectors like input fields, API endpoints, and authentication mechanisms.

2. **Manual Testing with Postman**

   - Sent various malformed and malicious requests (e.g., injection patterns, invalid JSON) to the backend to check validation and error handling.
   - Tested authentication and authorization by sending unauthorized requests to protected routes.

3. **Automated Vulnerability Scanning with OWASP ZAP**

   - Ran ZAP Passive Scan to analyze HTTP requests/responses and detect potential issues such as exposed data and missing server-side controls.
   - Used Active Scan to simulate attacks including input fuzzing, path traversal, and injection attempts.
   - Identified vulnerabilities such as weak input sanitization and unnecessary server responses.

4. **Post-Fix Verification**

   - Re-ran OWASP ZAP after applying code fixes to confirm that previously flagged issues were resolved.
   - Used Postman to re-test endpoints manually for verification.

5. **CI/CD Integration**
   - Configured GitHub Actions as part of the CI/CD pipeline.
   - It automatically updates both frontend and backend packages upon push or pull requests.
   - This helps reduce vulnerabilities by ensuring dependencies are kept up to date.

---

## Vulnerability Fixes

| Vulnerability            | Fix                                                                                                                                                                                                                                                                                                 | Validation Method                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Weak input validation    | Added stricter server-side checks for input fields, including type validation and length constraints                                                                                                                                                                                                | Retested with Postman using invalid payloads                                                                                   |
| Exposed error messages   | Replaced detailed error logs with generic messages for users, while keeping full logs on the server                                                                                                                                                                                                 | Verified with Postman and ZAP responses                                                                                        |
| Potential open endpoints | Restricted access to specific endpoints using authentication middleware                                                                                                                                                                                                                             | Attempted unauthorized access with Postman to confirm 403 responses                                                            |
| MongoDB Injection        | **Note:** I decided not to use `express-mongo-sanitize` or similar middleware because the current validation logic is already strict and blocks malicious inputs. If the application grows or becomes more complex in the future, I will consider adding additional sanitation layers as necessary. | Existing validators were tested with ZAP and Postman for potential injection attempts, all of which were blocked successfully. |
| Rate Limiting            | Implemented rate limiting on sensitive routes (e.g., login) to prevent brute force attacks                                                                                                                                                                                                          | Verified by sending rapid repeated requests and observing 429 Too Many Requests responses                                      |
| CSRF and XSS Prevention  | Used **access tokens** and **refresh tokens**: Access tokens are stored in memory; refresh tokens are stored in **HTTP-only**, **secure cookies**. This setup prevents token access via JavaScript (XSS) and helps guard against CSRF attacks.                                                      | Manually tested cookies and token handling through Postman and browser dev tools                                               |

---

## Testing Tools

| Tool            | Purpose                | Contribution                                                                                                                            |
| --------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Visual Paradigm | Threat Modeling        | Helped visualize app architecture, user flows, and possible threat entry points                                                         |
| OWASP ZAP       | Vulnerability Scanning | Automated security scanner used to detect common web vulnerabilities via passive and active scans                                       |
| Postman         | Manual API Testing     | Allowed detailed inspection and manipulation of HTTP requests for manual testing of input validation, authorization, and error handling |

---

## Lessons Learned

### What Worked Well

- OWASP ZAP provided thorough and actionable vulnerability reports with minimal setup.
- Visual Paradigm helped break down the system to better understand where risks might exist.
- Manual testing through Postman gave direct control to test edge cases and simulate real user misuse.
- The use of token-based authentication and rate limiting improved both security and user session management.
- GitHub Actions CI/CD pipeline helped maintain updated dependencies automatically, reducing the risk of outdated/vulnerable packages in both frontend and backend.

### Challenges Faced

- Tuning ZAP active scans to avoid overwhelming the development server was time-consuming.
- Initial input validation was too lenient, leading to false positives in security scans.
- Some vulnerability results needed manual interpretation to assess real risk.

### Areas for Improvement

- Introduce automated security testing into the CI/CD pipeline in future updates.
- Improve logging and alerting to catch unauthorized attempts in real time.
- Expand scope to test third-party packages and frontend vulnerabilities more deeply.

---

## Ethical and Legal Considerations

- **Data Privacy Compliance:** All data handled during testing was dummy data.
- **Testing Authorization:** All testing was performed on local environtment. No unauthorized scanning or injection was conducted against live services or third-party APIs.
- **Responsible Disclosure:** Any vulnerabilities identified were documented internally and resolved before deployment. Logs of all tests were kept for traceability and accountability.
- **Security Best Practices:** All security testing followed ethical guidelines and industry best practices, with consideration for non-destructive testing.
- **Regulatory Awareness:** While formal legal consultation was not conducted, general compliance with privacy-focused frameworks (e.g., GDPR principles) was considered throughout the development and testing lifecycle.
