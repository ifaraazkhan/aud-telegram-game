import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://ads.datplatform.com/web?aid=110000&nid=7&adx_click_macro=[CLICK_URL_ENC]&adx_custom=externalid:[externalid]";
    script.async = true;
    document.getElementById('adx_ad_110000').appendChild(script);
  }, []);

  return <div id="adx_ad_110000"></div>;
};

export default AdComponent;