export const authCopy = {
  login: {
    eyebrow: "Welcome Back",
    title: "Sign in to SOLV",
    description: "Access your account to track orders and manage your details.",
    submit: "Sign In",
    switchPrompt: "Don't have an account?",
    switchLabel: "Create one",
    switchHref: "/register",
  },
  register: {
    eyebrow: "Join Solv",
    title: "Create your account",
    description:
      "Register with your email. We’ll send a code to verify and open your account.",
    submit: "Create Account",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
  },
  verify: {
    eyebrow: "Verify email",
    title: "Enter your code",
    description:
      "We sent a 6-digit code to your email. Enter it below to open your account.",
    submit: "Verify and continue",
  },
} as const;
