document.addEventListener('DOMContentLoaded', function () {
    const navButtons = document.querySelectorAll('.nav-btn');
    const percentageLine = document.getElementById('percentageLine');
    const percentageMarker = document.getElementById('percentageMarker');
    const percentageDisplay = document.getElementById('percentageDisplay');
    const ageLine = document.getElementById('ageLine');
    const ageMarker = document.getElementById('ageMarker');
    const ageDisplay = document.getElementById('ageDisplay');

    let isDraggingPercentage = false;
    let isDraggingAge = false;

    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove the 'active' class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));

            // Add the 'active' class to the clicked button
            this.classList.add('active');
        });
    });

    const topNav = document.getElementById('topNav');
    const mobileNav = document.getElementById('mobileNav');

    // Function to handle showing/hiding navigation based on window size
    function handleWindowSize() {
        if (window.innerWidth <= 767) {
            topNav.style.display = 'flex';
            mobileNav.style.display = 'flex';
        } else {
            topNav.style.display = 'none';
            mobileNav.style.display = 'none';
        }
    }

    // Call the function on page load
    handleWindowSize();

    // Add window resize event listener
    window.addEventListener('resize', function () {
        handleWindowSize();
    });

    // Get a reference to the boxb element
    const boxB = document.getElementById('boxb');

    // Handle scrolling to hide both top and mobile navigation when reaching boxb
    window.addEventListener('scroll', function () {
        const windowHeight = window.innerHeight;
        const boxBRect = boxB.getBoundingClientRect();

        // Check if boxb is in the viewport
        if (
            boxBRect.top <= windowHeight &&
            boxBRect.bottom >= 0 &&
            boxBRect.left <= window.innerWidth &&
            boxBRect.right >= 0
        ) {
            topNav.style.display = 'none';
            mobileNav.style.display = 'none';
        } else {
            topNav.style.display = 'flex';
            mobileNav.style.display = 'flex';
        }
    });
    

    function addEventListenersForDragging(marker, handleMove, updateFunction) {
        marker.addEventListener('mousedown', handleMouseDown);
        marker.addEventListener('touchstart', handleTouchStart);
    
        function handleMouseDown(event) {
            isDraggingPercentage = false;
            isDraggingAge = false;
            updateFunction(event.clientX);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    
        function handleMouseUp() {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    
        function handleTouchStart(event) {
            isDraggingPercentage = false;
            isDraggingAge = false;
            const touch = event.touches[0];
            updateFunction(touch.clientX);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        }
    
        function handleTouchMove(event) {
            const touch = event.touches[0];
            updateFunction(touch.clientX);
        }
    
        function handleTouchEnd() {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }
    }
    
    addEventListenersForDragging(
        percentageMarker,
        handlePercentageMouseMove,
        updatePercentage
    );
    addEventListenersForDragging(ageMarker, handleAgeMouseMove, updateAge);
    
    function handlePercentageMouseMove(event) {
        updatePercentage(event.clientX);
    }
    
    function handleAgeMouseMove(event) {
        updateAge(event.clientX);
    }
    
    function updatePercentage(x) {
        const lineRect = percentageLine.getBoundingClientRect();
        const percentage = Math.min(100, Math.max(0, ((x - lineRect.left) / lineRect.width) * 100));
        percentageMarker.style.left = `${percentage}%`;
        const color = `rgba(70, 51, 245, ${percentage / 100})`; // Transparent green
        percentageLine.style.background = `linear-gradient(to right, ${color} ${percentage}%, #fff ${percentage}%)`;
        percentageDisplay.textContent = `${Math.round(percentage)}%`;
    }
    
    function updateAge(x) {
        const lineRect = ageLine.getBoundingClientRect();
        const selectedAgePercentage = Math.min(100, Math.max(0, ((x - lineRect.left) / lineRect.width) * 100));
    
        ageMarker.style.left = `${selectedAgePercentage}%`;
    
        const selectedAge = Math.round((selectedAgePercentage / 100) * 45) + 20; // Range: 20 to 65
        const color = `rgba(70, 51, 245, ${(selectedAge - 20) / 45})`; // Transparent green
        ageLine.style.background = `linear-gradient(to right, ${color} ${selectedAgePercentage}%, #efefef ${selectedAgePercentage}%)`;
        ageDisplay.textContent = `${selectedAge}`;
    }

    // Graph
    // Dummy data
    var monthlyIncome = [100, 150, 200, 250];
    var age = [20, 25, 30, 35, 40, 60, 65];
    var employer = [30, 50, 80, 100, 120, 150, 200];
    var employee = [30, 50, 60, 80, 90, 100, 120];
    var totalInterest = [30, 40, 60, 80, 90, 100, 110];

    // Get the chart canvas element
    var ctx = document.getElementById('contributionChart').getContext('2d');

    // Create a stacked bar chart
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: age.map(String),
            datasets: [
                {
                    label: 'Employer: K 73,500',
                    data: employer,
                    backgroundColor: '#0800A3',
                    borderWidth: 0,
                    barPercentage: 0.5,
                    stack: 'Stack 0'
                },
                {
                    label: 'Employee: K 73,500',
                    data: employee,
                    backgroundColor: '#4834fc',
                    borderWidth: 0,
                    barPercentage: 0.5,
                    stack: 'Stack 0'
                },
                {
                    label: 'Total Interest: K 73,500',
                    data: totalInterest,
                    backgroundColor: '#85AFFF',
                    borderWidth: 0,
                    barPercentage: 0.5,
                    stack: 'Stack 0'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                    },
                    suggestedMin: 0,
                    suggestedMax: 300,
                    ticks: {
                        callback: function (value, index, values) {
                            return '$' + value; // Add dollar sign to the tick labels
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            // Add legend to display labels for employee, employer, and total interest
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true, // Use a custom point style for legend items
                    }
                },
            },
            // Enable stacking for bars
            interaction: {
                intersect: false,
                mode: 'index',
            },
            stacked: true,
        }
    });
});
