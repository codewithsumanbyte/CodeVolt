import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 selection:bg-primary/10 selection:text-primary">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-8 fade-in-5">
          <div className="border-b border-border pb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 20, 2025</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using CodeVolt ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. The Service is provided "as is" and intended for temporary, secure file sharing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                CodeVolt provides a platform for users to temporarily store and share text and files. All uploaded content is technically ephemeral and automatically deleted after 24 hours. We do not guarantee permanent storage of any data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Upload inconsistent, illegal, or malicious content (malware, viruses).</li>
                <li>Share copyrighted material without authorization.</li>
                <li>Upload content that depicts violence, illegal acts, or harassment.</li>
                <li>Attempt to reverse engineer or compromise the security of the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Privacy & Deletion</h2>
              <p className="text-muted-foreground leading-relaxed">
                We prioritize privacy. Files are encrypted and stored temporarily.
                <strong className="text-foreground"> All data is automatically and permanently deleted 24 hours after upload.</strong>
                Once deleted, data cannot be recovered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                CodeVolt shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of data, profits, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Contact us at <a href="mailto:support@codevolt.com" className="text-primary hover:underline">support@codevolt.com</a> if you have any questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}