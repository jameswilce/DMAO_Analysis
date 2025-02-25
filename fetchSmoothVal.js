async function fetchSmoothVal() {
    try {
        const response = await fetch('../../dmao.json'); // Adjust the path as necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const smoothVal = data.drawingLog.smoothVal; // Adjust based on the actual structure
        console.log('Smooth Value:', smoothVal);
    } catch (error) {
        console.error('Error fetching smoothVal:', error);
    }
}

fetchSmoothVal();