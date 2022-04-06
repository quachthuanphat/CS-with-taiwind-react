import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Drawer } from 'antd';
const CustomerManageChart = ({ customerData, visible, onClose }) => {
    useEffect(() => {
        const processRawDataToStaticData = () => {
            if (!customerData || !customerData.length) return [];
            return [
                customerData.filter((customer) => (customer.gender === 'male')).length,
                customerData.filter((customer) => (customer.gender === 'female')).length
            ];
        };

        const statisticData = processRawDataToStaticData();
        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Male', 'Female'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: statisticData,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        return () => {
            myChart.destroy();
        }
    }, [customerData, visible]);

    return (
        <Drawer title="Customer Analysis" placement="right" onClose={onClose} visible={visible}>
            <div className="chart-container" style={{ position: 'relative', height: '200px', width: '300px' }}>
                <canvas id="myChart"></canvas>
            </div>
        </Drawer>
    );
};

export default CustomerManageChart;
