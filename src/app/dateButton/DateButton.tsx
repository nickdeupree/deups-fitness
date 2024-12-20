import React, { useState, useEffect } from 'react';
import { Button, Calendar, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { DateValue } from '@internationalized/date';
import { collection, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebaseClient';
import { useAuthState } from 'react-firebase-hooks/auth';

interface DateButtonProps {
    onDateChange: (date: string) => void;
    onRangeChange: (startDate: string, endDate: string) => void;
}

interface RangeValue<T> {
    start: T;
    end: T;
}

const DateButton: React.FC<DateButtonProps> = ({ onDateChange, onRangeChange }) => {
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
    const [selectedRange, setSelectedRange] = useState<RangeValue<DateValue> | null>(null);
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    const [user] = useAuthState(auth);

    useEffect(() => {
        const fetchAvailableDates = async () => {
            if (!user) return;

            const userDocRef = doc(db, 'users', user.uid);
            const datesDocRef = doc(collection(userDocRef, 'nutrition'), 'dates');
            
            const datesDoc = await getDoc(datesDocRef);
            if (datesDoc.exists()) {
                const dates = datesDoc.data()?.dates || [];
                setAvailableDates(new Set(dates));
            }
        };

        fetchAvailableDates();
    }, [user]);


    const formatDate = (date: DateValue) => {
        return date.toString();
    }

    const handleDateChange = (date: DateValue) => {
        const formattedDate = formatDate(date);
        setSelectedDate(date);
        onDateChange(formattedDate);
    }

    const handleRangeChange = (range: RangeValue<DateValue>) => {
        const formattedStartDate = formatDate(range.start);
        const formattedEndDate = formatDate(range.end);
        setSelectedRange(range);
        onRangeChange(formattedStartDate, formattedEndDate);
    }



    const isDateUnavailable = (date: DateValue) => {
        const formattedDate = formatDate(date);
        return !availableDates.has(formattedDate);
    };

    return (
        <div>
            <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                    <Button>
                        {selectedDate ? formatDate(selectedDate) : new Date().toISOString().split('T')[0]}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="p-4">
                        <Calendar
                            disableAnimation
                            value={selectedDate}
                            onChange={(date) => handleDateChange(date)}
                            isDateUnavailable={isDateUnavailable}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DateButton;