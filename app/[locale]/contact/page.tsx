import type { Metadata } from "next";
import ContactForm from "@/components/ui/ContactForm";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = `Contact Us | ${SITE_NAME}`;
  const description = "Get in touch with Shëngjin Stay. Plan your coastal stay in Albania.";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${SITE_URL}/en/contact`,
        sq: `${SITE_URL}/sq/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/contact`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ContactPage() {
  return <ContactForm />;
}
