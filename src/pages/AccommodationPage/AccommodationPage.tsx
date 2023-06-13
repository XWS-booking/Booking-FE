import { Flex, Spinner, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AccommodationCard } from '../../components/Accommodations/AccommodationCard';
import { AccommodationFiltering } from '../../components/Accommodations/AccommodationFilters';
import { SearchAccommodation } from '../../components/Accommodations/SearchAccommodation';
import { EditAccommodationForm } from '../../components/EditAccommodationForm/EditAccommodationForm';
import {
  AccommodationFilters,
  AccommodationFiltersAdditions,
} from '../../store/accommodation-store/types/accommodation.filters.type';
import { Accommodation } from '../../store/accommodation-store/types/accommodation.type';
import { AccommodationSearchFilters } from '../../store/accommodation-store/types/accomodation-search-filters.type';
import { useApplicationStore } from '../../store/application.store';
import '../../styles/pagination.css';

export const AccommodationPage = () => {
  const getAccommodations = useApplicationStore(
    (state) => state.getAccommodations
  );
  const accommodationPageRes = useApplicationStore(
    (state) => state.accommodationPageRes
  );
  const [selectedId, setSelectedId] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchFilters, setSearchFilters] =
    useState<AccommodationSearchFilters>({
      city: '',
      endDate: new Date('0001-01-01T00:00:00Z'),
      startDate: new Date('0001-01-01T00:00:00Z'),
      guests: -1,
      pageNumber: 1,
      pageSize: 4,
    });
  const [additionalFilters, setAdditionalFilters] =
    useState<AccommodationFilters>({
      additions: [],
      price: { from: 0, to: 500 },
    });

  useEffect(() => {
    fetchAccommodations(searchFilters);
  }, []);

  const filterByParams = async (
    city: string,
    guests: number,
    startDate: Date,
    endDate: Date
  ) => {
    const newFilters: AccommodationSearchFilters = {
      city,
      guests,
      startDate,
      endDate,
      pageNumber: 1,
      pageSize: searchFilters.pageSize,
    };

    setSearchFilters({ ...searchFilters, ...newFilters });
    await fetchAccommodations(newFilters);
  };

  const handleEditSelected = (item: Accommodation) => {
    setSelectedId(item.id);
    onOpen();
  };

  const handlePageClick = async (event: any) => {
    const newFilters = { ...searchFilters, pageNumber: event.selected + 1 };
    setSearchFilters(newFilters);
    await fetchAccommodations(newFilters);
  };

  const fetchAccommodations = async (filters: AccommodationSearchFilters) => {
    await getAccommodations(filters, additionalFilters);
  };

  const handleChecked = (
    field: AccommodationFiltersAdditions,
    val: boolean
  ) => {
    if (val) {
      setAdditionalFilters({
        ...additionalFilters,
        additions: [...additionalFilters.additions, field],
      });
      return;
    }
    setAdditionalFilters({
      ...additionalFilters,
      additions: additionalFilters.additions.filter((add) => add != field),
    });
  };

  const handleOnFilter = () => {
    fetchAccommodations(searchFilters);
  };
  const handlePriceChange = (values: number[]) => {
    setAdditionalFilters({
      ...additionalFilters,
      price: { from: values[0], to: values[1] },
    });
  };

  useEffect(() => {
    fetchAccommodations(searchFilters);
  }, [additionalFilters]);

  return (
    <>
      <SearchAccommodation filterByParams={filterByParams} />
      <AccommodationFiltering
        filters={additionalFilters}
        handleChecked={handleChecked}
        handlePriceChange={handlePriceChange}
        onFilter={handleOnFilter}
      />
      <Flex flexDirection='column' justifyContent='center' alignItems='center'>
        {accommodationPageRes.data.data &&
          accommodationPageRes.data.data.map((item: Accommodation) => (
            <AccommodationCard
              key={item.id}
              accommodation={item}
              onEditSelected={() => handleEditSelected(item)}
            />
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
          forcePage={searchFilters.pageNumber - 1}
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
