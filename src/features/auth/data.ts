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
      "Register with your email to shop faster and stay updated on offerings.",
    submit: "Create Account",
    switchPrompt: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
  },
} as const;
