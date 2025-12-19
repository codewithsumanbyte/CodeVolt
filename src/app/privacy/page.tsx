import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
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
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: December 20, 2025</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We believe in data minimalism. We only collect:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                                <li>Files and text you voluntarily upload for sharing.</li>
                                <li>Basic access logs for security and debugging (IP address, user agent) which are rotated regularly.</li>
                                <li>We <strong>do not</strong> use cookies for tracking or advertising.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Your data is used solely to provide the file sharing service. We generate a unique code for your files, store them encrypted, and serve them to users who possess the correct code (and password, if applicable).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Data Retention & Deletion</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                This is a temporary storage service.
                                <strong className="text-foreground"> All user-uploaded content is legally and technically marked for deletion 24 hours after creation.</strong>
                                We run automated processes to ensure this data is permanently removed from our servers and databases.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We implement robust security measures:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                                <li>End-to-End encryption for file storage.</li>
                                <li>Secure HTTPS connection for all data transfer.</li>
                                <li>Password protection options for your shared files.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Third-Party Sharing</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not sell, trade, or upload your personal information to third parties. We handle your data with the utmost confidentiality.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                For privacy concerns, please contact our Data Protection Officer at <a href="mailto:privacy@codevolt.com" className="text-primary hover:underline">privacy@codevolt.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
