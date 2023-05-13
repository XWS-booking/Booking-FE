import { useEffect, useState } from 'react';
import { useApplicationStore } from '../../store/application.store';
import { Flex, Spinner, useDisclosure } from '@chakra-ui/react';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import { AccommodationCard } from '../../components/Accommodations/AccommodationCard';
import '../../styles/pagination.css';
import ReactPaginate from 'react-paginate';
import { SearchAccommodation } from '../../components/Accommodations/SearchAccommodation';
import { AccomodationsFilter } from '../../store/accommodation-store/types/accomodations-filter.type';
import { EditAccommodationForm } from '../../components/EditAccommodationForm/EditAccommodationForm';

export const AccommodationPage = () => {
  const getAccommodations = useApplicationStore(
    (state) => state.getAccommodations
  );
  const accommodationPageRes = useApplicationStore(
    (state) => state.accommodationPageRes
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [city, setCity] = useState<string>('');
  const [guests, setGuests] = useState<number>(-1);
  const [startDate, setStartDate] = useState<Date>(
    new Date('0001-01-01T00:00:00Z')
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date('0001-01-01T00:00:00Z')
  );
  const [selectedId, setSelectedId] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const filters: AccomodationsFilter = {
      city,
      guests,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      pageSize: 4,
      pageNumber: currentPage,
    };
    fetchAccommodations(filters);
  }, []);

  const filterByParams = async (
    city: string,
    guests: number,
    startDate: Date,
    endDate: Date
  ) => {
    setCity(city);
    setGuests(guests);
    setStartDate(startDate);
    setEndDate(endDate);
    setCurrentPage(1);
    await fetchAccommodations({
      city,
      guests,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      pageSize: 4,
      pageNumber: 1,
    });
  };

  const handleEditSelected = (item: Accommodation) => {
    setSelectedId(item.id);
    onOpen();
  };

  const handlePageClick = async (event: any) => {
    const filters: AccomodationsFilter = {
      city,
      guests,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      pageSize: 4,
      pageNumber: event.selected + 1,
    };
    await fetchAccommodations(filters);
    setCurrentPage(event.selected + 1);
  };

  const fetchAccommodations = async (filters: AccomodationsFilter) => {
    await getAccommodations(filters);
  };

  return (
    <>
      <SearchAccommodation
        filterByParams={filterByParams}
      ></SearchAccommodation>
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        {accommodationPageRes.data.data &&
          accommodationPageRes.data.data.map((item: Accommodation) => (
            <AccommodationCard
              key={item.id}
              accommodation={item}
              onEditSelected={() => handleEditSelected(item)}
            ></AccommodationCard>
          ))}

        {accommodationPageRes.status === 'LOADING' && (
          <Flex justifyContent='center'>
            <Spinner size='xl' />
          </Flex>
        )}
      </Flex>
      <Flex
        flexDirection='column'
        justifyContent='column'
        padding='15px 20px'
        boxSizing='border-box'
        width='100%'
        height='100%'
        mt={'auto'}
      >
        <ReactPaginate
          activeClassName={'item active '}
          forcePage={currentPage - 1}
          breakClassName={'item break-me '}
          breakLabel={'...'}
          containerClassName={'pagination'}
          disabledClassName={'disabled-page'}
          marginPagesDisplayed={2}
          nextClassName={'item next '}
          nextLabel='>'
          onPageChange={handlePageClick}
          pageCount={Math.ceil(accommodationPageRes.data.totalCount / 4)}
          pageClassName={'item pagination-page '}
          pageRangeDisplayed={2}
          previousClassName={'item previous'}
          previousLabel='<'
        />
      </Flex>
      <EditAccommodationForm
        isOpen={isOpen}
        onClose={onClose}
        id={selectedId}
      />
    </>
  );
};
