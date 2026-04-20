/**
 * CMSPageWrapper — wraps a page component with CMS content + global content
 * Makes content('key') and global('key') available via render props
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePageContent from '../hooks/usePageContent';
import { useGlobalContent } from '../hooks/useGlobalContent';

export default function CMSPageWrapper({ slug, children }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  const { content, loaded: pageLoaded } = usePageContent(slug, lang);
  const { global: gContent, loaded: globalLoaded } = useGlobalContent(lang);

  return children({ content, gContent, lang, ready: pageLoaded && globalLoaded });
}
