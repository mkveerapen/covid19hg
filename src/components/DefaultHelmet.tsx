import React from "react";
import { Helmet } from "react-helmet";

interface Props {
  title: string;
  description: string;
  siteTitle: string;
  siteUrl: string;
}
const DefaultHelmet = ({ title, description, siteTitle, siteUrl }: Props) => (
  <Helmet>
    <html lang="en" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="theme-color" content="#fff" />

    <meta property="og:type" content="business.business" />
    <meta property="og:title" content={siteTitle} />
    <meta property="og:url" content="/" />
    <meta property="og:image" content={`${siteUrl}/img/header-4.png`} />
    <meta property="twitter:card" content="summary_large_image" />
    <meta
      property="twitter:image"
      content={`${siteUrl}/img/twitter-summary-large.png`}
    />
    <meta
      property="twitter:title"
      content="COVID-19 Host Genetics Initiative"
    />
    <meta
      property="twitter:description"
      content="The COVID-19 host genetics initiative aims to provide support and an analytical network for studies that are broadly interested in identifying genetic determinants of COVID-19 susceptibility and severity. Such discoveries could help to generate hypotheses for drug repurposing, identify individuals at unusually high or low risk, and contribute to global knowledge of the biology of SARS-CoV-2 infection and disease."
    />
  </Helmet>
);

export default DefaultHelmet;
