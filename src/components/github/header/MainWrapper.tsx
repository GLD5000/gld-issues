'use client';

import { useStore } from '@/zustand/zustand';
import React, { ReactNode, useEffect } from 'react';

export default function MainWrapper({ children }: { children: ReactNode }) {
    function handleResize() {
        useStore.setState({ screenWidth: window.innerWidth || 0 });
    }
    useEffect(() => {
        let run = true;
        if (run) {
            useStore.setState({
                hash: window.location.hash || '',
                screenWidth: window.innerWidth || 0,
            });
            window.addEventListener('resize', handleResize);
        }

        return () => {
            run = false;
        };
    }, []);
    return (
        <main
            id="main"
            className={`relative flex flex-col gap-8 min-w-[280px] min-h-screen font-Avenir-heavy pt-20 pb-[50vh]`}
        >
            {children}
        </main>
    );
}
