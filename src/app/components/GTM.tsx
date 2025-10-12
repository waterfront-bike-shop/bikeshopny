"use client";

import Script from "next/script";

export default function GTM() {
  return (
    <>
      {/* GTM head script */}
      <Script id="gtm-head" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
            j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MV33TJD8');
        `}
      </Script>

      {/* GTM noscript - must be rendered as plain HTML */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MV33TJD8"
                height="0" width="0" style="display:none;visibility:hidden">
              </iframe>
            </noscript>
          `,
        }}
      />
    </>
  );
}
