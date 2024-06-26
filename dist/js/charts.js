function loadThreads(data) {
    let threads = [];
    data.filter(item => item.Status.toLowerCase().trim() !== 'archived').forEach(item => {
        let delayClass = getDelay(item.LastUpdated);
        let thread = {
            status: item.Status ? item.Status.toLowerCase().trim() : '',
            partners: item.Partner ? item.Partner.split('#')[0] : '',
            type: item.Type ? item.Type.toLowerCase().trim() : '',
            delay: delayClass,
        }
        threads = [...threads, thread];
    });

    return threads;
}

function loadCharts(threads) {
    let timeChart = new ApexCharts(document.querySelector(".chart--time"), configTime(threads));
    timeChart.render();
    let statusChart = new ApexCharts(document.querySelector(".chart--status"), configStatus(threads));
    statusChart.render();
    let typeChart = new ApexCharts(document.querySelector(".chart--type"), configType(threads));
    typeChart.render();
    let totalPartnerChart = new ApexCharts(document.querySelector(".chart--tpartner"), configTotalPartners(threads));
    totalPartnerChart.render();
    let currentPartnerChart = new ApexCharts(document.querySelector(".chart--cpartner"), configCurrentPartners(threads, true));
    currentPartnerChart.render();
    let owingChart = new ApexCharts(document.querySelector(".chart--owing"), configOwing(threads));
    owingChart.render();

    window.addEventListener('resize', () => {
        let timeChart = new ApexCharts(document.querySelector(".chart--time"), configTime(threads));
        timeChart.render();
        let statusChart = new ApexCharts(document.querySelector(".chart--status"), configStatus(threads));
        statusChart.render();
        let typeChart = new ApexCharts(document.querySelector(".chart--type"), configType(threads));
        typeChart.render();
        let totalPartnerChart = new ApexCharts(document.querySelector(".chart--tpartner"), configTotalPartners(threads));
        totalPartnerChart.render();
        let currentPartnerChart = new ApexCharts(document.querySelector(".chart--cpartner"), configCurrentPartners(threads, true));
        currentPartnerChart.render();
        let owingChart = new ApexCharts(document.querySelector(".chart--owing"), configOwing(threads));
        owingChart.render();
    });
}

function configTime(threads) {
    let activeThreads = threads.filter(item => item.status !== 'complete' && item.status !== 'planned');
    let recent = activeThreads.filter(thread => thread.delay === 'okay').length;
    let week = activeThreads.filter(thread => thread.delay === 'week').length;
    let month = activeThreads.filter(thread => thread.delay === 'month').length;
    let quarter = activeThreads.filter(thread => thread.delay === 'quarter').length;
    let half = activeThreads.filter(thread => thread.delay === 'half').length;
    let year = activeThreads.filter(thread => thread.delay === 'year').length;
    let timeConfig = {
        series: [recent, week, month, quarter, half, year],
        labels: ['Recent', 'Over a week', 'Over a month', 'Over 3 months', 'Over 6 months', 'Over a year'],
        colors: ['rgb(146, 172, 125)', 'rgb(174, 176, 121)', 'rgb(196, 179, 131)', 'rgb(193, 160, 135)', 'rgb(193, 138, 135)', 'rgb(189, 112, 112)'],
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

    return timeConfig;
}

function configStatus(threads) {
    let owing = threads.filter(thread => thread.status === 'mine' || thread.status === 'start').length;
    let active = threads.filter(thread => thread.status === 'theirs').length;
    let hoarded = threads.filter(thread => thread.status === 'hoarded').length;
    let complete = threads.filter(thread => thread.status === 'complete').length;
    let statusConfig = {
        series: [owing, hoarded, active, complete],
        labels: ['Mine', 'Hoarded', 'Theirs','Completed'],
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

function configType(threads) {
    let threadCount = threads.filter(thread => thread.type === 'thread').length;
    let comms = threads.filter(thread => thread.type === 'comm').length;
    let events = threads.filter(thread => thread.type === 'event').length;
    let oneshots = threads.filter(thread => thread.type === 'one-shot').length;
    let typeConfig = {
        series: [threadCount, comms, events, oneshots],
        labels: ['Threads', 'Comms', 'Events', 'One-shots'],
        colors: ['rgb(141, 165, 176)', 'rgb(174, 140, 161)', 'rgb(125, 159, 129)', 'rgba(189, 173, 133)'],
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

    return typeConfig;
}

function configCurrentPartners(threads, onlyStarted = false) {
    if(onlyStarted) {
        threads = threads.filter(thread => thread.status && thread.status !== '' && (thread.status.toLowerCase().trim() === 'mine' || thread.status.toLowerCase().trim() === 'theirs' || thread.status.toLowerCase().trim() === 'hoarded'));
    }
    let threadPartners = threads.map(thread => thread.partners.split('+').map(item => JSON.parse(item)));
    let partnerNames = [];
    threadPartners.forEach(thread => {
        thread.forEach(threadPartner => {
            partnerNames.push(threadPartner.partner);
        });
    });
    let consolidatedPartners = [...new Set(partnerNames)];
    let partnerCounts = consolidatedPartners.reduce((accumulator, value) => {
        return {...accumulator, [value]: 0};
    }, {});
    threads.forEach(thread => {
        let thisPartners = thread.partners.split('+').map(item => JSON.parse(item)).map(item => item.partner);
        thisPartners.forEach(partner => {
            partnerCounts[partner]++;
        });
    });
    let partners = [], counts = [], final = [];
    for (const partnerName in partnerCounts) {
        partners.push(capitalize(partnerName, [`'`, `-`]));
        counts.push(partnerCounts[partnerName]);
        final.push({
            x: capitalize(partnerName, [`'`, `-`]).trim(),
            y: partnerCounts[partnerName],
            fillColor: 'var(--accent)',
        })
    }
    final.sort((a, b) => {
        if(a.y > b.y) {
            return -1;
        } else if (a.y < b.y) {
            return 1;
        } else if (a.x < b.x) {
            return -1;
        } else if (a.x > b.x) {
            return 1;
        } else {
            return 0;
        }
    });
    final = final.filter(item => item.x.toLowerCase() !== 'npc' && item.x.toLowerCase() !== 'open');
    let currentPartnerConfig = {
        series: [{data: final}],
        chart: {
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
    };

    return currentPartnerConfig;    
}

function configTotalPartners(threads) {
    let threadPartners = threads.map(thread => thread.partners.split('+').map(item => JSON.parse(item)));
    let partnerNames = [];
    threadPartners.forEach(thread => {
        thread.forEach(threadPartner => {
            partnerNames.push(threadPartner.partner);
        });
    });
    let consolidatedPartners = [...new Set(partnerNames)];
    let partnerCounts = consolidatedPartners.reduce((accumulator, value) => {
        return {...accumulator, [value]: 0};
    }, {});
    threads.forEach(thread => {
        let thisPartners = thread.partners.split('+').map(item => JSON.parse(item)).map(item => item.partner);
        thisPartners.forEach(partner => {
            partnerCounts[partner]++;
        });
    });
    let partners = [], counts = [], final = [];
    for (const partnerName in partnerCounts) {
        partners.push(capitalize(partnerName, [`'`, `-`]));
        counts.push(partnerCounts[partnerName]);
        final.push({
            x: capitalize(partnerName, [`'`, `-`]).trim(),
            y: partnerCounts[partnerName],
            fillColor: 'var(--accent)',
        })
    }
    final.sort((a, b) => {
        if(a.y > b.y) {
            return -1;
        } else if (a.y < b.y) {
            return 1;
        } else if (a.x < b.x) {
            return -1;
        } else if (a.x > b.x) {
            return 1;
        } else {
            return 0;
        }
    });
    final = final.filter(item => item.x.toLowerCase() !== 'npc' && item.x.toLowerCase() !== 'open');
    let totalPartnerConfig = {
        series: [{data: final}],
        chart: {
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
    };

    return totalPartnerConfig;
}

function configOwing(threads) {
    let owingThreads = threads.filter(thread => thread.status === 'mine' || thread.status === 'start');
    let threadPartners = owingThreads.map(thread => thread.partners.split('+').map(item => JSON.parse(item)));
    let partnerNames = [];
    threadPartners.forEach(thread => {
        thread.forEach(threadPartner => {
            partnerNames.push(threadPartner.partner);
        });
    });

    let consolidatedPartners = [...new Set(partnerNames)];
    let partnerCounts = consolidatedPartners.reduce((accumulator, value) => {
        return { ...accumulator, [value]: 0 };
    }, {});

    owingThreads.forEach(thread => {
        let thisPartners = thread.partners.split('+').map(item => JSON.parse(item)).map(item => item.partner);
        thisPartners.forEach(partner => {
            partnerCounts[partner]++;
        });
    });

    let partners = [], counts = [], final = [];
    for (const partnerName in partnerCounts) {
        partners.push(capitalize(partnerName, [`'`, `-`]));
        counts.push(partnerCounts[partnerName]);
        final.push({
            x: capitalize(partnerName, [`'`, `-`]).trim(),
            y: partnerCounts[partnerName],
            fillColor: 'var(--accent)',
        })
    }

    final.sort((a, b) => {
        if (a.y > b.y) {
            return -1;
        } else if (a.y < b.y) {
            return 1;
        } else if (a.x < b.x) {
            return -1;
        } else if (a.x > b.x) {
            return 1;
        } else {
            return 0;
        }
    });

    final = final.filter(item => item.x.toLowerCase() !== 'npc' && item.x.toLowerCase() !== 'open');

    let owingConfig = {
        series: [{ data: final }],
        chart: {
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
    };

    return owingConfig;
}
