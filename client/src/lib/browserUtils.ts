
import { useStore } from '@/store/useStore';

export const openLinkInBrowser = (url: string) => {
  // Ensure URL has protocol
  let formattedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = 'https://' + url;
  }
  
  useStore.getState().openBrowserWithUrl(formattedUrl);
};

// Hook version for use in React components
export const useOpenLink = () => {
  const openBrowserWithUrl = useStore((state) => state.openBrowserWithUrl);
  
  return (url: string) => {
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    openBrowserWithUrl(formattedUrl);
  };
};
