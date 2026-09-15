"use client";
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GTM_ID } from '@/app/lib/constants';
import { isPublicAnalyticsHost, trackFunnel } from '@/app/lib/funnel';

export default function GtmSnippet() {
  const [enabled,setEnabled] = useState(false);
  const pathname = usePathname();
  const lastView = useRef('');
  useEffect(()=>{
    const allowed=isPublicAnalyticsHost(window.location.hostname);
    setEnabled(allowed);
    if(allowed && lastView.current!==pathname) {
      lastView.current=pathname;
      if(pathname==='/catalogo')trackFunnel('vlt_catalog_view');
      if(pathname==='/atendimento')trackFunnel('vlt_form_view');
    }
  },[pathname]);
  if(!enabled)return null;
  return <Script id="gtm-script" strategy="afterInteractive" dangerouslySetInnerHTML={{__html:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}}/>;
}
