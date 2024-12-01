import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

function Metrics() {
    const [overdueBooks, setOverdueBooks] = useState([]);
    const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
    const [membershipsData, setMembershipsData] = useState([]);

    useEffect(() => {
        fetchOverdueBooks();
        fetchMostBorrowedBooks();
        fetchMembershipsData();
    }, []);

    const fetchOverdueBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/metrics/overdue-books');
            setOverdueBooks(response.data);
        } catch (error) {
            console.error('Error fetching overdue books:', error);
        }
    };

    const fetchMostBorrowedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/metrics/most-borrowed-books', {
                params: { start_date: '2023-01-01', end_date: '2024-12-31' }
            });
            setMostBorrowedBooks(response.data);
        } catch (error) {
            console.error('Error fetching most borrowed books:', error);
        }
    };

    const fetchMembershipsData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/metrics/memberships', {
                params: { start_date: '2024-06-01', end_date: '2024-12-1' }
            });
            setMembershipsData(response.data);
        } catch (error) {
            console.error('Error fetching memberships data:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* Overdue Books Summary */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Overdue Books Summary
                        </Typography>
                        <Pie
                            data={{
                                labels: overdueBooks.map(item => `User ${item.user_id}`),
                                datasets: [
                                    {
                                        label: 'Overdue Books',
                                        data: overdueBooks.map(item => item.overdue_count),
                                        backgroundColor: [
                                            '#FF6384',
                                            '#36A2EB',
                                            '#FFCE56',
                                            '#4BC0C0',
                                            '#9966FF',
                                            '#FF9F40'
                                        ],
                                    },
                                ],
                            }}
                        />
                    </Paper>
                </Grid>

                {/* Most Borrowed Books */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Most Borrowed Books
                        </Typography>
                        <Bar
                            data={{
                                labels: mostBorrowedBooks.map(book => `Book ${book.book_id}`),
                                datasets: [
                                    {
                                        label: 'Borrow Count',
                                        data: mostBorrowedBooks.map(book => book.borrow_count),
                                        backgroundColor: 'rgba(54,162,235,0.5)',
                                        borderColor: 'rgba(54,162,235,1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    y: { // Updated scale configuration
                                        beginAtZero: true
                                    }
                                },
                            }}
                        />
                    </Paper>
                </Grid>

                {/* New Memberships vs. Renewals */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            New Memberships vs. Renewals
                        </Typography>
                        <Bar
                            data={{
                                labels: membershipsData.map(item => item.month),
                                datasets: [
                                    {
                                        label: 'New Memberships',
                                        data: membershipsData.map(item => item.new_memberships),
                                        backgroundColor: 'rgba(75,192,192,0.5)',
                                    },
                                    {
                                        label: 'Renewals',
                                        data: membershipsData.map(item => item.renewals),
                                        backgroundColor: 'rgba(255,99,132,0.5)',
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    x: { // Ensure category scale is registered
                                        type: 'category',
                                        labels: membershipsData.map(item => item.month)
                                    },
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'New Memberships vs Renewals'
                                    }
                                }
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Metrics;