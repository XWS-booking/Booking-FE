import {
  Button,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  AccommodationFilters,
  AccommodationFiltersAdditions,
} from '../../store/accommodation-store/types/accommodation.filters.type';

export interface Props {
  onFilter: (data: AccommodationFilters) => void;
  filters: AccommodationFilters;
  handleChecked: (field: AccommodationFiltersAdditions, value: boolean) => void;
  handlePriceChange: (values: number[]) => void;
}

export const AccommodationFiltering = ({
  onFilter,
  filters,
  handleChecked,
  handlePriceChange,
}: Props) => {
  const { isOpen, onToggle } = useDisclosure();
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(500);
  //   const getMinMaxPrice = useApplicationStore((state) => state.getMinMaxPrice);

  const handleSubmitFilters = () => {
    onFilter(filters);
  };

  useEffect(() => {
    // getMinMaxPrice()
    //   .then((res) => {
    //     setMin(res.min);
    //     setMax(res.max);
    //   })
    //   .catch(console.log);
  }, []);

  return (
    <Flex className='filter-wrapper' w='50%'>
      <Menu isOpen={isOpen}>
        <MenuButton as={Button} maxW='150px' onClick={() => onToggle()}>
          Show filters
        </MenuButton>
        <Portal>
          <MenuList>
            <MenuGroup title='Price'>
              <MenuItem>
                <RangeSlider
                  onChangeEnd={(values) => handlePriceChange(values)}
                  aria-label={['min', 'max']}
                  min={min}
                  max={max}
                  defaultValue={[0, 100]}
                  maxW='200px'
                  w='200px'
                  padding={'20px 0px'}
                  aria-labelledby={['min', 'max']}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0}>
                    {filters.price.from}
                  </RangeSliderThumb>
                  <RangeSliderThumb index={1}>
                    {filters.price.to}
                  </RangeSliderThumb>
                </RangeSlider>
              </MenuItem>
            </MenuGroup>
            <MenuGroup title='Additional'>
              <MenuItem>
                <Checkbox
                  onChange={(e) => handleChecked('wifi', e.target.checked)}
                  isChecked={filters.additions.some((val) => val === 'wifi')}
                >
                  Wifi
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  onChange={(e) => handleChecked('kitchen', e.target.checked)}
                  isChecked={filters.additions.some((val) => val === 'kitchen')}
                >
                  Kitchen
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  onChange={(e) =>
                    handleChecked('air_conditioner', e.target.checked)
                  }
                  isChecked={filters.additions.some(
                    (val) => val === 'air_conditioner'
                  )}
                >
                  Air Conditioner
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  onChange={(e) =>
                    handleChecked('free_parking', e.target.checked)
                  }
                  isChecked={filters.additions.some(
                    (val) => val === 'free_parking'
                  )}
                >
                  Free Parking
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  onChange={(e) =>
                    handleChecked('featuredHostOnly', e.target.checked)
                  }
                  isChecked={filters.additions.some(
                    (val) => val === 'featuredHostOnly'
                  )}
                >
                  Featured host only
                </Checkbox>
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <Button onClick={handleSubmitFilters}>Filter</Button>
            </MenuGroup>
          </MenuList>
        </Portal>
      </Menu>
    </Flex>
  );
};
