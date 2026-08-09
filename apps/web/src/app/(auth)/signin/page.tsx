import { AuthShell } from '@/components/auth/AuthShell';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to Voeq"
      subtitle="Connect with verified campus vendors, browse listings, and chat directly on WhatsApp."
    >
      <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
        <SignInForm />
      </div>
    </AuthShell>
  );
}
