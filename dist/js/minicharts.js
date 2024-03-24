function loadThreads(data) {
    let threads = [];
    data.filter(item => item.Status.toLowerCase().trim() !== 'archived').forEach(item => {
        let delayClass = getDelay(item.LastUpdated);
        let thread = {
            status: item.Status ? item.Status.toLowerCase().trim() : '',
            delay: delayClass,
        }
        threads = [...threads, thread];
    });

    return threads;
}

function loadCharts(threads, selector) {
    let statusChart = new ApexCharts(document.querySelector(`${selector} .chart--status`), configStatus(threads));
    statusChart.render();

    window.addEventListener('resize', () => {
        let statusChart = new ApexCharts(document.querySelector(`${selector} .chart--status`), configStatus(threads));
        statusChart.render();
    });
}
function configStatus(threads) {
    let owing = threads.filter(thread => thread.status === 'mine' || thread.status === 'start').length;
    let active = threads.filter(thread => thread.status === 'theirs').length;
    let hoarded = threads.filter(thread => thread.status === 'hoarded').length;
    let complete = threads.filter(thread => thread.status === 'complete').length;
    let statusConfig = {
        series: [owing, hoarded, active, complete],
        labels: ['Mine', 'Hoarded', 'Theirs', 'Completed'],
        colors: ['rgba(162, 129, 119, 1)', 'rgb(174, 176, 121)', 'rgba(125, 159, 129, 1)', 'rgb(141, 165, 176)'],
        chart: {
            type: 'donut',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '50%',
                }
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return w.config.series[seriesIndex]
            },
            style: {
                fontSize: '20px',
                fontFamily: 'var(--font-accent)',
                fontWeight: '400'
            },
            dropShadow: {
                enabled: false,
            }
        }, 
        legend: {
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            markers: {
                width: '10px',
                height: '10px',
                offsetX: '-2px',
            },
        },
        stroke: {
            show: true,
            colors: 'var(--bg-body)',
        },
        tooltip: {
            enabled: false,
        },
        theme: {
            palette: 'palette4',
        },
        responsive: [{
            breakpoint: 560,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return statusConfig;
}