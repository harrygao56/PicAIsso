import { useState, useEffect } from 'react';

function useClassify(message) {
    const [classification, setClassification] = useState(null);
    const [classificationLoading, setClassificationLoading] = useState(false);

    useEffect(() => {
        if (!message) return;

        const fetchClassification = async () => {
            setClassificationLoading(true);
            try {
                const response = await fetch('YOUR_ENDPOINT_URL', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
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

