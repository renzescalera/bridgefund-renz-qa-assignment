# BridgeFund QA Automation Assignment by - Renz Escalera

- This is the QA Automation Assignment submission for the QA Engineer position in BridgeFund. The test automation framework is built using Playwright and TypeScript, following industry best practices to ensure scalability, maintainability, and efficiency.

## Technologies Used

- **Playwright**: A JavaScript/TypeScript-based framework used in this QA assignment.
- **TypeScript**: The primary programming language used in this test framework.

### Steps to setup and execute the test framework

1. Install Node.js (latest version from from nodejs.org)
2. Clone the repository:
   ```bash
   git clone https://github.com/renzescalera/bridgefund-renz-qa-assignment.git
   ```
3. Navigate to the project directory:
   ```bash
   cd bridgefund-renz-qa-assignment
   ```
4. Install the dependencies:
   ```bash
   npm install
   ```
5. Install Playwright:
   ```bash
   npx playwright install
   ```
6. Run the test:
   ```bash
   npx playwright install
   ```

## Test Framework Folder Structure

```plaintext
bridgefund-renz-qa-assignment/
├── .github/
│   └── workflows/       # Contains GitHub Actions workflows for CI/CD automation
├── page-objects/        # Implements the Page Object Model (POM) design pattern
├── test-data/           # Holds test data files for data-driven testing
├── tests/               # Contains test scripts, using Playwright
├── .gitignore           # Specifies intentionally untracked files to ignore
├── README.md            # An overview and instructions for the test framework
├── package-lock.json    # Automatically generated for locking dependencies
├── package.json         # Manages project dependencies and scripts
├── playwright.config.ts # Configuration file for Playwright settings
└── tsconfig.json        # Configures TypeScript compiler options

```

## Suggestions For Improvement

- As part of developing this test automation framework, I identified the following potential issues during test execution. These observations may require further validation, but addressing them could enhance the user experience and functionality.

1. Incorrect Number Separator in Annual Turnover Dropdown

- Problem: When the page language is set to English (EN), a period (.) is used as the number separator instead of a comma (,).
- Impact: This may cause inconsistencies in numerical formatting, especially for users expecting the correct English notation.
- Suggested Solution: Use a comma (,) as the number separator when the page language is set to English.
- Screenshot: https://imgur.com/a/kwofkWw

2. Loan Amount Field Accepts Non-Numeric Input

- Problem: The Loan Amount field allows users to enter non-numeric characters. When this happens:
  - The "Next" button remains enabled, allowing the user to proceed.
  - On the Contact page, the Loan Amount and What for? fields fail to retrieve the input values, causing a loading issue.
  - Upon going back to Amount page, the entered value is now a NaN
- Impact: Users may enter invalid data, leading to errors in the system and potential confusion.
- Suggested Solutions:
  - Prevent users from entering non-numeric values in the input field.
  - Alternatively, ensure the system properly handles non-numeric input and either validates or prevents navigation when invalid data type is detected.
- Screenshot: https://imgur.com/a/HiOWIne
