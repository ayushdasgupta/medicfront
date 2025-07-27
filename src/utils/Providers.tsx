// src/context/Providers.tsx
import React, { ReactNode } from "react";
import { LanguageProvider } from "./LanguageContext";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeContext";
// import other providers here (e.g., AuthProvider, ThemeProvider)

interface ProvidersProps {
    children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <Toaster position='top-right' reverseOrder={false} />
            <ThemeProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </ThemeProvider>
        </Provider>

    );
};

export default Providers;
