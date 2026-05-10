import React, { createContext, useContext, useState, useCallback } from 'react';

export interface PageContext {
  pageName: string;
  pageType: 'material-detail' | 'marketplace' | 'create-listing' | 'dashboard' | 'supply-chain' | 'general';
  title?: string;
  details?: string;
  quickActions?: string[];
}

interface ChatContextType {
  pageContext: PageContext;
  setPageContext: (ctx: PageContext) => void;
  resetContext: () => void;
}

const defaultContext: PageContext = {
  pageName: 'Home',
  pageType: 'general',
  title: undefined,
  details: undefined,
  quickActions: undefined,
};

const ChatContext = createContext<ChatContextType>({
  pageContext: defaultContext,
  setPageContext: () => {},
  resetContext: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageContext, setPageContextState] = useState<PageContext>(defaultContext);

  const setPageContext = useCallback((ctx: PageContext) => {
    setPageContextState(ctx);
  }, []);

  const resetContext = useCallback(() => {
    setPageContextState(defaultContext);
  }, []);

  return (
    <ChatContext.Provider value={{ pageContext, setPageContext, resetContext }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
