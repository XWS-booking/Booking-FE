import {Box, Button, Flex, Input} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
import { useApplicationStore } from '../store/application.store';

interface Props {
    sendData: (city: string, guests: number, startDate: Date, endDate: Date) => void
 }

export const SearchAccommodation = ({sendData}: Props) => {

    const getAccommodations = useApplicationStore(state => state.getAccommodations)
    const [city, setCity] = useState<string>("")
    const [guests, setGuests] = useState<number>(-1)
    const [startDate, setStartDate] = useState<Date>(new Date("0001-01-01T00:00:00Z"))
    const [endDate, setEndDate] = useState<Date>(new Date("0001-01-01T00:00:00Z"))


    const handleCityInputChange = (event: any) => {
        setCity(event.target.value);
    };

    const handleGuestsInputChange = (event: any) => {
        if (event.target.value == "")
            setGuests(-1)
        else 
            setGuests(event.target.value);
    };
      
    const handleStartDateInputChange = (event: any) => {
        if (event.target.value == "")
            setStartDate(new Date("0001-01-01T00:00:00Z"))
        else 
            setStartDate(new Date(event.target.value));
    };

    const handleEndDateInputChange = (event: any) => {
        if (event.target.value == "")
            setEndDate(new Date("0001-01-01T00:00:00Z"))
        else 
            setEndDate(new Date(event.target.value));
      };
    
    const onSubmit = async () => {
        await getAccommodations(city, guests, startDate, endDate, 4, 1)
        sendData(city, guests, startDate, endDate)
    }

    return (
        <>
        <Box padding="10">
        <Form onSubmit={onSubmit}>
            <Flex flexDirection='row'>
            <Input name="city" onChange={handleCityInputChange} placeholder='City'></Input>
            <Input name="guests" onChange={handleGuestsInputChange} placeholder='Guests' type='number' min='1'></Input>
            <Input name="startDate" onChange={handleStartDateInputChange} placeholder='Start date' type='date'></Input>
            <Input name="endDate"  onChange={handleEndDateInputChange} placeholder='End date' type='date'></Input>
            <Button type="submit" mb={'15px'} width="200px">Search</Button>
            </Flex>
        </Form>
        </Box>
      </>
    )
}
