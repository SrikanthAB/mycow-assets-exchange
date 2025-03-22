
// Pre-defined support question options
export const SUPPORT_QUESTIONS = [
  { id: "login", text: "I'm having trouble logging in" },
  { id: "deposit", text: "How do I deposit funds?" },
  { id: "withdraw", text: "I need help with a withdrawal" },
  { id: "investment", text: "Questions about investment options" },
  { id: "returns", text: "Understanding my returns and performance" }
];

// Follow-up options based on initial question
export const FOLLOW_UP_OPTIONS = {
  login: [
    { id: "forgot_password", text: "I forgot my password" },
    { id: "account_locked", text: "My account is locked" },
    { id: "verification", text: "I can't complete verification" }
  ],
  deposit: [
    { id: "deposit_methods", text: "What deposit methods are available?" },
    { id: "deposit_limit", text: "What are the deposit limits?" },
    { id: "processing_time", text: "How long do deposits take to process?" }
  ],
  withdraw: [
    { id: "withdrawal_methods", text: "What withdrawal methods are available?" },
    { id: "withdrawal_limit", text: "What are the withdrawal limits?" },
    { id: "withdrawal_time", text: "How long do withdrawals take to process?" }
  ],
  investment: [
    { id: "investment_options", text: "What investment options are available?" },
    { id: "min_investment", text: "What's the minimum investment amount?" },
    { id: "risk_levels", text: "How are risk levels determined?" }
  ],
  returns: [
    { id: "performance_calc", text: "How is performance calculated?" },
    { id: "tax_reporting", text: "How does tax reporting work?" },
    { id: "expected_returns", text: "What returns can I expect?" }
  ]
};
