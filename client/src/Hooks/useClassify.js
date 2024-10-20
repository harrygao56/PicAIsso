import { useState, useEffect } from 'react';

function useClassify(message) {
    const [classification, setClassification] = useState(null);
    const [classificationLoading, setClassificationLoading] = useState(false);

    useEffect(() => {
        if (!message) return;

        const fetchClassification = async () => {
            setClassificationLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/classify?message=${encodeURIComponent(message)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                setClassification(data.classification);
            } catch (error) {
                console.error('Error fetching classification:', error);
            } finally {
                setClassificationLoading(false);
            }
        };

        fetchClassification();
    }, [message]);

    return { classification, classificationLoading };
}

export default useClassify;
