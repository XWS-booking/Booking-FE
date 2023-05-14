import { Button, Flex, Input, Select } from '@chakra-ui/react';
import moment from 'moment';

export interface Props {
  from: Date;
  to: Date;
  price: number;
  pricingType: 0 | 1;

  onPriceChange: (price: number) => void;
  onPricingTypeChange: (pricingType: 0 | 1) => void;
  onFromChange: (from: Date) => void;
  onToChange: (to: Date) => void;
  onDelete: () => void;
  showDelete?: boolean;
}

export const AccommodationPricing = ({
  from,
  to,
  pricingType,
  price,
  onPricingTypeChange,
  onFromChange,
  onPriceChange,
  onToChange,
  onDelete,
  showDelete = true,
}: Props) => {
  const formatDate = (date: Date) => {
    return moment(date).format('YYYY-MM-DD');
  };
  const parseDate = (e: any) => {
    return new Date(e.target.value);
  };
  return (
    <Flex
      direction={'column'}
      gap={1}
      border={'1px solid lightgray'}
      padding={3}
    >
      <Flex justifyContent={'space-between'}>
        <Input
          placeholder={'From'}
          type={'date'}
          w={'180px'}
          value={formatDate(from)}
          onChange={(e) => onFromChange(parseDate(e))}
        />
        <Input
          placeholder={'To'}
          type={'date'}
          w={'180px'}
          value={formatDate(to)}
          onChange={(e) => onToChange(parseDate(e))}
        />
      </Flex>
      <Flex justifyContent={'space-between'}>
        <Select
          placeholder={'Choose pricing type'}
          w={'180px'}
          value={pricingType}
          onChange={(e) => onPricingTypeChange(e.target.value === '0' ? 0 : 1)}
        >
          <option value='0'>Per Guest</option>
          <option value='1'>Per Unit</option>
        </Select>
        <Input
          placeholder={'Price'}
          type={'number'}
          w={'180px'}
          value={price}
          onChange={(e) => onPriceChange(+e.target.value)}
        />
      </Flex>
      {showDelete && (
        <Button background={'red'} color={'white'} onClick={() => onDelete()}>
          Remove pricing
        </Button>
      )}
    </Flex>
  );
};
