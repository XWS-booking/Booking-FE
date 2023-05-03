import {Box, Button, Flex, FormControl, FormLabel, Input} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Form } from 'react-router-dom';

interface Props {
    filterByParams: (city: string, guests: number, startDate: Date, endDate: Date) => void
 }

export const SearchAccommodation = ({filterByParams}: Props) => {
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
        filterByParams(city, guests, startDate, endDate)
    }

    return (
        <>
        <Box padding="2">
        <Form onSubmit={onSubmit}>
            <Flex flexDirection='row'>
            <FormControl>
                <FormLabel mb='0'>City</FormLabel>
                <Input name="city" onChange={handleCityInputChange} placeholder='Enter city'></Input>
            </FormControl>
            <FormControl>
                <FormLabel mb='0'>Guests</FormLabel>
                <Input name="guests" onChange={handleGuestsInputChange} placeholder='Enter number of guests' type='number' min='1'></Input>
            </FormControl>
            <FormControl>
                <FormLabel mb='0'>Start Date</FormLabel>
                <Input name="startDate" onChange={handleStartDateInputChange} type='date'></Input>
            </FormControl>
            <FormControl>
                <FormLabel mb='0'>End Date</FormLabel>
                <Input name="endDate"  onChange={handleEndDateInputChange} type='date'></Input>
            </FormControl>
            <Button type="submit" mt='6' mb={'15px'} width="200px">Search</Button>
            </Flex>
        </Form>
        </Box>
      </>
    )
}
