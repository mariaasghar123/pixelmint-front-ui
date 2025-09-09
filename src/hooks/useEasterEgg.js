import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useEasterEgg = () => {
    const [easterEggActivated, setEasterEggActivated] = useState(false);
    const [easterEggCounter, setEasterEggCounter] = useState(0);

    const incrementEasterEggCounter = useCallback(() => {
        setEasterEggCounter(prev => {
            const newCount = prev + 1;
            if (newCount >= 7) {
                setEasterEggActivated(true);
                toast.success("🎉 Secret token unlocked!", {
                    position: "bottom-center",
                    autoClose: 3000
                });
                return 0;
            }
            return newCount;
        });
    }, []);

    return {
        easterEggActivated,
        incrementEasterEggCounter
    };
};
