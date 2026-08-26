import Script from "next/script";

const GOOGLE_SITE_VERIFICATION = "l9XUsqBACTgrpUwkQktZdRxd77IsXPD9KglwHACa3UY";

export function Analytics() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  if (!ga4Id) {
    return null;
  }

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');
        `}
      </Script>
    </>
  );
}

export function getGoogleSiteVerification(): string {
  return process.env.NEXT_PUBLIC_SITE_VERIFICATION_GOOGLE || GOOGLE_SITE_VERIFICATION;
}
