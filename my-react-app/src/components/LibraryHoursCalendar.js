import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

function LibraryHoursCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [libraryHours, setLibraryHours] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const day = date.getDay();
    let hours = '';

    switch (day) {
      case 0: // Sunday
        hours = '12:00 PM - 5:00 PM';
        break;
      case 6: // Saturday
        hours = '10:00 AM - 6:00 PM';
        break;
      default: // Monday to Friday
        hours = '9:00 AM - 9:00 PM';
    }

    setLibraryHours(hours);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ 
      
      '& .MuiDayPicker-monthContainer': {
        minHeight: 'auto',
      },
      '& .MuiPickersDay-root': {
        width: '32px',
        height: '32px',
        fontSize: '0.75rem',
        color: '#000',  // Makes the day numbers black
      },
      '& .MuiTypography-root': {
        color: '#000',  // Makes all typography elements black
      },
      '& .MuiDayPicker-weekDayLabel': {
        color: '#000',  // Makes weekday labels black
      },
      '& .MuiPickersDay-today': {
        color: '#000',  // Makes today's date black
      }
    }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <Box {...params} />}
          disablePast
          showDaysOutsideCurrentMonth
        />
      </LocalizationProvider>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { width: '300px' }
        }}
      >
        <DialogTitle>Library Timings</DialogTitle>
        <DialogContent>
          <Typography>
            The library is open on {selectedDate.toLocaleDateString()} from {libraryHours}.
          </Typography>
          <Button 
            onClick={() => setOpenDialog(false)} 
            sx={{ mt: 2 }} 
            variant="contained"
            fullWidth
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default LibraryHoursCalendar;